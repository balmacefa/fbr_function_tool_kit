import { AnyZodObject, infer as zInfer } from "zod";

export class ToolFunction<TInputSchema extends AnyZodObject = AnyZodObject, TResponseSchema extends AnyZodObject = AnyZodObject> {
    name: string;
    description: string;
    toolFn: (input: zInfer<TInputSchema>) => Promise<zInfer<TResponseSchema>>;
    inputSchema: TInputSchema;
    responseSchema: TResponseSchema;

    constructor(
        name: string,
        description: string,
        toolFn: (input: zInfer<TInputSchema>, ctx?: any) => Promise<zInfer<TResponseSchema>>,
        inputSchema: TInputSchema,
        responseSchema: TResponseSchema
    ) {
        this.name = name;
        this.description = description;
        this.toolFn = toolFn;
        this.inputSchema = inputSchema;
        this.responseSchema = responseSchema;
    }

    async execute(input: zInfer<TInputSchema>): Promise<zInfer<TResponseSchema>> {
        return this.toolFn(input);
    }

    get_path(): string {
        return `/${this.name}`;
    }
    get_operation_id() {
        return `/${this.name}`;
    }
}
