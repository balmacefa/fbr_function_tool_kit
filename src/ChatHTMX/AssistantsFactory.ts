import { MainUtils } from "../HostMachine";
import { BaseToolPlugin } from "../ToolFunction/BaseToolPlugin";
import { GPT_MODELS } from "./GPTS_Codes";
import { AssistantOptions } from "./OpenAIAssistantWrapper";

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
    switch (agentType) {
        case AgentType.TaskMaster: {
            const prompt = MainUtils.read_file_from_root('src/ChatHTMX/prompts/TaskMaster.agent.promt.md').fileContent;
            return {
                model: GPT_MODELS.LAST_AND_BEST.model,
                instructions: prompt,
                name: 'TaskMaster - v1.0.0',
                BaseToolPlugin: BaseToolPlugin.factory_plugin("fbr_BaseToolPlugin_tools_directory_and_git")
            } as AssistantOptions;
        }
        case AgentType.TypeScriptTodo: {
            const prompt = MainUtils.read_file_from_root('src/ChatHTMX/prompts/typescript_todo.agent.promt.md').fileContent;
            return {
                model: GPT_MODELS.LAST_AND_BEST.model,
                instructions: prompt,
                name: 'typescript_todo Agent - v1.0.0',
                BaseToolPlugin: BaseToolPlugin.factory_plugin("fbr_BaseToolPlugin_tools_directory_and_git")
            } as AssistantOptions;
        }
        default:
            throw new Error(`Unknown agent type: ${agentType}`);
    }
}

