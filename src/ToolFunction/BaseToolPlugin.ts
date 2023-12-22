import { AgentAction } from "langchain/dist/schema";
import { DynamicStructuredTool } from "langchain/tools";
import { AssistantCreateParams } from "openai/resources/beta/assistants/assistants";
import { z } from "zod";
import { OpenAPISchemaGenerator } from "../OpenAPISchemaGenerator";
import { ToolFunction } from "./ToolFunction";
import { DirectoryToolFunctionList, MinimalDirectoryToolFunctionList } from "./tools/Directory.tools";
import { ToolExecuteGitCommand } from "./tools/Git.tools";
import { JSDocUpdater } from "./tools/UpdateJSDoc.tools";

type plugin_names = 'fbr_BaseToolPlugin_tools_directory_and_git' | 'fbr_tools_minimal_directory__git__ts_tools';
export class BaseToolPlugin {
    public functions: ToolFunction[];

    public identifier: string;
    public version: string;
    public host: string;

    constructor(
        args: {
            identifier: string,
            version: string,
            host: string,
            functions: ToolFunction[],
            prefix_path?: string,
        }
    ) {
        this.functions = args.functions;
        this.validateIdentifier(args.identifier);
        this.identifier = args.identifier;
        this.version = args.version;
        this.host = args.host;

        // loop over the functions and set the host
        this.functions.forEach(ell => {
            ell.host = args.host;
            ell.prefix_path = args.prefix_path || '';
        });
    }

    private validateIdentifier(identifier: string): void {
        if (!identifier || typeof identifier !== 'string' || identifier.trim().length === 0) {
            throw new Error("Invalid identifier provided.");
        }
    }

    public getSchemaFromSwaggerSpec(TF: ToolFunction, swaggerSpec: any): any {
        const firstKey = Object.keys(swaggerSpec.paths)[0];
        const pathObject = swaggerSpec.paths[firstKey];
        const TF_request_body = pathObject.post?.requestBody as any;
        const response = TF_request_body['content']['application/json'].schema;
        return response;
    }
    private generateSwaggerSpec(TF: ToolFunction): any {
        const openschema = new OpenAPISchemaGenerator({
            title: TF.name,
            description: TF.description,
            url: this.host,
            version: this.version
        });

        openschema.registerToolFunctionSchema(TF);
        return openschema.generateDocumentation();
    }

    public extractSchemaProperties(TF: ToolFunction): any {
        const swaggerSpec = this.generateSwaggerSpec(TF);
        return this.getSchemaFromSwaggerSpec(TF, swaggerSpec);
    }

    // This methos bellow this line should be on children class <- TODO
    public generate_func_asistant_list(): AssistantCreateParams.AssistantToolsFunction[] {
        const func_map: AssistantCreateParams.AssistantToolsFunction[] = [];
        this.functions.forEach(func => {

            const assis_func_declaration: AssistantCreateParams.AssistantToolsFunction =
            {
                type: "function",
                function: {
                    name: func.get_operation_id(),
                    description: func.description,
                    parameters: this.extractSchemaProperties(func)
                }
            }

            func_map.push(assis_func_declaration);
        });
        return func_map;
    }

    public async call_func(action: AgentAction) {
        console.log('Incoming action request: ', action);
        const foundFunc = this.functions.find(func => (func.get_operation_id() === action.tool));
        if (!foundFunc) {
            const res = {
                status: 404,
                response: 'WARNING Tool Function NOT FOUND!'
            }
            return res;
        } else {
            return await foundFunc.processRequest(action.toolInput, true);
        }
    }

    public generate_func_asistant_list_lang_chain(): DynamicStructuredTool<any>[] {
        // sample input: base_tool_plugin.functions
        const list: DynamicStructuredTool<any>[] = [];
        this.functions.forEach(fnt => {

            const tool_lang_chain = new DynamicStructuredTool({
                name: fnt.name,
                description: fnt.description,
                schema: fnt.inputSchema ? fnt.inputSchema as any : z.object({}),
                func: async (input: unknown): Promise<string> => {
                    const output = await fnt.processRequestPlain(input);
                    return output;
                },
                returnDirect: false, // This is an option that allows the tool to return the output directly
            });
            list.push(tool_lang_chain);
        });
        return list
    }

    // Aquí podrían agregarse más métodos comunes si son necesarios


    public static factory_plugin(name: plugin_names): BaseToolPlugin {
        switch (name) {
            case 'fbr_BaseToolPlugin_tools_directory_and_git':
                return BaseToolPlugin.fbr_BaseToolPlugin_tools_directory_and_git();
            case 'fbr_tools_minimal_directory__git__ts_tools':
                return BaseToolPlugin.fbr_tools_minimal_directory__git__ts_tools();
            default:
                return BaseToolPlugin.fbr_BaseToolPlugin_tools_directory_and_git();
        }
    }
    public static fbr_BaseToolPlugin_tools_directory_and_git(): BaseToolPlugin {
        const plugin = new BaseToolPlugin({
            identifier: 'fbr_BaseToolPlugin_tools_directory_and_git',
            version: '1.0.0',
            functions: [
                ...DirectoryToolFunctionList,
                ToolExecuteGitCommand(),
            ],
            host: 'http://localhost:3000'
        });
        return plugin;
    }
    public static fbr_tools_minimal_directory__git__ts_tools(): BaseToolPlugin {
        const plugin = new BaseToolPlugin({
            identifier: 'fbr_tools_minimal_directory__git__ts_tools',
            version: '1.0.0',
            functions: [
                ...MinimalDirectoryToolFunctionList,
                ToolExecuteGitCommand(),
                JSDocUpdater()
            ],
            host: 'http://localhost:3000'
        });
        return plugin;
    }
}
