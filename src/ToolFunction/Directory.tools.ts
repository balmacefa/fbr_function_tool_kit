import readdirp from 'readdirp';
import { z } from 'zod';
import { MainUtils } from '../HostMachine';
import { ToolFunction } from './ToolFunction';

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";


extendZodWithOpenApi(z);

export const ToolDirectoryVisualization = (): ToolFunction => {


    const input_schema = z.object({
        directoryPath: z.string().describe('Path to the directory to visualize').default(""),
        // fileFilter: z.string().optional().describe(`Filter for files, examples: '*.js', '*.txt', '*.md', etc...`),
        // fileFilter and directoryFilter is string or array of strings
        depth: z.number().optional()
            .default(3).describe(`Depth of the directory tree to visualize`),
        directoryFilter: z.union([z.string(), z.array(z.string())]).optional()
            .default(['!.git', '!*modules',]).describe(`Filter for directories, examples: '!.git', '!*modules', etc...`),
        // fileFilter: z.union([z.string(), z.array(z.string())]).optional().describe(`Filter for files, examples: '*.js', '*.txt', '*.md', etc...`),
    }).openapi({
        example: {
            directoryPath: '',
            depth: 1,
            directoryFilter: [
                "!.git",
                "!*modules"
            ],
        }
    });
    const response_schema = z.object({
        result: z.array(z.string()).describe('Textual or graphical representation of the directory structure'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;


    // <typeof input_schema, typeof response_schema >
    const tool_fn = async (input: IOInput): IOResponse => {
        // validate input
        const input_validated = input_schema.safeParse(input);
        if (!input_validated.success) {
            throw new Error(`Invalid input: ${input_validated.error}`);
        }

        try {

            const { directoryPath, depth, directoryFilter } = input_validated.data;
            const path = MainUtils.root_directory(directoryPath);
            console.log('path', path);

            const entries = await readdirp.promise(path, {
                // fileFilter: fileFilter,
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


    const tfn = new ToolFunction<IOInput, IOResponse>(
        'directory_visualization',
        'Visualize directory structure',
        tool_fn,
        input_schema,
        response_schema
    );
    // const tfn = new ToolFunction({
    // });
    return tfn;
};

export const ToolFileContent = (): ToolFunction => {
    const input_schema = z.object({
        filePath: z.string().describe('Path to the file to read'),
    });
    const response_schema = z.object({
        content: z.string().describe('Textual content of the file'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;

    // eslint-disable-next-line require-await
    const tool_fn = async (input: IOInput): IOResponse => {
        const content: string = MainUtils.read_file_from_root(input.filePath).fileContent;
        return { content: content };
    };

    const tfn = new ToolFunction<IOInput, IOResponse>(
        'file_content',
        'Read file content',
        tool_fn,
        input_schema,
        response_schema
    );
    return tfn;
};


