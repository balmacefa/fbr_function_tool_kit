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


    // <typeof input_schema, typeof response_schema >
    const tool_fn = async (input: IOInput): Promise<z.infer<typeof response_schema>> => {
        // validate input
        const input_validated = input_schema.safeParse(input);
        if (!input_validated.success) {
            throw new Error(`Invalid input: ${input_validated.error}`);
        }

        try {

            const { directoryPath, depth, directoryFilter } = input_validated.data;
            const path = MainUtils.root_directory(directoryPath);

            const entries = await readdirp.promise(path, {
                // fileFilter: fileFilter,
                directoryFilter: directoryFilter,
                type: 'all',
                depth: depth,
                // directoryFilter: (di) => di.basename.length === 9
            });
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


    const tfn = new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
        'Generate_Directory_Structure_Tree',
        'This tool create a directory tree of the current workspace or root path',
        tool_fn,
        input_schema,
        response_schema
    );
    // const tfn = new ToolFunction({
    // });
    return tfn;
};

export const Absolute_File_String_Reader_Tool = (): ToolFunction => {
    const input_schema = z.object({
        absolutePath: z.string().describe('Absolute Path to the file to read'),
    });
    const response_schema = z.object({
        content: z.string().describe('Textual content of the file'),
    });

    type IOInput = z.infer<typeof input_schema>;

    const tool_fn = (input: IOInput): Promise<z.infer<typeof response_schema>> => {
        const content: string = MainUtils.read_file_from_path(input.absolutePath);
        return Promise.resolve({ content: content });
    };

    const tfn = new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
        'Absolute_File_String_Reader_Tool',
        'Read file content',
        tool_fn,
        input_schema,
        response_schema
    );
    return tfn;
};
export const Local_File_String_Reader_Tool = (): ToolFunction => {
    const input_schema = z.object({
        absolutePath: z.string().describe('Relative Path to the file to read'),
    });

    const response_schema = z.string().describe('Return the string file full content');

    type IOInput = z.infer<typeof input_schema>;

    const tool_fn = (input: IOInput): Promise<z.infer<typeof response_schema>> => {
        const content: string = MainUtils.read_file_from_root(input.absolutePath).fileContent;
        return Promise.resolve(content);
    };

    const tfn = new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
        'Local_File_String_Reader_Tool',
        'Read file content relative to the current project location',
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

    const tool_fn = async (input: IOInput): Promise<z.infer<typeof response_schema>> => {
        try {
            await MainUtils.saveContentToFile(input.filePath, input.content);
            return { success: true };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
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

    const tool_fn = async (input: IOInput): Promise<z.infer<typeof response_schema>> => {
        try {
            await MainUtils.createDirectory(input.directoryPath);
            return { success: true };
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
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

    const tool_fn = (input: IOInput): Promise<z.infer<typeof response_schema>> => {
        try {
            MainUtils.set_root_path(input.newRootPath);
            return Promise.resolve({ success: true });
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
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


    const tool_fn = (): Promise<z.infer<typeof response_schema>> => {
        try {
            const rootPath = MainUtils.get_root_path();
            return Promise.resolve({ rootPath });
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<void, Promise<z.infer<typeof response_schema>>>(
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
    Local_File_String_Reader_Tool(),
    Absolute_File_String_Reader_Tool(),
    MultiFileContentViewer(),
    ToolSaveFileContent(),
    ToolCreateDirectory(),
    ToolChangeRootDirectory(),
    ToolGetRootDirectory(),
]
export const MinimalDirectoryToolFunctionList = [
    DirectoryStructureViewer(),
    Local_File_String_Reader_Tool(),
    Absolute_File_String_Reader_Tool(),
    ToolSaveFileContent(),
]