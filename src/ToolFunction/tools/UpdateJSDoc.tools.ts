import { ClassDeclaration, Project } from 'ts-morph';
import { z } from 'zod';
import { MainUtils } from '../../HostMachine';
import { ToolFunction } from '../ToolFunction';

const input_schema = z.object({
    relativeFilePath: z.string().describe('Relative path to the TypeScript file'),
    className: z.string().describe('Name of the class'),
    newJsDocComment: z.string().describe('New JSDoc comment'),
});

const response_schema = z.object({
    success: z.boolean().describe('Indicates whether the JSDoc comment was successfully updated'),
});

type IOInput = z.infer<typeof input_schema>;

const updateJSDocComment = async (input: IOInput): Promise<z.infer<typeof response_schema>> => {
    try {
        const project = new Project();
        const filePath = MainUtils.root_directory(input.relativeFilePath);
        const sourceFile = project.addSourceFileAtPath(filePath);

        const classDec = sourceFile.getClass(input.className);
        if (!classDec) {
            throw new Error(`Class ${input.className} not found in file ${input.relativeFilePath}`);
        }

        const jsDocTarget: ClassDeclaration = classDec;
        jsDocTarget.addJsDoc({
            description: input.newJsDocComment
        });

        await sourceFile.save();
        return { success: true };

    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

export const JSDocUpdater = (): ToolFunction => {
    return new ToolFunction<IOInput, Promise<z.infer<typeof response_schema>>>(
        'JSDocUpdater',
        'Update JSDoc comments in TypeScript files',
        updateJSDocComment,
        input_schema,
        response_schema
    );
};

// Update your tool function list
export const CodeModToolFunctionList = [
    JSDocUpdater(),
    // ... other tool functions
];
