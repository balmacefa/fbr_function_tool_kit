import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { z } from "zod";
import { get_openapi_schema } from "../TaskMasterAgent";
import { AssistantsAPIBaseManager } from "./AssistantsManager";

const sessionStatus = async (session_id: string) => {
    const agent = await AssistantsAPIBaseManager.get_agent_by_session_id(session_id);
    if (!agent) {
        throw new Error("session not found");
    }
    const response: Run = await agent.check_status_and_run_actions();

    return response;
}
export const set_fastify_route_sessionStatus = (fastify: FastifyInstance, registry: OpenAPIRegistry) => {

    const route_id = '/assistants_manager/update_session'
    // Declare a route

    const input_zod = z.object({
        session_id: z.string().describe("session id"),
    });


    const output_zod = z.object({
        id: z.string().openapi({ example: "run_1" }),
        assistant_id: z.string().openapi({ example: "assistant_1" }),
        cancelled_at: z.union([z.number(), z.null()]).openapi({ example: null }),
        completed_at: z.union([z.number(), z.null()]).openapi({ example: null }),
        created_at: z.number().openapi({ example: 1615461056 }),
        expires_at: z.number().openapi({ example: 1625461056 }),
        failed_at: z.union([z.number(), z.null()]).openapi({ example: null }),
        file_ids: z.array(z.string()).openapi({ example: ["file_1", "file_2"] }),
        instructions: z.string().openapi({ example: "Run instructions" }),
        // last_error: z.union([LastErrorSchema, z.null()]).openapi({ example: null }),
        metadata: z.unknown().nullable().openapi({ example: null }),
        model: z.string().openapi({ example: "model_v1" }),
        object: z.literal('thread.run'),
        // required_action: z.union([RequiredActionSchema, z.null()]).openapi({ example: null }),
        started_at: z.union([z.number(), z.null()]).openapi({ example: null }),
        status: z.enum(['queued', 'in_progress', 'requires_action', 'cancelling', 'cancelled', 'failed', 'completed', 'expired']).openapi({ example: "queued" }),
        thread_id: z.string().openapi({ example: "thread_1" }),
        // tools: z.array(AssistantToolsSchema).openapi({ example: [{ type: 'code_interpreter' }] }),
    });

    get_openapi_schema(registry, {
        operationId: 'assistants_manager___update_session',
        path: route_id,
        description: 'update session',
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

        const output = await sessionStatus(zInput.data.session_id);

        return reply.send(output);
    };

    fastify.post(route_id, fn);
}