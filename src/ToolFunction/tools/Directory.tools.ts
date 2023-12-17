import readdirp from 'readdirp';
import { z } from 'zod';
import { MainUtils } from '../../HostMachine';
import { ToolFunction } from '../ToolFunction';

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { MultiFileContentViewer } from './MultiFileContentViewer.tools';


extendZodWithOpenApi(z);

export const DirectoryStructureViewer = (): ToolFunction => {


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
        'DirectoryStructureViewer',
        'This tool create a directory tree of the current workspace or root path',
        tool_fn,
        input_schema,
        response_schema
    );
    // const tfn = new ToolFunction({
    // });
    return tfn;
};

export const TextFileReader = (): ToolFunction => {
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
        'TextFileReader',
        'Read file content',
        tool_fn,
        input_schema,
        response_schema
    );
    return tfn;
};

export const ToolSaveFileContent = (): ToolFunction => {
    const input_schema = z.object({
        filePath: z.string().describe('Path to the file to save content'),
        content: z.string().describe('Content to save in the file'),
    });

    const response_schema = z.object({
        success: z.boolean().describe('Indicates whether the content was successfully saved'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;

    const tool_fn = async (input: IOInput): IOResponse => {
        try {
            await MainUtils.saveContentToFile(input.filePath, input.content);
            return { success: true };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, IOResponse>(
        'ToolSaveFileContent',
        'Save file content',
        tool_fn,
        input_schema,
        response_schema
    );
    return tfn;
};

export const ToolCreateDirectory = (): ToolFunction => {
    const input_schema = z.object({
        directoryPath: z.string().describe('Path to the directory to create'),
    });

    const response_schema = z.object({
        success: z.boolean().describe('Indicates whether the directory was successfully created'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;

    const tool_fn = async (input: IOInput): IOResponse => {
        try {
            await MainUtils.createDirectory(input.directoryPath);
            return { success: true };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, IOResponse>(
        'ToolCreateDirectory',
        'Create a directory if it does not exist',
        tool_fn,
        input_schema,
        response_schema
    );
    return tfn;
};
export const ToolChangeRootDirectory = (): ToolFunction => {
    const input_schema = z.object({
        newRootPath: z.string().describe('New root directory path'),
    });

    const response_schema = z.object({
        success: z.boolean().describe('Indicates whether the root directory was successfully changed'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;

    const tool_fn = async (input: IOInput): IOResponse => {
        try {
            MainUtils.root_path = input.newRootPath;
            return { success: true };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, IOResponse>(
        'ToolChangeRootDirectory',
        'Change the root directory',
        tool_fn,
        input_schema,
        response_schema
    );
    return tfn;
};

export const ToolGetRootDirectory = (): ToolFunction => {
    const response_schema = z.object({
        rootPath: z.string().describe('Current root directory path'),
    });
    const inputSchema = z.object({}).strict();

    type IOResponse = Promise<z.infer<typeof response_schema>>;

    const tool_fn = async (): IOResponse => {
        try {
            const rootPath = MainUtils.root_path;
            return { rootPath };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<void, IOResponse>(
        'ToolGetRootDirectory',
        'Get the current root directory',
        tool_fn,
        inputSchema,
        response_schema
    );
    return tfn;
};


export const DirectoryToolFunctionList = [
    // TODO: use factory patter, to get this function tool, base on herent
    DirectoryStructureViewer(),
    TextFileReader(),
    MultiFileContentViewer(),
    ToolSaveFileContent(),
    ToolCreateDirectory(),
    ToolChangeRootDirectory(),
    ToolGetRootDirectory(),
]
export const MinimalDirectoryToolFunctionList = [
    DirectoryStructureViewer(),
    TextFileReader(),
    ToolSaveFileContent(),
]