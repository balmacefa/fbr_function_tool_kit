import { MainUtils } from "../HostMachine";
import { BaseToolPlugin } from "../ToolFunction/BaseToolPlugin";
import { GPT_MODELS } from "./GPTS_Codes";
import { AssistantOptions } from "./OpenAIAssistantWrapper";

type AssistantOptionsT = Omit<AssistantOptions, 'assistantId'>

export function get_task_master_assistant_options(): AssistantOptions {
    // Todo expose this to the create new session button
    const promt = MainUtils.read_file_from_root('src/ChatHTMX/prompts/TaskMaster.agent.promt.md').fileContent;
    const options: AssistantOptionsT = {
        model: GPT_MODELS.LAST_AND_BEST.model,
        instructions: promt,
        name: 'TaskMaster - v1.0.0',
        BaseToolPlugin: BaseToolPlugin.factory_plugin("fbr_BaseToolPlugin_tools_directory_and_git")
    };
    return options;
}