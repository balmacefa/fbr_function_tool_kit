// convertZodToJsonSchema.spec.ts
import { z } from "zod";
import { convertZodToFunctionParameters } from "../../../../FastifyRouteHandler/convertZodToJsonSchema";

describe('convertZodToJsonSchema', () => {
    it('converts ZodObject to JSON Schema object type', () => {
        const zodSchema = z.object({
            name: z.string().describe('Full name'),
            age: z.number().describe('Age in years'),
            array: z.array(z.string()).describe('Array of strings'),
            unit: z.enum(["celsius", "fahrenheit"]).optional().describe('Temperature unit'),
            isStudent: z.boolean().optional().describe('Whether the person is a student'),
        });
        const jsonSchema = convertZodToFunctionParameters(zodSchema);
        expect(jsonSchema).toEqual({
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Full name' },
                age: { type: 'number', description: 'Age in years' },
                isStudent: { type: 'boolean', description: 'Whether the person is a student' },
                unit: { type: "string", enum: ["celsius", "fahrenheit"], description: 'Temperature unit' },
                array: { type: "array", items: { type: "string" }, description: 'Array of strings' },
            },
            additionalProperties: false,
            required: ['name', 'age', 'array']
        });
    });

    // Add more test cases for other Zod types or complex scenarios as necessary
});
