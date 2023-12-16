import { MainUtils } from "../HostMachine";
import { DirectoryToolFunctionList } from "../ToolFunction/tools/Directory.tools";
import { ToolExecuteGitCommand } from "../ToolFunction/tools/Git.tools";
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
        tools_plugin: [
            ...DirectoryToolFunctionList,
            ToolExecuteGitCommand(),
        ]
    };
    return options;
}