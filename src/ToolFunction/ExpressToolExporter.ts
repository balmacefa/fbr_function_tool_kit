import { Express } from "express";
import morgan from "morgan";
import { OpenAPISchemaGenerator } from "../OpenAPISchemaGenerator";
import { OpenApiSwaggerDocsExpress } from '../OpenAPISchemaGenerator/OpenApiSwaggerDocsExpress';
import { BaseToolPlugin } from './BaseToolPlugin';


export class ExpressToolExporter {
    public app: Express;
    public base_tool_plugin: BaseToolPlugin;

    public open_api_url: string;

    constructor(
        args: {
            app: Express;
            base_tool_plugin: BaseToolPlugin;
            open_api_url: string;
        }
    ) {
        this.app = args.app;
        this.base_tool_plugin = args.base_tool_plugin;
        this.open_api_url = args.open_api_url;
    }

    public export_tools_routes() {
        this.base_tool_plugin.functions.forEach(fnt => {
            this.app.post(fnt.get_path(), async (req, res) => {
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
    public setupOpenAPISwaggerDocs() {
        const open_api = new OpenAPISchemaGenerator({
            description: 'open_api_functool',
            title: 'FN tools',
            url: this.open_api_url,

            version: '1.0.0',
        });

        open_api.a1_step_register_tools(this.base_tool_plugin.functions);

        OpenApiSwaggerDocsExpress.add_swagger_route({
            app: this.app,
            open_api,
        });
    }

    public initializeExpressToolExport() {
        this.export_tools_routes();

        this.setupOpenAPISwaggerDocs();
    }

    public static default_server(base_tool_plugin: BaseToolPlugin) {
        import('express')
            .then(async express => {
                const app = express.default(); // Note the use of .default here
                app.use(express.json()); // To support JSON-encoded bodies
                app.use(function (req, res, next) {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                    next();
                });
                app.use(
                    morgan(":method :url :status :res[content-length] - :response-time ms")
                );
                // Initialize all Express tool exporter functionalities
                const express_exporter = new ExpressToolExporter({
                    app: app,
                    base_tool_plugin: base_tool_plugin,
                    open_api_url: 'https://1c42-190-113-103-194.ngrok-free.app'
                });
                express_exporter.initializeExpressToolExport();

                // Start the server
                const port = 3000; // Replace with your desired port
                const server = app.listen(port, async () => {
                    console.log(`Server running on port ${port}`);

                });

                return server;
            });
    }
}


if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
        const base_tool_plugin = BaseToolPlugin.factory_plugin("1");
        await ExpressToolExporter.default_server(base_tool_plugin);

        // Import Inquirer within the async function if it's not already imported
        // TODO: Update the swagger registry and routes with the ngrok URL
        // [Your logic to update Swagger registry and routes goes here]
    })();
}
