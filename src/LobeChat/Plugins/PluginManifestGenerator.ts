import type { SchemaObject } from 'openapi3-ts/oas30';
import { ToolFunction } from "../../ToolFunction";
import { BaseToolPlugin } from '../../ToolFunction/BaseToolPlugin';
import { ToolDirectoryVisualization, ToolFileContent } from '../../ToolFunction/Directory.tools';

export class PluginManifest extends BaseToolPlugin {
    public ui?: { url: string; height: number };
    public gateway?: string;
    public settings?: SchemaObject;

    constructor(
        args: {
            functions: ToolFunction[],
            identifier: string,
            ui?: { url: string; height: number },
            gateway: string,
            version: string,
            settings?: SchemaObject,
            host?: string
        }
    ) {
        super({
            functions: args.functions,
            host: args.host || "http://localhost:3000",
            identifier: args.identifier,
            version: args.version,
        });
        this.ui = args.ui;
        this.gateway = args.gateway;
        this.settings = args.settings;
    }

    public generateManifest(): object {
        return {
            identifier: this.identifier,
            api: this.generateApiSection(),
            ui: this.ui,
            gateway: this.gateway || "http://localhost:3000/api_gateway",
            version: this.version,
            settings: this.settings,
        };
    }

    public generateApiSection(): any[] {
        return this.functions.map(func => ({
            url: func.get_path(this.host),
            name: func.name,
            description: func.description,
            parameters: this.extractSchemaProperties(func)
        }));
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
