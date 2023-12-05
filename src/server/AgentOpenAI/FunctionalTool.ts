import { OpenAPIRegistry, RouteConfig } from "@asteasolutions/zod-to-openapi";
import { AnyProcedure, MaybePromise } from "@trpc/server";
import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { AssistantCreateParams } from "openai/resources/beta/assistants/assistants";
import { AnyZodObject, z } from "zod";
import { convertZodToFunctionParameters } from "../../FastifyRouteHandler/convertZodToJsonSchema";
import { MainUtils } from "../../main_utils";
import { Response403 } from '../SwaggerDocs/SwaggerDocs.exclude';
import { publicProcedure, router } from "../router/trpc";


// create a class that implements the ToolFunction interface

export type FunctionalToolParams = RouteConfig;
export type FunctionalTool_io_input_schema = {
    input_schema: AnyZodObject
    response_schema: AnyZodObject,
};

type tool_function_type<A = unknown, B = unknown, C = unknown> = (
    input: A,
    ctx: B
) => string | Promise<string>

export class FunctionalTool<T = tool_function_type> {

    tool_fn: tool_function_type; // Todo infer type from io.input_schema
    name: string;
    description: string;
    io: FunctionalTool_io_input_schema;
    router_opts: { context: boolean; type: 'query' | 'mutation' | 'subscription'; };

    constructor(
        args: {
            name: string,
            description: string,
            tool_fn: T,
            io: {
                input_schema: AnyZodObject,
                response_schema: AnyZodObject,
            },
            router_opts: {
                context: boolean,
                type: 'query' | 'mutation' | 'subscription',
            }
        }
    ) {
        const { name, description, tool_fn, io, router_opts } = args;
        this.router_opts = router_opts;
        this.name = name;
        this.description = description;

        this.tool_fn = tool_fn as tool_function_type;
        this.io = io;
    }

    get_openapi_schema(registry: OpenAPIRegistry) {
        console.log('get_openapi_schema');
        // Create new order
        registry.registerPath(
            {
                operationId: this.get_operation_id(),
                path: this.get_path(),
                description: this.description,
                summary: this.description,
                tags: ['FunctionalTool'],
                method: 'post',
                security: [{ ['Authorization']: [] }],
                request: {
                    body: {
                        content: {
                            'application/json': {
                                schema: this.io.input_schema,
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
                                schema: this.io.response_schema,
                            },
                        },
                    },
                    ...Response403,
                },
            }

        );
    };

    get_trpc_route() {

        const router_fn_type = publicProcedure
            .input(
                this.io.input_schema
            ).output(
                this.io.response_schema
            );

        if (this.router_opts.type === 'query') {
            router_fn_type.query(({ input, ctx }): MaybePromise<{ [x: string]: any; }> => {
                const result = this.tool_fn(input, ctx);
                // Ensure result is of type `{ [x: string]: any; }`
                return result as { [x: string]: any; };
            });
        }
        if (this.router_opts.type === 'mutation') {
            router_fn_type.mutation(({ input, ctx }): MaybePromise<{ [x: string]: any; }> => {
                const result = this.tool_fn(input, ctx);
                // Ensure result is of type `{ [x: string]: any; }`
                return result as { [x: string]: any; };
            });
        }
        if (this.router_opts.type === 'subscription') {
            router_fn_type.subscription(({ input, ctx }): MaybePromise<{ [x: string]: any; }> => {
                const result = this.tool_fn(input, ctx);
                // Ensure result is of type `{ [x: string]: any; }`
                return result as { [x: string]: any; };
            });
        }

        // crate a trpc route 
        const fnRouter = router({
            version: publicProcedure.query(() => {
                return { version: '0.0.1' };
            }),
            [this.get_operation_id()]: router_fn_type as unknown as AnyProcedure,
        });
        return fnRouter;
    }

    // Get fastify route
    set_fastify_route(fastify: FastifyInstance) {
        // Declare a route
        const tt = this;

        const fn: RouteHandlerMethod = async function (request, reply) {
            const input = request.body;
            // check if input is valid use zod
            const zInput = tt.io.input_schema.safeParse(input);
            if (!zInput.success) {
                reply.code(400).send(zInput.error);
                return;
            }
            const ctx = { request, reply };
            const output = await tt.tool_fn(zInput.data, ctx);
            return reply.send(output);
        };

        fastify.post(this.get_operation_id(), fn);
    }

    // Use io.input_schema as type for args
    execute_tool_function(input: any, ctx: any = null) {
        return this.tool_fn(input, ctx);
    }

    get_path(): string {
        return `/${this.name}`;
    }
    get_operation_id() {
        return `/${this.name}`;
    }

    get_gpt(): AssistantCreateParams.AssistantToolsFunction {
        const gpts: AssistantCreateParams.AssistantToolsFunction = {
            type: "function",
            function: {
                name: this.name,
                description: this.description,
                parameters: convertZodToFunctionParameters(this.io.input_schema),
            }
        };
        return gpts;
    }

    static get_gpts(tools: FunctionalTool[]): AssistantCreateParams.AssistantToolsFunction[] {
        return tools.map((tool) => tool.get_gpt());
    }

    // static generate sample tool function
    static sampleDirFlatTreeToolFunction() {
        const io: FunctionalTool_io_input_schema = {
            // * To describe a function that accepts no parameters, provide the value
            // * `{"type": "object", "properties": {}}`.
            input_schema: z.object({}),
            response_schema: z.object({
                complition: z.string().describe('Flat tree array of files in format dirctory/file.md'),
            }),
        };
        type Response = z.infer<typeof io.response_schema>;

        const tool_fn = (_input: unknown, _ctx: unknown): Response => {
            const root_dir = MainUtils.root_directory();
            const files = MainUtils.read_directory(root_dir);
            const flat_tree = MainUtils.flat_tree_from_files(files);
            return { complition: flat_tree.join('\n') };
        };

        const router_opts = {
            context: false,
            type: "query" as const,
        };

        return new FunctionalTool({
            name: 'sampleToolFunction',
            description: 'sampleToolFunction',
            tool_fn: tool_fn,
            io: io,
            router_opts: router_opts,
        });
    }
}


if (typeof require !== 'undefined' && require.main === module) {
    console.log("Hello, World!");
}
