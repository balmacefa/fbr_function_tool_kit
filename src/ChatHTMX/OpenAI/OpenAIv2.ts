import OpenAI from "openai";


export type myFunction = (args: any) => any;

export interface AssistantManifest {

    id: string;
    assistantId: string;
    threadId?: string | null | undefined;
    name: string;
    description: string;
    functions?: Map<string, myFunction>;
}


export class OpenAIAssistantWrapperV2 {
    assistantId: string;
    threadId!: string;
    public open_ai_client: OpenAI;
    // private openAIFiles: OpenAIFiles;
    // this is a map of functions that can be called by the assistant
    private functions: Map<string, myFunction>;

    constructor(args: AssistantManifest) {
        this.assistantId = args.assistantId;
        this.threadId = args.threadId || "";
        this.functions = args.functions || new Map<string, myFunction>();
        this.open_ai_client = new OpenAI();
    }

    public async get_chat_messages(): Promise<OpenAI.Beta.Threads.Messages.MessagesPage> {
        const msgs = await this.open_ai_client.beta.threads.messages.list(this.threadId, { order: "asc" });
        return msgs;
    }

    private async createThread(): Promise<string> {
        const thread: OpenAI.Beta.Threads.Thread = await this.open_ai_client.beta.threads.create();
        return thread.id;
    }

    private async addMessageToThread(content: string): Promise<OpenAI.Beta.Threads.Message> {
        return await this.open_ai_client.beta.threads.messages.create(this.threadId, {
            role: "user",
            content: content,
        });
    }

    private async createRun(): Promise<OpenAI.Beta.Threads.Runs.Run> {
        return await this.open_ai_client.beta.threads.runs.create(this.threadId, {
            assistant_id: this.assistantId,
        });
    }

    private async handleToolCalls(tool_calls: any[], runObject: OpenAI.Beta.Threads.Runs.Run): Promise<void> {

        const toolOutputs: {
            tool_call_id: string;
            output: string;
        }[] = [];

        // Procesa cada llamada a herramienta
        const promises = tool_calls.map(async (tool_call) => {
            try {
                console.log(`Tool call id: ${tool_call.id}`);
                console.log(`Tool type: ${tool_call.type}`);
                console.log(`Tool call function: ${tool_call.function.name}`);
                console.log(`Tool call function arguments: ${tool_call.function.arguments}`);

                const parsedArgs = JSON.parse(tool_call.function.arguments);
                const functionToCall: myFunction = this.functions.get(tool_call.function.name) || ((args: any) => {
                    console.error(`Function not found: ${tool_call.function.name}`);
                });
                const response = await functionToCall(parsedArgs);
                console.log(`Function response: ${JSON.stringify(response)}`);

                // Agrega la respuesta al array toolOutputs
                toolOutputs.push({
                    tool_call_id: tool_call.id,
                    output: JSON.stringify(response),
                });
            } catch (error) {
                console.error(`Error processing tool call id: ${tool_call.id}`, error);
                toolOutputs.push({
                    tool_call_id: tool_call.id,
                    output: `Error processing tool call id: ${tool_call.id}, tool type: ${tool_call.type}, function: ${tool_call.function.name}, error: ${JSON.stringify(error)}`,
                });
            }
        });

        // Espera a que todas las promesas se resuelvan
        await Promise.all(promises);

        // Envía todas las salidas en una sola solicitud
        await this.open_ai_client.beta.threads.runs.submitToolOutputs(this.threadId, runObject.id, {
            tool_outputs: toolOutputs,
            stream: false,
        });
    }


    private async checkStatus(runObject: OpenAI.Beta.Threads.Runs.Run): Promise<boolean> {
        runObject = await this.open_ai_client.beta.threads.runs.retrieve(this.threadId, runObject.id);
        if (runObject.status === 'completed') {
            console.log('Run completed');
            return true;
        } else if (runObject.status === 'requires_action' && runObject.required_action && runObject.required_action.type === 'submit_tool_outputs') {
            console.log('requires_action.. looking for a function');
            console.log('submit tool outputs ...');
            const tool_calls = runObject.required_action.submit_tool_outputs.tool_calls;

            await this.handleToolCalls(tool_calls, runObject);
        }
        return false;
    }

    public async execute_agent(content: string) {
        try {
            if (!this.threadId) {
                this.threadId = await this.createThread();
            }

            await this.addMessageToThread(content);
            let runObject = await this.createRun();

            while (!(await this.checkStatus(runObject))) {
                await new Promise(r => setTimeout(r, 100));
                runObject = await this.open_ai_client.beta.threads.runs.retrieve(this.threadId, runObject.id);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
}

