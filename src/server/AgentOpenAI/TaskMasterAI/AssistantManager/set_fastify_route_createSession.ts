import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { RouteHandlerMethod } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import { z } from "zod";
import { TaskMasterAI, get_openapi_schema } from "../TaskMasterAgent";
import { AssistantsAPIBaseManager } from "./AssistantsManager";
// ---------------------------------------------------------------------------------
// Create endpoints for chat lifecycle, 1 create session, 2 send message, 3 update session, 4 delete session.
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// 1 create session
const createSession = async (user_name: string) => {
    const agent = await TaskMasterAI.instance();
    agent.generateAssistant();
    const session = await agent.createThread(undefined, { user_name });
    AssistantsAPIBaseManager.mapSessionIdToAgent.set(session.id, agent);
    return session.id;
}

export const set_fastify_route_createSession = async (fastify: FastifyInstance, registry: OpenAPIRegistry) => {

    const route_id = '/assistants_manager/create_session'
    // Declare a route

    const input_zod = z.object({
        username: z.string().describe("username of the user creating the session"),
    });

    const output_zod = z.object({
        session_id: z.string().describe("session id")
    })


    get_openapi_schema(registry, {
        operationId: 'assistants_manager___create_session',
        path: route_id,
        description: 'create a session for the agent',
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

        const id = await createSession(zInput.data.username);
        const output: Output = {
            session_id: id,
        };

        return reply.send(output);
    };

    fastify.post(route_id, fn);
}
