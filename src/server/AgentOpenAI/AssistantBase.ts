import fs from 'fs';
import OpenAI from "openai";
import { MessageCreateParams } from 'openai/resources/beta/threads/messages/messages';
import { RunSubmitToolOutputsParams } from 'openai/resources/beta/threads/runs/runs';
import { Md5 } from 'ts-md5';
import { MainUtils } from '../../main_utils';
import { FunctionalTool } from './FunctionalTool';

const openai = new OpenAI(
    {
        apiKey: "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",
    }
);

const md5 = new Md5();

export interface AssistantsAPIBaseArgs {
    name: string;
    description: string;
    instructions_path: string;
    tools: FunctionalTool[];
    model?: string;
    file_ids?: string[];
}


export abstract class AssistantsAPIBase {
    args: AssistantsAPIBaseArgs;
    client: OpenAI; // Define the correct type for the OpenAI client
    gpt_assistant: OpenAI.Beta.Assistants.Assistant | undefined;
    thread: OpenAI.Beta.Threads.Thread | undefined;

    last_run: OpenAI.Beta.Threads.Run | undefined;

    run_list: OpenAI.Beta.Threads.Run[] = [];

    // Tool map, tool name to tool
    tool_map = new Map<string, FunctionalTool>();
    last_run_status: OpenAI.Beta.Threads.Runs.Run | undefined;
    last_run_messages: OpenAI.Beta.Threads.Messages.ThreadMessagesPage | undefined;

    // file_hash_regex = new RegExp("# FILE_HASH: [a-zA-Z0-9]+"); include especial characters like -_,.% etc
    file_hash_regex = new RegExp("# FILE_HASH: [a-zA-Z0-9-_]+");

    assistant_id_regex = new RegExp("# ASSISTANT ID: [a-zA-Z0-9-_]+");

    constructor(args: AssistantsAPIBaseArgs) {
        this.args = args;
        this.client = openai;
    }

    // generate Assistant
    generate_hash(instructions: string): string {
        md5.appendStr(this.gpt_assistant?.id || "no id");
        md5.appendStr(this.args.name);
        md5.appendStr(this.args.description);
        md5.appendStr(this.args.instructions_path);
        md5.appendStr(instructions);
        const list_of_tools = this.args.tools.map(tool => tool.name).sort().join('');
        md5.appendStr(list_of_tools);


        const hash = md5.end(false);
        return hash?.toString() || "hash not found";
    }
    async generateAssistant(): Promise<string> {
        this.args.tools.forEach(tool => this.tool_map.set(tool.name, tool));
        let instructions_encoded = MainUtils.read_file_from_root(this.args.instructions_path).fileContent;

        let clean_instructions = this.remove_regex_line(this.file_hash_regex, instructions_encoded);
        clean_instructions = this.remove_regex_line(this.assistant_id_regex, clean_instructions);
        // remove all white spaces and new lines and tabs at the beginning
        clean_instructions = clean_instructions.replace(/^\s+|\s+$/g, '');
        // Remove
        const current_hash = this.generate_hash(clean_instructions);

        const { new_instructions_encoded, assistant_id } = await this.manageAssistantCreation(instructions_encoded, clean_instructions, current_hash);

        if (instructions_encoded !== new_instructions_encoded) {
            instructions_encoded = new_instructions_encoded;
            MainUtils.write_file_from_root(this.args.instructions_path, instructions_encoded);
        }

        return assistant_id;
    }

    // create of replace regex line
    private create_or_replace_regex_line(regex: RegExp, new_line: string, instructions_encoded: string): string {
        /**
         * This func is to support the following logic, but in a more generic way and simpler way
         * instructions_encoded = hash_found ?
                instructions_encoded.replace(this.file_hash_regex, "# FILE_HASH: " + current_hash) :
                "# FILE_HASH: " + current_hash + "\n" + instructions_encoded;
            
            Accepts the instructions_encoded and creates or replaces the regex line with the new_line
         */
        const hash_found = instructions_encoded.match(regex);
        if (!hash_found) {
            instructions_encoded = new_line + "\n\n" + instructions_encoded;
        } else {
            instructions_encoded = instructions_encoded.replace(regex, new_line);
        }
        return instructions_encoded;
    }

    // remove regex line from instructions_encoded, remember to remove the \n
    private remove_regex_line(regex: RegExp, instructions_encoded: string): string {
        // at the end of the regex, remove the \n
        const hash_found = instructions_encoded.match(regex);
        if (hash_found) {
            instructions_encoded = instructions_encoded.replace(regex, "");
        }
        // remove the \n
        instructions_encoded = instructions_encoded.replace('\n\n', "");
        return instructions_encoded;
    }

