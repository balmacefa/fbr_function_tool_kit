import { AnyZodObject } from 'zod';

export class ToolFunction<TI = any, TO = any> {
    name: string;
    description: string;
    toolFn: (input: TI) => TO;
    inputSchema: AnyZodObject;
    responseSchema: AnyZodObject;

    constructor(
        name: string,
        description: string,
        toolFn: (input: TI) => TO,
        inputSchema: AnyZodObject,
        responseSchema: AnyZodObject
    ) {
        this.name = name;
        this.description = description;
        this.toolFn = toolFn;
        this.inputSchema = inputSchema;
        this.responseSchema = responseSchema;
    }

    execute(input: TI): TO {
        return this.toolFn(input);
    }

    get_path(): string {
        return `/${this.name}`;
    }
    get_operation_id() {
        return `/${this.name}`;
    }

    validate_input(data: any) {
        return this.inputSchema.safeParse(data);
    }

    validate_output(data: any) {
        return this.responseSchema.safeParse(data);
    }
}
