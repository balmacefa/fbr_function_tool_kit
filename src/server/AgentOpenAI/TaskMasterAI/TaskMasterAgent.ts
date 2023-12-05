import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { AnyZodObject } from 'zod';
import { Response403 } from '../../SwaggerDocs/SwaggerDocs.exclude';
import { AssistantsAPIBase, AssistantsAPIBaseArgs } from "../AssistantBase";
import { ToolDirectoryVisualization, ToolFileContent } from './ToolsSets/Directory.tools';

export class TaskMasterAI extends AssistantsAPIBase {
    private constructor() {
        // load ./Agent.md file for instructions
        const instructions_path = 'src/server/AgentOpenAI/TaskMasterAI/prompts/Agent.prompt.md';

        const args: AssistantsAPIBaseArgs = {
            name: "TaskMaster",
            description: "TaskMaster AI is a virtual assistant focused on managing tasks, goals, and objectives. Manage Agents as tools to accomplish tasks.",
            instructions_path,
            tools: [
                ToolDirectoryVisualization(),
                ToolFileContent(),
            ],
        }
        super(args);
    }

    // static generate new task mast async init() {
    public static async instance() {
        const agent = new TaskMasterAI();
        await agent.generateAssistant();
        return agent;
    }
}

export type get_openapi_schema_type = {
    operationId: string;
    path: string;
    description: string;
    tags: string[];
    input_schema: AnyZodObject;
    response_schema: AnyZodObject;
};


export const get_openapi_schema = (registry: OpenAPIRegistry,
    {
        description, input_schema, response_schema, path, operationId, tags
    }: get_openapi_schema_type) => {

    console.log("get_openapi_schema", { operationId, path, tags });

    registry.registerPath(
        {
            operationId,
            path,
            description,
            summary: description,
            tags,
            method: 'post',
            security: [{ ['Authorization']: [] }],
            request: {
                body: {
                    content: {
                        'application/json': {
                            schema: input_schema,
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
                            schema: response_schema,
                        },
                    },
                },
                ...Response403,
            },
        }

    );
};