    async manageAssistantCreation(instructions_encoded: string, clean_instructions: string, current_hash: string) {

        const hash_found = instructions_encoded.match(this.file_hash_regex);
        let create_new_assistant = false;
        if (!hash_found || hash_found[0].split(" ")[2] !== current_hash) {
            const new_line = `# FILE_HASH: ${current_hash}`;
            instructions_encoded = this.create_or_replace_regex_line(this.file_hash_regex, new_line, instructions_encoded);
            create_new_assistant = true;
        }


        const assistant_id_found = instructions_encoded.match(this.assistant_id_regex);
        if (!assistant_id_found || create_new_assistant) {
            const assistant_id = await this.createNewAssistant(clean_instructions);
            const new_line = `# ASSISTANT ID: ${assistant_id}`;
            instructions_encoded = this.create_or_replace_regex_line(this.assistant_id_regex, new_line, instructions_encoded);
        } else {
            const assistant_id = assistant_id_found[0].split(" ")[3];
            if (assistant_id === 'undefined') {
                this.createNewAssistant(clean_instructions);
                const new_line = `# ASSISTANT ID: ${this.gpt_assistant?.id}`;
                instructions_encoded = this.create_or_replace_regex_line(this.assistant_id_regex, new_line, instructions_encoded);
            } else {
                await this.retrieveExistingAssistant(assistant_id);
            }

            // get assistant id from string
        }

        return {
            new_instructions_encoded: instructions_encoded,
            assistant_id: `${this.gpt_assistant?.id}`,
        };
    }

    async createNewAssistant(clean_instructions: string): Promise<string> {
        const tools_gpts = FunctionalTool.get_gpts(this.args.tools);
        const assistant = await openai.beta.assistants.create({
            name: this.args.name,
            instructions: clean_instructions,
            tools: tools_gpts,
            model: this.args.model || "gpt-4-1106-preview",
        });
        this.gpt_assistant = assistant;
        return assistant.id;
    }

    async retrieveExistingAssistant(assistant_id: string) {
        try {
            const assistant = await openai.beta.assistants.retrieve(assistant_id);
            this.gpt_assistant = assistant;
            return assistant;
        } catch (error) {
            console.error(error);
            throw new Error(`Assistant ${assistant_id} not found`);
        }
    }

    async add_file(file_path: string) {
        if (!this.gpt_assistant) {
            throw new Error("Assistant not created yet");
        }

        // Upload a file with an "assistants" purpose
        const full_path = MainUtils.root_directory(file_path);
        const file = await openai.files.create({
            file: fs.createReadStream(full_path),
            purpose: "assistants",
        });

        const file_ids = this.gpt_assistant.file_ids || [];
        file_ids.push(file.id);
        return file_ids;
    }

    async delete() {
        if (!this.gpt_assistant) {
            throw new Error("Assistant not created yet");
        }

        const deleted = await openai.beta.assistants.del(this.gpt_assistant.id);
        console.log(deleted);
    }

    // Create trhread
    async createThread(
        messages: OpenAI.Beta.Threads.ThreadCreateParams['messages'] = undefined,
        metadata: OpenAI.Beta.Threads.ThreadCreateParams['metadata'] = undefined
    ) { //st1
        const thread = await openai.beta.threads.create({ metadata, messages });
        this.thread = thread;
        return this.thread;
    }

    async addPromptMessageToThread(
        prompt: string,
        refence_file_ids?: string[]
    ) { //st2
        if (!this.thread) {
            throw new Error("Thread not created yet");
        }
        // # User is asking for help with their Python code for a linear regression cost function

        const msg: MessageCreateParams = {
            content: prompt,
            role: "user",
            file_ids: refence_file_ids,
        }
        const message = await this.client.beta.threads.messages
            .create(this.thread?.id, msg);

        console.log(message);
        this.get_or_create_run();
        return message;
    }
    private async get_or_create_run() {
        if (!this.thread) {
            throw new Error("Thread not created yet");
        }
        if (!this.gpt_assistant) {
            throw new Error("Assistant not created yet");
        }
        const new_run_list = await openai.beta.threads.runs.list(this.thread?.id);
        console.log("new_run_list ----------------->>>>> ", new_run_list.data.length);
        if (new_run_list.data.length > 0) {
            this.last_run = new_run_list.data[0];
            return this.last_run;
        } else {
            const new_run = await openai.beta.threads.runs.create(this.thread?.id,
                {
                    assistant_id: this.gpt_assistant?.id,
                });
            this.last_run = new_run;
            return new_run;
        }
    }

