/**
 * @constant
 * @description Constants for OpenAI GPT-4 models with details.
 */
const GPT_4_1106_PREVIEW = {
    model: 'gpt-4-1106-preview',
    description: 'GPT-4 TurboNew. The latest GPT-4 model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Returns a maximum of 4,096 output tokens. This preview model is not yet suited for production traffic.',
    contextWindow: '128,000 tokens',
    trainingData: 'Up to Apr 2023'
};
export const GPT_MODELS = {
    LAST_AND_BEST: GPT_4_1106_PREVIEW,
    GPT_4_1106_PREVIEW: GPT_4_1106_PREVIEW,
    GPT_4_VISION_PREVIEW: {
        model: 'gpt-4-vision-preview',
        description: 'GPT-4 Turbo with visionNew. Ability to understand images, in addition to all other GPT-4 Turbo capabilities. Returns a maximum of 4,096 output tokens. This is a preview model version and not suited yet for production traffic.',
        contextWindow: '128,000 tokens',
        trainingData: 'Up to Apr 2023'
    },
    GPT_4: {
        model: 'gpt-4',
        description: 'Currently points to gpt-4-0613. See continuous model upgrades.',
        contextWindow: '8,192 tokens',
        trainingData: 'Up to Sep 2021'
    },
    GPT_4_32K: {
        model: 'gpt-4-32k',
        description: 'Currently points to gpt-4-32k-0613. See continuous model upgrades.',
        contextWindow: '32,768 tokens',
        trainingData: 'Up to Sep 2021'
    },
    GPT_4_0613: {
        model: 'gpt-4-0613',
        description: 'Snapshot of gpt-4 from June 13th 2023 with improved function calling support.',
        contextWindow: '8,192 tokens',
        trainingData: 'Up to Sep 2021'
    },
    GPT_4_32K_0613: {
        model: 'gpt-4-32k-0613',
        description: 'Snapshot of gpt-4-32k from June 13th 2023 with improved function calling support.',
        contextWindow: '32,768 tokens',
        trainingData: 'Up to Sep 2021'
    },
    GPT_4_0314: {
        model: 'gpt-4-0314',
        description: 'Legacy. Snapshot of gpt-4 from March 14th 2023 with function calling support. This model version will be deprecated on June 13th 2024.',
        contextWindow: '8,192 tokens',
        trainingData: 'Up to Sep 2021'
    },
    GPT_4_32K_0314: {
        model: 'gpt-4-32k-0314',
        description: 'Legacy. Snapshot of gpt-4-32k from March 14th 2023 with function calling support. This model version will be deprecated on June 13th 2024.',
        contextWindow: '32,768 tokens',
        trainingData: 'Up to Sep 2021'
    }
};

