import { AnyZodObject, z } from 'zod';

type SuccessResponse = {
    succeded: true;
    response: any;  // You might want to replace 'any' with a more specific type
};

type ErrorResponse = {
    succeded: false;
    error: {
        message: any;
        details: any
    };     // Similarly, replace 'any' with a more specific type if possible
};

type ResultToolFunction = SuccessResponse | ErrorResponse;


export class ToolFunction<TI = any, TO = any> {
    name: string;
    description: string;
    toolFn: (input: TI) => TO;
    inputSchema?: AnyZodObject | z.ZodString;
    responseSchema?: AnyZodObject | z.ZodString;
    host: string
    prefix_path: string

    constructor(
        name: string,
        description: string,
        toolFn: (input: TI) => TO,
        inputSchema?: AnyZodObject | z.ZodString,
        responseSchema?: AnyZodObject | z.ZodString,
        host?: string,
        prefix_path?: string
    ) {
        this.name = name;
        this.description = description;
        this.toolFn = toolFn;
        this.inputSchema = inputSchema;
        this.responseSchema = responseSchema;
        this.host = host ? host : 'http://localhost:1111';
        this.prefix_path = prefix_path ? prefix_path : '';
    }

    execute(input: TI): TO {
        return this.toolFn(input);
    }

    get_path(): string {
        return `${this.prefix_path}/${this.name}`;
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
    public async processRequest(requestBody: any, validateOutputSchema: boolean): Promise<ResultToolFunction> {
        try {
            // Validate request parameters against the schema
            const validationResult = this.validate_input(requestBody);

            if (!validationResult.success) {

                return { succeded: false, error: { message: 'Invalid input', details: validationResult.error } };

            } else {

                // Execute the function with validated input
                const input = validationResult.data as any;
                const output = await this.toolFn(input);

                if (validateOutputSchema) {
                    // Validate the function's output
                    const outputValidation = this.validate_output(output);
                    if (!outputValidation.success) {
                        return { succeded: false, error: { message: 'Function execution failed', details: outputValidation.error } };
                    }

                    return { succeded: true, response: outputValidation.data };
                }
                return { succeded: true, response: output };
            }

        } catch (executionError) {
            // Handle errors that might occur during function execution
            return { succeded: false, error: { message: 'Error during function execution', details: executionError } };
        }
    }
    public async processRequestPlain(requestBody: any): Promise<string> {
        console.info(`Using tool: ${this.name}, with json string input: \n ${JSON.stringify(requestBody)} \n`);
        const res = await this.processRequest(requestBody, false);
        if (res.succeded) {
            return JSON.stringify(res.response);
        }
        return JSON.stringify(res);
    }

}
