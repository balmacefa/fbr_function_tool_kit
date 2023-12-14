import type { OpenAIClient } from "@langchain/openai";
import { OpenAIToolType } from 'langchain/dist/experimental/openai_assistant/schema';
import { AgentAction, AgentFinish, AgentStep } from "langchain/dist/schema";
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { DynamicStructuredTool, StructuredTool } from "langchain/tools";
import { z } from "zod";
import { ToolFunction } from "../ToolFunction";

type AsisType = OpenAIAssistantRunnable<boolean, Record<string, any>>;
type ToolsType = OpenAIToolType | StructuredTool[];

export interface AssistantOptions {
    model: string;
    assistantId?: string;
    tools_plugin?: ToolFunction[];
    name?: string;
    instructions?: string;
}


// TODO: create a method to export to save, and to inport save
class OpenAIAssistantWrapper {
    private assistant?: AsisType;
    private tools: ToolsType;
    assistantId?: string;
    name?: string;
    instructions?: string;
    private model?: string;
    // private openAIFiles: OpenAIFiles;

    constructor(options: AssistantOptions) {
        this.model = options.model;
        this.assistantId = options.assistantId;

        if (options.tools_plugin) {
            this.tools = this.convertToolFunctions_to_DynamicStructuredTool_langchain(options.tools_plugin);
        } else {
            console.info("dev: you can .add_code_interpreter_open_ai_tool ")
            this.tools = [];
        }
        this.name = options.name;
        this.instructions = options.instructions;
        console.info("dev: run .get_or_create_assistant to start when ready! ")
    }



    /**
     * Convierte la instancia en un objeto JSON.
     * @returns {object} Representación serializable del objeto.
     */
    toJSON() {
        return {
            // assistant: this.assistant, -. this is a dynamic obj fron langchain...
            tools: this.tools,
            assistantId: this.assistantId,
            name: this.name,
            instructions: this.instructions,
            model: this.model,
            // Aquí puedes decidir si incluir o no otros campos
        };
    }

    /**
     * Convierte la instancia en una cadena legible.
     * @returns {string} Representación en cadena del objeto.
     */
    toString() {
        return `OpenAIAssistantWrapper: { 
            Name: ${this.name}, 
            Instructions: ${this.instructions}, 
            Assistant ID: ${this.assistantId}, 
            Model: ${this.model}
        }`;
    }



    public convertToolFunctions_to_DynamicStructuredTool_langchain(toolFunctionList: ToolFunction[]): DynamicStructuredTool<any>[] {
        // sample input: base_tool_plugin.functions
        const list: DynamicStructuredTool<any>[] = [];
        toolFunctionList.forEach(fnt => {

            const tool_lang_chain = new DynamicStructuredTool({
                name: fnt.name,
                description: fnt.description,
                schema: fnt.inputSchema ? fnt.inputSchema as any : z.object({}),
                func: async (input: unknown): Promise<string> => {
                    const output = await fnt.execute(input);
                    // Si 'output' es una cadena, se devuelve directamente.
                    if (typeof output === 'string') {
                        return output;
                    }
                    // Si no es una cadena, se convierte el objeto JSON a una cadena JSON.
                    return JSON.stringify(output);
                    // if(output is string then rteuirn, is not convert json to json string line)
                },
                returnDirect: false, // This is an option that allows the tool to return the output directly
            });
            list.push(tool_lang_chain);
        });
        return list
    }

    public add_code_interpreter_open_ai_tool() {
        const key: OpenAIClient.Beta.AssistantCreateParams.AssistantToolsCode =
            { type: 'code_interpreter' };

        this.tools.push(key as any) // TODO: fix ts error, add any to force add, 
    }
    public async get_or_create_assistant(assistant_id?: string): Promise<void> {
        // Method to create a new assistant
        if (assistant_id) {
            try {
                this.assistant = new OpenAIAssistantRunnable({
                    assistantId: assistant_id,
                    // asAgent: true
                });
            } catch (error) {
                console.error(error);
                console.error('Createing a new assistant instead');
                this.assistant = await this._create_assistant();
            }
        } else {
            this.assistant = await this._create_assistant();
        }

        this.assistantId = (await this.assistant.getAssistant()).id;
        console.info("dev: run .invoke(prompt_content) to start or continue a thread")
    }
    private async _create_assistant(): Promise<AsisType> {
        // Method to create a new assistant
        const assistant = await OpenAIAssistantRunnable.createAssistant({
            model: this.model || "gpt-4-1106-preview",
            tools: this.tools,
            asAgent: true,
            name: this.name,
            instructions: this.instructions
        });
        return assistant;
    }


    public async invoke(content: string): Promise<any> {

        const assistant = this.assistant;
        if (!assistant) {
            throw new Error("Dev error, forget to creat or get assistant")
        }
        const assistantResponse = await assistant.invoke({
            content,
            // todo: maybe files? uploads?
        });
        console.log(assistantResponse);
        return assistantResponse;
        /** content.type. can be an image or a file too
        [
          {
            id: 'msg_OBH60nkVI40V9zY2PlxMzbEI',
            thread_id: 'thread_wKpj4cu1XaYEVeJlx4yFbWx5',
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: {
                  value: 'The result of 10 - 4 raised to the 2.7 is approximately -32.22.',
                  annotations: []
                }
              }
            ],
            assistant_id: 'asst_RtW03Vs6laTwqSSMCQpVND7i',
            run_id: 'run_4Ve5Y9fyKMcSxHbaNHOFvdC6',
          }
        ]
        */
    }
    // public async execute_agent(input: any) {
    //     const toolMap: Record<string, ToolsType> = {};
    //     this.tools.forEach(tool => {
    //         const key = (tool as StructuredTool).name;
    //         toolMap[key] = tool;
    //     });
    //     if (!this.assistant) {
    //         throw new Error("Dev error, forget to creat or get assistant")
    //     }
    //     let response = await this.assistant.invoke(input);

    //     while (!(this.isAgentFinish(response))) {
    //         if (this.isAgentAction(response)) {

    //             const toolOutputs: any[] = [];
    //             response.forEach((action: AgentAction) => {
    //                 const toolOutput = toolMap[action.tool].invoke(action.tool_input);
    //                 console.log(action.ssssstool, action.tool_input, toolOutput, "\n");
    //                 toolOutputs.push({
    //                     output: toolOutput,
    //                     tool_call_id: action.tool_call_id
    //                 });
    //             });

    //             response = agent.invoke({
    //                 tool_outputs: toolOutputs,
    //                 run_id: response[0].run_id,
    //                 thread_id: response[0].thread_id,
    //             });
    //         }
    //     }

    //     return response;
    // }


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
