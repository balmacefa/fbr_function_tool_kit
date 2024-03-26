import { z } from 'zod';
import { ToolFunction } from '../ToolFunction';
import { Absolute_File_String_Reader_Tool } from './Directory.tools';

export const MultiFileContentViewer = (): ToolFunction => {
    const input_schema = z.object({
        filePaths: z.array(z.string()).describe('Array of paths to the files to read'),
    });
    const response_schema = z.object({
        contents: z.array(z.object({
            filePath: z.string(),
            content: z.string()
        })).describe('Array containing the path and content of each file'),
    });

    type IOInput = z.infer<typeof input_schema>;

    const tool_fn = async (input: IOInput): Promise<z.infer<typeof response_schema>> => {
        const { filePaths } = input;
        const fileContents = await Promise.all(filePaths.map(async (filePath) => {
            try {
                const reader = Absolute_File_String_Reader_Tool();
                // H1- Correction from tool_fn to toolFn
                const content = await reader.toolFn({ filePath });
                return { filePath, content: content.content };
            } catch (error) {
                throw new Error(`Error reading file ${filePath}: ${error}`);
            }
        }));
        return { contents: fileContents };
    };

    const tfn = new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
        'MultiFileContentViewer',
        'View content of multiple files',
        tool_fn,
        input_schema,
        response_schema
    );

    return tfn;
};