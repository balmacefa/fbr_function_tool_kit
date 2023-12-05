import readdirp from 'readdirp';
import { z } from 'zod';
import { MainUtils } from '../../../../main_utils';
import { FunctionalTool, FunctionalTool_io_input_schema } from '../../FunctionalTool';



export const ToolDirectoryVisualization = () => {
    const io = {
        input_schema: z.object({
            directoryPath: z.string().describe('Path to the directory to visualize'),
            // fileFilter: z.string().optional().describe(`Filter for files, examples: '*.js', '*.txt', '*.md', etc...`),
            // fileFilter and directoryFilter is string or array of strings
            depth: z.number().optional()
                .default(12).describe(`Depth of the directory tree to visualize, default is 12`),
            directoryFilter: z.union([z.string(), z.array(z.string())]).optional()
                .default(['!.git', '!*modules',]).describe(`Filter for directories, examples: '!.git', '!*modules', etc...`),
            fileFilter: z.union([z.string(), z.array(z.string())]).optional().describe(`Filter for files, examples: '*.js', '*.txt', '*.md', etc...`),
        }),
        response_schema: z.object({
            result: z.array(z.string()).describe('Textual or graphical representation of the directory structure'),
        }),
    };

    type IOResponse = z.infer<typeof io.response_schema>;
    type IOInput = z.infer<typeof io.input_schema>;

    const tool_fn = async (input: IOInput, _ctx: undefined): Promise<IOResponse> => {
        // validate input
        const input_validated = io.input_schema.safeParse(input);
        if (!input_validated.success) {
            throw new Error(`Invalid input: ${input_validated.error}`);
        }

        try {

            const { directoryPath, depth, directoryFilter, fileFilter } = input_validated.data;
            const path = MainUtils.root_directory(directoryPath);
            console.log('path', path);

            const entries = await readdirp.promise(path, {
                fileFilter: fileFilter,
                directoryFilter: directoryFilter,
                type: 'all',
                depth: depth,
                // directoryFilter: (di) => di.basename.length === 9
            });
            console.log('entries', entries);
            let entries_flat = entries.map((entry) => {
                return entry.path;
            });

            if (entries_flat.length === 0) {
                entries_flat = [''];
            }

            return { result: entries_flat };

        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };


    const tfn = new FunctionalTool({
        name: 'directory_visualization',
        description: 'Visualize directory structure',
        tool_fn: tool_fn,
        io: io,
        router_opts: {
            context: false,
            type: "query",
        }
    });
    return tfn;
};

// This tool returns the full content of a file
// The file path is relative to the root directory of the server
// The file path is passed as a parameter to the tool function
// The file content is returned as a string

export const ToolFileContent = () => {
    const io: FunctionalTool_io_input_schema = {
        input_schema: z.object({
            filePath: z.string().describe('Path to the file to read'),
        }),
        response_schema: z.object({
            content: z.string().describe('Textual content of the file'),
        }),
    };

    type IOResponse = z.infer<typeof io.response_schema>;
    type IOInput = z.infer<typeof io.input_schema>;

    const tool_fn = (input: IOInput, _ctx: undefined): IOResponse => {
        const content = MainUtils.read_file_from_root(input.filePath);
        return { content: content };
    };

    type ToolFn = typeof tool_fn;

    const router_opts = {
        context: false,
        type: "query" as const,
    };

    const tfn = new FunctionalTool<ToolFn>({
        name: 'file_content',
        description: 'Read file content',
        tool_fn: tool_fn,
        io: io,
        router_opts: router_opts,
    });
    return tfn;
};