    private async checkStatus(): Promise<OpenAI.Beta.Threads.Run> { //st4
        //     By default, a Run goes into the queued state. 
        // You can periodically retrieve the Run to check on its status to see if it has 
        // moved to completed.
        if (!this.thread) {
            throw new Error("Thread not created yet");
        }
        if (!this.last_run) {
            this.get_or_create_run();
        }
        if (!this.last_run) {
            throw new Error("Run not created yet");
        }

        const runStatus = await this.client.beta.threads.runs.retrieve(this.thread?.id, this.last_run?.id);

        this.last_run_status = runStatus;
        // await this.handleRequiredAction(runStatus);
        return runStatus;
    }

    private async handleRequiredAction(): Promise<void> {
        if (this.last_run_status?.status === 'requires_action'
            && this.last_run_status?.required_action?.type === 'submit_tool_outputs') {
            // Handle the required action, e.g., execute the function calls
            const toolOutputs = await this.executeRequiredFunctions(this.last_run_status.required_action.submit_tool_outputs.tool_calls);
            // this.checkStatus();
            console.log(toolOutputs);
        }
    }
    public async check_status_and_run_actions() {
        const runStatus = await this.checkStatus();
        await this.handleRequiredAction();
        return runStatus;
    }
    private async executeRequiredFunctions(tool_calls: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[]) {
        // throw new Error('Method not implemented.');
        if (!this.thread) {
            throw new Error("Thread not created yet");
        }
        if (!this.last_run) {
            throw new Error("Run not created yet");
        }
        const t_results: RunSubmitToolOutputsParams.ToolOutput[] = await Promise.all(
            tool_calls.map(async call => {
                // Execute the function based on call details
                // Example: if(call.function.name === "getCurrentWeather") { ... }
                const { function: {
                    arguments: args,
                    name,
                }, id, type } = call;

                const json_args = JSON.parse(args);
                console.log(json_args);
                console.log(name);
                console.log(call);

                const tool = this.args.tools.find(tool => tool.name === name);
                if (!tool) {
                    throw new Error(`Tool ${name} not found`);
                }
                try {
                    const output = await tool.tool_fn(json_args, null);
                    // if not a string, convert to string using JSON.stringify
                    if (typeof output !== 'string') {
                        return {
                            tool_call_id: id,
                            output: JSON.stringify(output),
                        };
                    } else {

                        return {
                            tool_call_id: id,
                            output,
                        };
                    }
                } catch (error) {
                    throw new Error(`Error executing tool ${name}: ${error}`);
                }
            }));

        const run = await openai.beta.threads.runs.submitToolOutputs(
            this.thread?.id,
            this.last_run.id,
            {
                tool_outputs: t_results,
            }
        );
        console.log(this.last_run);
        console.log(run);
    }

    public async get_display_messages() {
        /**
    Step 6: Display the Assistant's Response
    Once the Run completes, you can list the Messages added to the Thread by the Assistant.
    
    node.js
    
    node.js
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );
    And finally, display them to the user! During this Run, the Assistant added two new Messages to the Thread. Here is an example of what that might look like:
    
    ROLE	CONTENT
    user	I need to solve the equation 3x + 11 = 14. Can you help me?
    assistant	Certainly, Jane Doe. To solve the equation (3x + 11 = 14) for (x), you'll want to isolate (x) on one side of the equation. Here's how you can do that:
    Subtract 11 from both sides of the equation to get (3x = 3).
    Then, divide both sides by 3 to solve for (x).
    Let me calculate the value of (x) for you.
    assistant	The solution to the equation (3x + 11 = 14) is (x = 1).
    You can also retrieve the Run Steps of this Run if you'd like to explore or display the inner workings of the Assistant and its tools.
         */
        // throw new Error('Method not implemented.');
        if (!this.thread) {
            throw new Error("Thread not created yet");
        }
        await this.get_or_create_run();

        if (!this.last_run) {
            throw new Error("Run not created yet");
        }

        const messages = await openai.beta.threads.messages.list(
            this.thread?.id
        );
        this.last_run_messages = messages;
        return this.last_run_messages;
    }

    public async load_from_session(session_id: string) {

        const thread = await openai.beta.threads.retrieve(session_id);
        if (!thread) {
            throw new Error("Thread not found");
        }
        this.thread = thread;
        return this.thread;
    }
}



// Create endpoint for assistant: st1 create thread,
// st2 add prompt message to thread,
// st3 run assistant,
// st4 check run status