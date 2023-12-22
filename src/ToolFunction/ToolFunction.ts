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


    // Use this to validate the input
    public async processRequest(requestBody: any, validateOutputSchema: boolean): Promise<{ status: number; response: any }> {
        try {
            // Validate request parameters against the schema
            const validationResult = this.validate_input(requestBody);

            if (!validationResult.success) {

                return { status: 400, response: { error: 'Invalid input', details: validationResult.error } };

            } else {

                // Execute the function with validated input
                const input = validationResult.data as any;
                const output = await this.toolFn(input);

                if (validateOutputSchema) {
                    // Validate the function's output
                    const outputValidation = this.validate_output(output);
                    if (!outputValidation.success) {
                        return { status: 500, response: { error: 'Function execution failed', details: outputValidation.error } };
                    }

                    return { status: 201, response: outputValidation.data };
                }
                return { status: 201, response: output };
            }

        } catch (executionError) {
            // Handle errors that might occur during function execution
            return { status: 500, response: { error: 'Error during function execution', details: executionError } };
        }
    }
    public async processRequestPlain(requestBody: any): Promise<string> {
        console.info(`Using tool: ${this.name}, with json string input: \n ${JSON.stringify(requestBody)} \n`)
        return JSON.stringify((await this.processRequest(requestBody, false)).response);
    }

}
