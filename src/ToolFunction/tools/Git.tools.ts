import { execa } from 'execa';
import { z } from 'zod';
import { MainUtils } from '../../HostMachine';
import { ToolFunction } from '../ToolFunction';
export const ToolExecuteGitCommand = (): ToolFunction => {
    const input_schema = z.object({
        gitCommand: z.string().describe('Git command to execute (without "git" prefix)'),
    });

    const response_schema = z.object({
        stdout: z.string().describe('Standard output of the Git command'),
        stderr: z.string().describe('Standard error output of the Git command'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;

    const tool_fn = async (input: IOInput): IOResponse => {
        try {
            const { gitCommand } = input;
            const fullGitCommand = `git ${gitCommand}`; // Add "git" prefix
            const rootPath = MainUtils.get_root_path();
            console.log('try command ', fullGitCommand)
            const { stdout, stderr } = await execa(fullGitCommand, {
                cwd: rootPath,
                shell: true,
            });

            return { stdout, stderr };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, IOResponse>(
        'GIT_CLI_Tools',
        'Execute a Git command on the root path',
        tool_fn,
        input_schema,
        response_schema
    );

    return tfn;
};
