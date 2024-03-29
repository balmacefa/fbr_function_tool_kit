import { MainUtils } from "../HostMachine";
import { BaseToolPlugin } from "../ToolFunction/BaseToolPlugin";
import { GPT_MODELS } from "./GPTS_Codes";
import { AssistantOptions } from "./OpenAI/OpenAIAssistantWrapper";


// This is currrent folder

const CurrentPath = __dirname;

export enum AgentType {
    TaskMaster = "TaskMaster",
    TypeScriptTodo = "typescript_todo"
}

/**
 * Factory function to create AssistantOptions based on the provided AgentType.
 * @param agentType The type of agent from the AgentType enum.
 * @returns AssistantOptions based on the provided agent type.
 */
export function CreateAssistantOptions(agentType: AgentType = AgentType.TypeScriptTodo): AssistantOptions {
    console.log('creating agent: ', agentType)
    switch (agentType) {
        case AgentType.TaskMaster: {
            const prompt = MainUtils.read_file_from_path(CurrentPath + '/prompts/TaskMaster.agent.promt.md');
            return {
                model: GPT_MODELS.LAST_AND_BEST.model,
                instructions: prompt,
                name: 'TaskMaster - v1.0.0',
                BaseToolPlugin: BaseToolPlugin.factory_plugin("fbr_BaseToolPlugin_tools_directory_and_git")
            } as AssistantOptions;
        }
        case AgentType.TypeScriptTodo: {
            const prompt = MainUtils.read_file_from_path(CurrentPath + '/prompts/typescript_todo.agent.promt.md');
            return {
                model: GPT_MODELS.GPT_3_5_TURBO_1106.model,
                instructions: prompt,
                name: 'typescript_todo Agent - v1.0.0',
                BaseToolPlugin: BaseToolPlugin.factory_plugin("fbr_tools_minimal_directory__git__ts_tools")
            } as AssistantOptions;
        }
        default:
            throw new Error(`Unknown agent type: ${agentType}`);
    }
}

