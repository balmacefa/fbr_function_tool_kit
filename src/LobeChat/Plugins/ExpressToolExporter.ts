import { Express } from "express";
import { OpenAPISchemaGenerator } from "../../OpenAPISchemaGenerator";
import { OpenApiSwaggerDocsExpress } from '../../OpenAPISchemaGenerator/OpenApiSwaggerDocsExpress';
import { ToolFunction } from "../../ToolFunction";
import { ToolDirectoryVisualization, ToolFileContent } from "../../ToolFunction/Directory.tools";
import { PluginManifest } from "./PluginManifestGenerator";

export class ExpressToolExporter {

    static exportPluginManifest(args: {
        app: Express,
        functions: ToolFunction[]// Replace 'any' with the appropriate type for your plugin manifest
    }) {
        args.functions.forEach(fnt => {
            args.app.post(fnt.get_path(), async (req, res) => {
                try {
                    // Validate request parameters against the schema
                    const validationResult = fnt.inputSchema.safeParse(req.body);

                    if (!validationResult.success) {
                        return res.status(400).json({ error: 'Invalid input', details: validationResult.error });
                    }

                    // If input validation is successful, execute the function
                    try {
                        const output = await fnt.execute(validationResult.data); // Assuming fnt.execute() returns a Promise

                        // Validate the function's output
                        const outputValidation = fnt.responseSchema.safeParse(output);
                        if (!outputValidation.success) {
                            return res.status(500).json({ error: 'Function execution failed', details: outputValidation.error });
                        }

                        // If everything is OK, send the successful response
                        res.status(201).json(outputValidation.data);
                    } catch (executionError) {
                        // Handle errors that might occur during function execution
                        return res.status(500).json({ error: 'Error during function execution', details: executionError });
                    }
                } catch (error) {
                    // Handle other unexpected errors
                    res.status(500).json({ error: 'Server error', details: error });
                }
            });

        });
    }

    static routePluginManifestDotJson(args: { manifest: PluginManifest, app: Express }) {
        const jsonData = args.manifest.generateManifest();
        args.app.get('lobe_chat_plugins/' + args.manifest.identifier + '.json', (req, res) => {
            res.status(201).json(jsonData);
        })

    }

    static setupOpenAPISwaggerDocs(app: Express, functions: ToolFunction[]) {
        const open_api = new OpenAPISchemaGenerator({
            description: 'open_api_functool',
            title: 'FN tools',
            url: 'http://localhost:3000',
            version: '1.0.0',
        });

        open_api.a1_step_register_tools(functions);

        OpenApiSwaggerDocsExpress.displaySwaggerDocs({
            app,
            open_api,
        });
    }

    static initializeExpressToolExport(args: {
        app: Express,
        manifest: PluginManifest
    }) {
        this.exportPluginManifest({
            app: args.app,
            functions: args.manifest.functions
        });

        this.routePluginManifestDotJson({
            app: args.app,
            manifest: args.manifest
        });

        this.setupOpenAPISwaggerDocs(args.app, args.manifest.functions);
    }
}



if (typeof require !== 'undefined' && require.main === module) {
    import('express')
        .then(express => {
            const app = express.default(); // Note the use of .default here
            app.use(express.json()); // To support JSON-encoded bodies

            // Create PluginManifest instance
            const plugin = new PluginManifest({
                gateway: '...',
                identifier: 'fbr_lobechat_01',
                version: '1.0.0',
                functions: [
                    ToolDirectoryVisualization(),
                    ToolFileContent()
                ]
            });
            // Initialize all Express tool exporter functionalities
            ExpressToolExporter.initializeExpressToolExport({
                app: app,
                manifest: plugin
            });


            // Start the server
            const port = 3000; // Replace with your desired port
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);

                app._router.stack.forEach((middleware: any) => {
                    if (middleware.route) { // if it's a route middleware
                        const methods = Object.keys(middleware.route.methods)
                            .map(method => method.toUpperCase())
                            .join(', ');

                        console.log(`${methods} ${middleware.route.path}`);
                    }
                });

            });
        });

}
