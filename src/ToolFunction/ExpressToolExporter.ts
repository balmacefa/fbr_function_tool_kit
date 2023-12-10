import { Express } from "express";
import { ToolFunction } from ".";
import { OpenAPISchemaGenerator } from "../OpenAPISchemaGenerator";
import { OpenApiSwaggerDocsExpress } from '../OpenAPISchemaGenerator/OpenApiSwaggerDocsExpress';
import { BaseToolPlugin } from './BaseToolPlugin';

export class ExpressToolExporter {

    static export_tools_routes(args: {
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
    static setupOpenAPISwaggerDocs(app: Express, functions: ToolFunction[]) {
        const open_api = new OpenAPISchemaGenerator({
            description: 'open_api_functool',
            title: 'FN tools',
            url: 'http://localhost:3000',
            version: '1.0.0',
        });

        open_api.a1_step_register_tools(functions);

        OpenApiSwaggerDocsExpress.add_swagger_route({
            app,
            open_api,
        });
    }

    static initializeExpressToolExport(args: {
        app: Express,
        base_tool_plugin: BaseToolPlugin,
    }) {
        this.export_tools_routes({
            app: args.app,
            functions: args.base_tool_plugin.functions
        });

        this.setupOpenAPISwaggerDocs(args.app, args.base_tool_plugin.functions);
    }
}
