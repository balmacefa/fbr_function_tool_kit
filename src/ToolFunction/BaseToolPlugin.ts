import { OpenAPISchemaGenerator } from "../OpenAPISchemaGenerator";
import { ToolFunction } from "./ToolFunction";
import { DirectoryToolFunctionList } from "./tools/Directory.tools";
import { ToolExecuteGitCommand } from "./tools/Git.tools";

type plugin_names = '1' | '2';
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

        }
    ) {
        this.functions = args.functions;
        this.validateIdentifier(args.identifier);
        this.identifier = args.identifier;
        this.version = args.version;
        this.host = args.host;
    }

    private validateIdentifier(identifier: string): void {
        if (!identifier || typeof identifier !== 'string' || identifier.trim().length === 0) {
            throw new Error("Invalid identifier provided.");
        }
    }


    public getSchemaFromSwaggerSpec(TF: ToolFunction, swaggerSpec: any): any {
        const funcPath = TF.get_path(this.host);
        const pathObject = swaggerSpec.paths[funcPath];
        const TF_request_body = pathObject.post?.requestBody as any;
        return TF_request_body['content']['application/json'].schema;
    }
    public generateSwaggerSpec(TF: ToolFunction): any {
        const openschema = new OpenAPISchemaGenerator({
            title: TF.name,
            description: TF.description,
            url: TF.get_path(this.host),
            version: this.version
        });

        openschema.registerToolFunctionSchema(TF);
        return openschema.generateDocumentation();
    }

    public extractSchemaProperties(TF: ToolFunction): any {
        const swaggerSpec = this.generateSwaggerSpec(TF);
        return this.getSchemaFromSwaggerSpec(TF, swaggerSpec);
    }

    // Aquí podrían agregarse más métodos comunes si son necesarios


    public static factory_plugin(name: plugin_names) {
        const plugin = new BaseToolPlugin({
            identifier: 'fbr_BaseToolPlugin_01',
            version: '1.0.0',
            functions: [
                ...DirectoryToolFunctionList,
                ToolExecuteGitCommand(),
            ],
            host: 'http://localhost:3000'
        });
        return plugin;
    }
}
