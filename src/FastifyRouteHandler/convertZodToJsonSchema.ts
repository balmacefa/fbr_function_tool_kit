import { FunctionParameters } from "openai/resources";
/**
 * The parameters the functions accepts, described as a JSON Schema object. See the
 * [guide](https://platform.openai.com/docs/guides/gpt/function-calling) for
 * examples, and the
 * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
 * documentation about the format.
 *
 * To describe a function that accepts no parameters, provide the value
 * `{"type": "object", "properties": {}}`.
 * 
 * 
 * export type FunctionParameters = Record<string, unknown>;
 *  
*/

import { AnyZodObject } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export function convertZodToFunctionParameters(zodSchema: AnyZodObject | any): FunctionParameters {
    const jsonSchema = zodToJsonSchema(zodSchema, "my_schema");

    return jsonSchema.definitions?.my_schema as FunctionParameters;
    // return convertJsonSchemaToFunctionParameters(jsonSchema);

}
