import { OpenAIClient } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import { AgentAction, AgentFinish, AgentStep } from "langchain/dist/schema";
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { StructuredTool } from "langchain/tools";
import { isString } from "lodash";
import { BaseToolPlugin } from "../../ToolFunction/BaseToolPlugin";

export interface AssistantOptions {
    model: string;
    assistantId?: string | null;
    name: string;
    instructions?: string;
    description: string;
    BaseToolPlugin?: BaseToolPlugin;
}

export interface AssistantManifest extends AssistantOptions {
    show_case: boolean;
}

interface ExcutorOutput {
    finishStep: any;
    output: string;
    intermediateSteps: IntermediateStep[];
    threadId: string;
}

interface IntermediateStep {
    action: ActionDetails;
    observation: string;
}

interface ActionDetails {
    tool: string;
    toolInput: ToolInput;
    toolCallId: string;
    log: string;
    runId: string;
    threadId: string;
}

interface ToolInput {
    directoryPath: string;
    depth: number;
}



// TODO: create a method to export to save, and to inport save
class OpenAIAssistantWrapper {
    private assistant: OpenAIAssistantRunnable<true, Record<string, any>> | undefined;
    private BaseToolPlugin?: BaseToolPlugin;
    assistantId?: string | null;
    name?: string;
    instructions?: string;
    private model?: string;
    public open_ai_client: OpenAIClient;
    // private openAIFiles: OpenAIFiles;

    constructor(options: AssistantOptions) {
        this.model = options.model;
        this.assistantId = options.assistantId;
        this.BaseToolPlugin = options.BaseToolPlugin;
        this.name = options.name;
        this.instructions = options.instructions;
        this.open_ai_client = new OpenAIClient();
        console.info("dev: run .get_or_create_assistant to start when ready! ")
    }

    public async get_or_create_assistant(assistant_id?: string | undefined | null): Promise<void> {
        // Method to create a new assistant
        if (assistant_id || isString(this.assistantId)) {
            assistant_id = assistant_id ? assistant_id : (this.assistantId as string);
            try {
                // TODO, create a class que herede de OpenAIAssistantRunnable y agregue un metodo para 
                this.assistant = new OpenAIAssistantRunnable({
                    assistantId: assistant_id,
                    asAgent: true
                });
                this.assistantId = (await this.assistant.getAssistant()).id;

            } catch (error) {
                console.error(error);
                console.error('Createing a new assistant instead');
                this.assistant = await this._create_assistant();
                this.assistantId = (await this.assistant.getAssistant()).id;
            }
        } else {
            this.assistant = await this._create_assistant();
            this.assistantId = (await this.assistant.getAssistant()).id;
            // todo: add manifest asistance auto save feature here
        }

        console.info("dev: run .invoke(prompt_content) to start or continue a thread")
    }

    private async _create_assistant() {
        // Method to create a new assistant
        const assistant = await OpenAIAssistantRunnable.createAssistant({
            model: this.model || "gpt-4-1106-preview",
            ...(this.BaseToolPlugin ? { tools: this.BaseToolPlugin.generate_func_asistant_list() } : {}),
            asAgent: true,
            name: this.name,
            instructions: this.instructions,
        });
        const assistant_run = new OpenAIAssistantRunnable({
            assistantId: assistant.assistantId,
            asAgent: true
        });
        return assistant_run;
    }

    public async get_chat_messages(threadId: string) {
        const messages = await this.open_ai_client.beta.threads.messages.list(threadId, {
            order: "asc",
        });
        return messages;
    }

    public async invoke(content: string, thread_id?: string | null) {

        // Invoke should olso execute tools
        const assistant = this.assistant;
        if (!assistant) {
            throw new Error("Dev error, forget to creat or get assistant")
        }

        const assistantResponse = await assistant.invoke({
            content,
            ...(thread_id ? { threadId: thread_id } : {}), // Include threadId only if it's truthy
            // todo: maybe files? uploads?
        });
        return assistantResponse;
    }
    public async execute_agent(content: string, thread_id?: string | null) {
        if (!this.assistant) {
            throw new Error("Dev error, forget to creat or get assistant")
        } else {

            // this.assistant.prepareForOutput = function (args:any)


            const executor = AgentExecutor.fromAgentAndTools({
                agent: this.assistant,
                ...(this.BaseToolPlugin ? { tools: this.BaseToolPlugin.generate_func_asistant_list_lang_chain() } : { tools: [] }),
                returnIntermediateSteps: true,
            });
            const response = await executor.invoke({
                content,
                ...(thread_id ? {
                    id: thread_id,
                    threadId: thread_id,
                } : {})
            }) as ExcutorOutput;
            response.threadId = this.getThreadIdFromExcutorReq(response);

            return response;

        }
    }

    private getThreadIdFromExcutorReq(response: ExcutorOutput) {

        return response.threadId = response.finishStep.threadId;
    }

    public isAgentFinish(response: any): response is AgentFinish {
        return (response as AgentFinish).returnValues !== undefined;
    }

    public isAgentStep(response: any): response is AgentStep {
        return (response as AgentStep).action !== undefined &&
            (response as AgentStep).observation !== undefined;
    }


    public isAgentAction(response: any): response is AgentAction {
        return !this.isAgentFinish(response) && !this.isAgentStep(response);
    }

    // public async updateAssistant(): Promise<void> {
    //     // Method to modify an existing assistant
    //     if (this.assistant) {
    //         const assistantModified = await this.assistant.modifyAssistant({
    //             name: this.name,
    //             instructions: this.instructions,
    //             model: this.modelId,
    //         });
    //         this.assistant = assistantModified;
    //     }
    // }

    public async deleteAssistant(): Promise<boolean> {
        if (this.assistant) {
            const deleteStatus = await this.assistant.deleteAssistant();
            return deleteStatus.deleted
        }
        return false;
    }

    public useTool(tool: StructuredTool): void {
        // Add a tool to the assistant
    }

    public removeTool(toolName: string): void {
        // Remove a tool from the assistant
    }

    // File management methods
    // public async createFile(fileOptions: FileOptions): Promise<void> {
    //     // Create a new file
    // }

    public async deleteFile(fileId: string): Promise<void> {
        // Delete a file
    }

    public async retrieveFile(fileId: string): Promise<any> {
        // Retrieve file information
    }

    public async retrieveFileContent(fileId: string): Promise<any> {
        // Retrieve file content
    }

    public async listFiles(purpose?: string): Promise<any> {
        // List all files
    }

    // Private utility methods can be added here
}

export default OpenAIAssistantWrapper;
