import type { SchemaObject } from 'openapi3-ts/oas30';
import { OpenAPISchemaGenerator } from "../../OpenAPISchemaGenerator";
import { ToolFunction } from "../../ToolFunction";
import { ToolDirectoryVisualization, ToolFileContent } from "../../ToolFunction/Directory.tools";

export class PluginManifest {
    public functions: ToolFunction[];
    public identifier: string;
    public ui?: { url: string; height: number };
    public gateway?: string;
    public version: string;
    public settings?: SchemaObject;

    constructor(
        args: {
            functions: ToolFunction[],
            identifier: string,
            ui?: { url: string; height: number },
            gateway: string,
            version: string,
            settings?: SchemaObject;
        }
    ) {
        this.functions = args.functions;
        this.identifier = args.identifier;
        this.ui = args.ui;
        this.gateway = args.gateway;
        this.version = args.version;
        if (args.settings) { this.settings = args.settings; }
    }

    generateManifest(): object {
        return {
            identifier: this.identifier,
            api: this.generateApiSection(),
            ui: this.ui,
            gateway: this.gateway,
            version: this.version,
            settings: this.settings
        };
    }

    public generateApiSection(): any[] {
        return this.functions.map(func => ({
            url: func.get_path(),
            name: func.name,
            description: func.description,
            parameters: this.extractSchemaProperties(func)
        }));
    }

    public extractSchemaProperties(TF: ToolFunction) {
        const openschema = new OpenAPISchemaGenerator({
            title: 'TF',
            description: 'desc',
            url: './',
            version: '1.0.0'
        });

        openschema.registerToolFunctionSchema(TF);
        const swaggerSpec = openschema.generateDocumentation();

        // Get the correct path
        const funcPath = TF.get_path();
        const pathObject = swaggerSpec.paths[funcPath];
        // Assuming the parameters are in the POST method of the path
        // Adjust according to your API specification
        const TF_request_body = pathObject.post?.requestBody as any;
        const schemaJson = TF_request_body['content']['application/json'].schema;

        return schemaJson;
    }

}


if (typeof require !== 'undefined' && require.main === module) {
    console.log("Hello, FastifyRouteHandler!");
    const plugin = new PluginManifest({
        gateway: '...',
        identifier: 'fbr_lobechat_01',
        version: '1.0.0',
        functions: [
            ToolDirectoryVisualization(),
            ToolFileContent()
        ]
    });

    const manifest = plugin.generateManifest();
    const str = JSON.stringify(manifest, null, 2);
    console.log(str);
}
