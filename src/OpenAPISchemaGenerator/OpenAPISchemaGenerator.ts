// OpenAPISchemaGenerator.ts
import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { writeFileSync } from "fs";
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import { z } from 'zod';
import { ToolFunction } from "../ToolFunction/ToolFunction";
import { CommonZodSchemas } from './CommonZodSchemas';


extendZodWithOpenApi(z);

export class OpenAPISchemaGenerator {

    public registry: OpenAPIRegistry;
    public version: string;
    public title: string;
    public description: string;
    public url: string;


    constructor(args: {
        version: string,
        title: string,
        description: string,
        url: string,
        registry?: OpenAPIRegistry,
    }
    ) {
        const { title, description, url, version, registry } = args;
        this.title = title;
        this.description = description;
        this.url = url;
        this.version = version;
        if (!registry) {
            this.registry = new OpenAPIRegistry();
        } else {
            this.registry = registry;
        }
    }
    // This funic should be easelly override
    public registerCommonSchemes() {
        this.registerSecuritySchemes();
    }

    public registerSecuritySchemes() {
        this.registry.registerComponent('securitySchemes', 'Authorization', {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'API-Key authorization. Example: API-Key your_api_key',
        });
    }

    public generateDocumentation(): OpenAPIObject {
        // Generate and return the OpenAPI documentation object
        const generator = new OpenApiGeneratorV3(this.registry.definitions);

        const genDoc: OpenAPIObject = generator.generateDocument({
            openapi: '3.0.0',
            info: {
                version: this.version,
                title: this.title,
                description: this.description,
            },
            servers: [
                { url: this.url },
                // Add more servers if needed
            ],
        });
        return genDoc;
    }

    public registerToolFunctionSchema(toolFunction: ToolFunction) {
        // Implementation for generating the OpenAPI schema...
        console.log('get_openapi_schema for fnc ' + toolFunction.name);
        // Create new order
        this.registry.registerPath(
            {
                operationId: toolFunction.get_operation_id(),
                path: toolFunction.get_path(),
                description: toolFunction.description,
                summary: toolFunction.description,
                tags: ['FunctionalTool'],
                method: 'post',
                security: [{ ['Authorization']: [] }],
                request: {
                    body: {
                        content: {
                            ...(toolFunction.inputSchema ? {
                                'application/json': {
                                    schema: toolFunction.inputSchema,
                                },
                            } : {}),
                        },
                        required: true,
                    }
                },
                responses: {
                    201: {
                        description: '201 ok - COMPLETE RESPONSE',
                        content: {
                            ...(toolFunction.responseSchema ? {
                                'application/json': {
                                    schema: toolFunction.responseSchema,
                                },
                            } : {}),
                        },
                    },
                    ...CommonZodSchemas.Response403,
                },
            }

        );
    }

    public registerToolFunctionsSchemas(toolFunctionList: ToolFunction[]) {
        toolFunctionList.forEach(fnt => {
            this.registerToolFunctionSchema(fnt);
        });
    }

    public saveDocumentationToFile(filename = 'open_api.json') {
        const swaggerSpec = this.generateDocumentation();
        writeFileSync(filename, JSON.stringify(swaggerSpec, null, 2));
        console.log(`OpenAPI documentation saved to ${filename}`);
    }

    public a1_step_register_tools = this.registerToolFunctionsSchemas

}
