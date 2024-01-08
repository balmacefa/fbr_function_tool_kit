import { GPT_MODELS } from "../ChatHTMX";
import { AssistantManifest } from "../ChatHTMX/OpenAI/OpenAIAssistantWrapper";
import { MainUtils } from "../HostMachine";
import { BaseToolPlugin } from "../ToolFunction/BaseToolPlugin";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

// This is currrent folder

const CurrentPath = dirname(fileURLToPath(import.meta.url));


/**
 * Factory function to create AssistantOptions based on the provided AgentType.
 * @param agentType The type of agent from the AgentType enum.
 * @returns AssistantOptions based on the provided agent type.
 */
export function Tailwind_HTMX_alpine_jquery(): AssistantManifest {

    const prompt = MainUtils.read_file_from_path(CurrentPath + '/prompts/Tailwind_HTMX_alpine_jquery.agent.md');
    const manifest: AssistantManifest = {
        model: GPT_MODELS.LAST_AND_BEST.model,
        instructions: prompt,
        name: 'Tailwind_HTMX_alpine_jquery - v1.0.0',
        BaseToolPlugin: BaseToolPlugin.factory_plugin("fbr_BaseToolPlugin_tools_directory_and_git"),
        // ejs_render_path: "",
        // ejs_variables: {},
        show_case: false,
        description: ""
    }
    return manifest;
}
export function Full_stack_Software_Architect(): AssistantManifest {

    const prompt = MainUtils.read_file_from_path(CurrentPath + '/prompts/Full_stack_Software_Architect.agent.md');
    const manifest: AssistantManifest = {
        model: GPT_MODELS.LAST_AND_BEST.model,
        instructions: prompt,
        name: 'Full_stack_Software_Architect - v1.0.0',
        BaseToolPlugin: BaseToolPlugin.factory_plugin("fbr_BaseToolPlugin_tools_directory_and_git"),
        // ejs_render_path: "",
        // ejs_variables: {},
        show_case: false,
        description: ""
    }
    return manifest;
}
