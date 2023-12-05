// OpenAPISchemaGenerator.ts
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from 'zod';
import { ToolFunction } from "../ToolFunction/ToolFunction";

extendZodWithOpenApi(z);


export class OpenAPISchemaGenerator {
    // TODO: create singleton instance
    private static instance: OpenAPISchemaGenerator;

    private constructor() {
        // Private constructor ensures that a new instance is not created outside the class
    }

    public static getInstance(): OpenAPISchemaGenerator {
        if (!OpenAPISchemaGenerator.instance) {
            OpenAPISchemaGenerator.instance = new OpenAPISchemaGenerator();
        }

        return OpenAPISchemaGenerator.instance;
    }
    public static Response403 = {
        403: {
            description: 'Error: not allowed to perform this action',
            content: {
                'application/json': {
                    // base on schema: {
                    //     "errors": [
                    //         {
                    //             "message": "You are not allowed to perform this action."
                    //         }
                    //     ]
                    // }
                    // return a zod schema
                    schema: z.object({
                        errors: z.array(
                            z.object({
                                message: z.string(),
                            })
                        ),
                    }).openapi(
                        {
                            example: {
                                errors: [
                                    {
                                        message: 'You are not allowed to perform this action.',
                                    },
                                ],
                            }
                        }
                    ),
                },
            },
        }
    };
    static registerToolFunctionSchema(toolFunction: ToolFunction, registry: OpenAPIRegistry) {
        // Implementation for generating the OpenAPI schema...
        console.log('get_openapi_schema');
        // Create new order
        registry.registerPath(
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
                            'application/json': {
                                schema: toolFunction.inputSchema,
                            },
                        },
                        required: true,
                    }
                },
                responses: {
                    201: {
                        description: '201 ok - COMPLETE RESPONSE',
                        content: {
                            'application/json': {
                                schema: toolFunction.responseSchema,
                            },
                        },
                    },
                    ...OpenAPISchemaGenerator.Response403,
                },
            }

        );
    }
}
