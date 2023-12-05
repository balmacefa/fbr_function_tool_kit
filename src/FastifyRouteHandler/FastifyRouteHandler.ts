// FastifyRouteHandler.ts
import { FastifyInstance } from "fastify";
import { ToolFunction } from "../ToolFunction/ToolFunction";
import { convertZodToFunctionParameters } from "./convertZodToJsonSchema";

export class FastifyRouteHandler {
    static setRoute(fastify: FastifyInstance, toolFunction: ToolFunction) {
        // Implementation for setting Fastify route...

        // // Declare a route
        // const tt = this;

        // const fn: RouteHandlerMethod = async function (request, reply) {
        //     const input = request.body;
        //     // check if input is valid use zod
        //     const zInput = tt.io.input_schema.safeParse(input);
        //     if (!zInput.success) {
        //         reply.code(400).send(zInput.error);
        //         return;
        //     }
        //     const ctx = { request, reply };
        //     const output = await tt.tool_fn(zInput.data, ctx);
        //     return reply.send(output);
        // };

        const opts = {
            schema: {
                body: {
                    type: 'object',
                    properties: convertZodToFunctionParameters
                }
            }
        }

        fastify.post(toolFunction.get_operation_id(), opts, async (request, reply) => {
            return { hello: 'world' }
        })

        fastify.post(toolFunction.get_operation_id(),

            (req,) => {

            }
        );
    }
}


if (typeof require !== 'undefined' && require.main === module) {
    console.log("Hello, FastifyRouteHandler!");
}
