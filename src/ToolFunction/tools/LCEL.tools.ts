import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { z } from 'zod';
import { ToolFunction } from '../ToolFunction';

export const Tool_chat_session = (): ToolFunction => {
    // Define the input and output schema
    const input_schema = z.object({
        input: z.string().describe('User input message'),
    });

    const response_schema = z.object({
        response: z.string().describe('Chatbot response'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;

    // Chat model initialization with OpenAI
    const model = new ChatOpenAI({}); // Initialize OpenAI's chat model

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful chatbot"],
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
    ]);

    // Memory configuration
    const memory = new BufferMemory({
        returnMessages: true,
        inputKey: "input",
        outputKey: "output",
        memoryKey: "history",
    });

    // Define the tool function
    const tool_fn = async (input: IOInput): IOResponse => {
        try {
            // Load the conversation history from memory
            const memoryVariables = await memory.loadMemoryVariables({});

            // Create the runnable sequence
            const chain = RunnableSequence.from([
                {
                    input: () => input.input,
                    memory: () => memoryVariables,
                },
                {
                    input: (previousOutput) => previousOutput.input,
                    history: (previousOutput) => previousOutput.memory.history,
                },
                prompt,
                model, // Use the OpenAI model here
            ]);

            // Invoke the chain and get the response
            const response = await chain.invoke({ input: input.input });

            // Save the new context to memory
            await memory.saveContext({ input: input.input }, { output: response.content });

            // Return the chatbot's response
            return { response: response.content.toString() };
        } catch (error) {
            throw new Error(`Error in Tool_chat_session: ${error}`);
        }
    };

    // Create and return the new ToolFunction
    return new ToolFunction<IOInput, IOResponse>(
        'Tool_chat_session',
        'Interactive chat session tool',
        tool_fn,
        input_schema,
        response_schema
    );
};

export const Tool_tell_me_a_short_joke_about_topic = (): ToolFunction => {
    const input_schema = z.object({
        topic: z.string().describe('Joke Topic'),
    });

    const response_schema = z.object({
        response: z.string().describe('Standard output of prompt joke'),
    });

    type IOInput = z.infer<typeof input_schema>;
    type IOResponse = Promise<z.infer<typeof response_schema>>;

    const tool_fn = async (input: IOInput): IOResponse => {
        try {

            const prompt = ChatPromptTemplate.fromMessages([
                ["human", "Tell me a short joke about {topic}"],
            ]);
            const model = new ChatOpenAI({});
            const outputParser = new StringOutputParser();

            const chain = prompt.pipe(model).pipe(outputParser);

            const response = await chain.invoke({
                topic: input.topic,
            });
            console.log(response);

            return { response };

        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    };

    const tfn = new ToolFunction<IOInput, IOResponse>(
        'Tool_tell_me_a_short_joke_about_topic',
        'Tell me a short joke about {topic}',
        tool_fn,
        input_schema,
        response_schema
    );

    return tfn;
};
