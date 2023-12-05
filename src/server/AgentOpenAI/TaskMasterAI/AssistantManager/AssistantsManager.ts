import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { FastifyInstance } from 'fastify';
import { TaskMasterAI } from '../TaskMasterAgent';
import { set_fastify_route_createSession } from './set_fastify_route_createSession';
import { set_fastify_route_getDisplayMessages } from './set_fastify_route_getDisplayMessages';
import { set_fastify_route_sendMessage } from './set_fastify_route_sendMessage';
import { set_fastify_route_sessionStatus } from './set_fastify_route_sessionStatus';

export class AssistantsAPIBaseManager {
    // Create endpoints for chat lifecycle, 1 create session, 2 send message, 3 update session, 4 delete session.
    // Store the agent session id map to taskmarter agent instances
    public static mapSessionIdToAgent: Map<string, TaskMasterAI> = new Map();
    static singleton: AssistantsAPIBaseManager = new AssistantsAPIBaseManager();
    static get_instance() {
        return this.singleton;
    }

    public static async get_agent_by_session_id(session_id: string): Promise<TaskMasterAI> {
        const agent = AssistantsAPIBaseManager.mapSessionIdToAgent.get(session_id);
        if (!agent) {
            // Try getting the agent from openai
            const agent = await TaskMasterAI.instance();
            const session = await agent.load_from_session(session_id);

            if (!session) {
                throw new Error("session not found");
            }

            AssistantsAPIBaseManager.mapSessionIdToAgent.set(session.id, agent);
            return agent;
        } else {
            return agent;
        }
    };


    public async set_fastify_routes(fastify: FastifyInstance, registry: OpenAPIRegistry) {
        console.log("-------------------------------------set_fastify_routes--------------");
        await set_fastify_route_getDisplayMessages(fastify, registry);
        await set_fastify_route_createSession(fastify, registry);
        await set_fastify_route_sendMessage(fastify, registry);
        await set_fastify_route_sessionStatus(fastify, registry);
        console.log("-------------------------------------set_fastify_routes--------------");
    }


}
