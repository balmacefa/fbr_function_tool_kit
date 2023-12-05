import { z } from "zod";
import { ToolFunction } from "./ToolFunction";

// Define Zod schemas for input and output
const inputSchema = z.object({
    param1: z.string(),
    // ... other parameters
});

const responseSchema = z.object({
    result: z.number(),
    // ... other results
});

// Create a ToolFunction instance with the specific types
const myToolFunction = new ToolFunction(
    "MyToolFunction",
    "Description of my tool function",
    // eslint-disable-next-line require-await
    async (input) => {
        // ... function logic using input.param1, etc.
        return { result: 42 };
    },
    inputSchema,
    responseSchema
);

// Usage
async function useToolFunction() {
    const result = await myToolFunction.execute({ param1: "example" });
    console.log(result); // Output will be typed as per the responseSchema
}
