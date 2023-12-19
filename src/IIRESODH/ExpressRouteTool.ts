import { Express, Request, Response } from "express";
import { AnyZodObject, z } from 'zod';

export class ExpressRouteTool<TI = any, TO = any> {
    private app: Express;

    path: string;
    toolFn: (input: TI) => TO;
    inputSchema?: AnyZodObject | z.ZodString;
    responseSchema?: AnyZodObject | z.ZodString;

    constructor(
        args: {
            path: string,
            app: Express,
            toolFn: (input: TI) => TO,
            inputSchema?: AnyZodObject | z.ZodString,
            responseSchema?: AnyZodObject | z.ZodString,
        }
    ) {
        this.path = args.path;
        this.toolFn = args.toolFn;
        this.inputSchema = args.inputSchema;
        this.responseSchema = args.responseSchema;
        this.app = args.app;

        // 
    }
    public register_as_get() {
        this.app.get(this.get_path(), async (req: Request, res: Response) => {
            const result = await this.processRequest(req.query);
            res.status(result.status).json(result.response);
        });
    }

    public register_as_post() {
        this.app.post(this.get_path(), async (req: Request, res: Response) => {
            const result = await this.processRequest(req.body);
            res.status(result.status).json(result.response);
        });
    }

    get_path(prefix?: string): string {
        return `${prefix ? prefix : ''}${this.path}`;
    }

    validate_input(data: any) {
        return (this.inputSchema as AnyZodObject).safeParse(data);
    }

    validate_output(data: any) {
        return (this.responseSchema as AnyZodObject).safeParse(data);
    }


    // Use this to validate the input
    public async processRequest(requestBody: any, validateOutputSchema = false): Promise<{ status: number; response: any }> {
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
        return JSON.stringify((await this.processRequest(requestBody, false)).response);
    }

}
