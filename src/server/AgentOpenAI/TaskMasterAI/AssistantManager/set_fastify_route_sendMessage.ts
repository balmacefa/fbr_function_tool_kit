import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages";
import { z } from "zod";
import { get_openapi_schema } from "../TaskMasterAgent";
import { AssistantsAPIBaseManager } from "./AssistantsManager";

import {
    extendZodWithOpenApi
} from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const messageContentSchema = z.object({
    type: z.string().openapi({ example: 'text' }),
    text: z.object({
        value: z.string().openapi({ example: 'hola, listar el carpeta root' }),
        annotations: z.array(z.any()).openapi({ example: [] })
    }).openapi({ example: { value: 'hola, listar el carpeta root', annotations: [] } })
}).openapi({ example: { type: 'text', text: { value: 'hola, listar el carpeta root', annotations: [] } } });

const threadMessageSchema = z.object({
    id: z.string().openapi({ example: 'msg_zijqYpetvYYU3jzQWpEVZ1Sx' }),
    object: z.string().openapi({ example: 'thread.message' }),
    created_at: z.number().int().openapi({ example: 1700695753 }),
    thread_id: z.string().openapi({ example: 'thread_GtMrBgiYDjxmy0Ha3tHIjN8e' }),
    role: z.string().openapi({ example: 'user' }),
    content: z.array(messageContentSchema).openapi({ example: [{ type: 'text', text: { value: 'hola, listar el carpeta root', annotations: [] } }] }),
    file_ids: z.array(z.any()).openapi({ example: [] }),
    assistant_id: z.string().nullable().openapi({ example: null }),
    run_id: z.string().nullable().openapi({ example: null }),
    metadata: z.object({}).openapi({ example: {} })
}).openapi({
    example: {
        id: 'msg_zijqYpetvYYU3jzQWpEVZ1Sx',
        object: 'thread.message',
        created_at: 1700695753,
        thread_id: 'thread_GtMrBgiYDjxmy0Ha3tHIjN8e',
        role: 'user',
        content: [{ type: 'text', text: { value: 'hola, listar el carpeta root', annotations: [] } }],
        file_ids: [],
        assistant_id: null,
        run_id: null,
        metadata: {}
    }
});

// 2 send message
const sendMessage = async (session_id: string, message: string) => {
    const agent = await AssistantsAPIBaseManager.get_agent_by_session_id(session_id);
    if (!agent) {
        throw new Error("session not found");
    }
    const response: ThreadMessage = await agent.addPromptMessageToThread(message);

    return response;
}
export const set_fastify_route_sendMessage = async (fastify: FastifyInstance, registry: OpenAPIRegistry) => {

    const route_id = '/assistants_manager/send_message'
    // Declare a route

    const input_zod = z.object({
        session_id: z.string().describe("session id"),
        message: z.string().describe("message to send"),
    });

    get_openapi_schema(registry, {
        operationId: 'assistants_manager___send_message',
        path: route_id,
        description: 'send message to agent',
        tags: ['assistants_manager'],
        input_schema: input_zod,
        response_schema: threadMessageSchema,
    });

    // type for output
    type Output = z.infer<typeof threadMessageSchema>;

    const fn: RouteHandlerMethod = async function (request, reply): Promise<Output> {
        const input = request.body;
        // check if input is valid use zod
        const zInput = input_zod.safeParse(input);
        if (!zInput.success) {
            return reply.code(400).send(zInput.error);
        }

        const output = await sendMessage(zInput.data.session_id, zInput.data.message);

        return reply.send(output);
    };

    fastify.post(route_id, fn);
}