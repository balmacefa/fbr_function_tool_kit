import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { z } from 'zod';
import { ToolFunction } from '../ToolFunction';

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
