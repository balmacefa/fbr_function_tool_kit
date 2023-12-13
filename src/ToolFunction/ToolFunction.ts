import { AnyZodObject, z } from 'zod';

export class ToolFunction<TI = any, TO = any> {
    name: string;
    description: string;
    toolFn: (input: TI) => TO;
    inputSchema?: AnyZodObject | z.ZodString;
    responseSchema?: AnyZodObject | z.ZodString;
    host: string

    constructor(
        name: string,
        description: string,
        toolFn: (input: TI) => TO,
        inputSchema?: AnyZodObject | z.ZodString,
        responseSchema?: AnyZodObject | z.ZodString,
        host?: string
    ) {
        this.name = name;
        this.description = description;
        this.toolFn = toolFn;
        this.inputSchema = inputSchema;
        this.responseSchema = responseSchema;
        host ? this.host = host : this.host = 'http://localhost:3000'
    }

    execute(input: TI): TO {
        return this.toolFn(input);
    }

    get_path(prefix = ''): string {
        return prefix + `/${this.name}`;
    }
    get_operation_id() {
        // operatino id can not include /
        return `${this.name}`;
    }

    validate_input(data: any) {
        return (this.inputSchema as AnyZodObject).safeParse(data);
    }

    validate_output(data: any) {
        return (this.responseSchema as AnyZodObject).safeParse(data);
    }
}
