import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { z } from "zod";
import { get_openapi_schema } from "../TaskMasterAgent";
import { AssistantsAPIBaseManager } from "./AssistantsManager";

const getDisplayMessages = async (session_id: string) => {
    const agent = await AssistantsAPIBaseManager.get_agent_by_session_id(session_id);
    if (!agent) {
        throw new Error("session not found");
    }
    const response = await agent.get_display_messages();

    return response;
}

export const set_fastify_route_getDisplayMessages = (fastify: FastifyInstance, registry: OpenAPIRegistry) => {

    const route_id = '/assistants_manager/get_display_messages'
    // Declare a route

    const input_zod = z.object({
        session_id: z.string().describe("session id"),
    });

    const output_zod = z.object({
        response: z.object({}).describe("response from agent"),
    });

    get_openapi_schema(registry, {
        operationId: 'assistants_manager___get_display_messages',
        path: route_id,
        description: 'get display messages',
        tags: ['assistants_manager'],
        input_schema: input_zod,
        response_schema: output_zod,
    });

    // type for output
    type Output = z.infer<typeof output_zod>;

    const fn: RouteHandlerMethod = async function (request, reply): Promise<Output> {
        const input = request.body;
        // check if input is valid use zod
        const zInput = input_zod.safeParse(input);
        if (!zInput.success) {
            return reply.code(400).send(zInput.error);
        }

        const output = await getDisplayMessages(zInput.data.session_id);

        return reply.send({ response: output });
    };

    fastify.post(route_id, fn);
}