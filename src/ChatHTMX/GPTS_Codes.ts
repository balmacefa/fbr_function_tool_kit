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

const GPT_3_5_TURBO_1106 = {
    model: 'gpt-3.5-turbo-1106',
    description: 'Updated GPT 3.5 TurboNew. The latest GPT-3.5 Turbo model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Returns a maximum of 4,096 output tokens.',
    contextWindow: '16,385 tokens',
    trainingData: 'Up to Sep 2021'
};

const GPT_3_5_TURBO = {
    model: 'gpt-3.5-turbo',
    description: 'Currently points to gpt-3.5-turbo-0613.',
    contextWindow: '4,096 tokens',
    trainingData: 'Up to Sep 2021'
};

const GPT_3_5_TURBO_16K = {
    model: 'gpt-3.5-turbo-16k',
    description: 'Currently points to gpt-3.5-turbo-0613.',
    contextWindow: '16,385 tokens',
    trainingData: 'Up to Sep 2021'
};

const GPT_3_5_TURBO_INSTRUCT = {
    model: 'gpt-3.5-turbo-instruct',
    description: 'Similar capabilities as text-davinci-003 but compatible with legacy Completions endpoint and not Chat Completions.',
    contextWindow: '4,096 tokens',
    trainingData: 'Up to Sep 2021'
};

const GPT_3_5_TURBO_0613 = {
    model: 'gpt-3.5-turbo-0613',
    description: 'Legacy. Snapshot of gpt-3.5-turbo from June 13th 2023. Will be deprecated on June 13, 2024.',
    contextWindow: '4,096 tokens',
    trainingData: 'Up to Sep 2021'
};

const GPT_3_5_TURBO_16K_0613 = {
    model: 'gpt-3.5-16k-turbo-0613',
    description: 'Legacy. Snapshot of gpt-3.5-16k-turbo from June 13th 2023. Will be deprecated on June 13, 2024.',
    contextWindow: '16,385 tokens',
    trainingData: 'Up to Sep 2021'
};

const GPT_3_5_TURBO_0301 = {
    model: 'gpt-3.5-turbo-0301',
    description: 'Legacy. Snapshot of gpt-3.5-turbo from March 1st 2023. Will be deprecated on June 13th 2024.',
    contextWindow: '4,096 tokens',
    trainingData: 'Up to Sep 2021'
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
    },
    GPT_3_5_TURBO_1106,
    GPT_3_5_TURBO,
    GPT_3_5_TURBO_16K,
    GPT_3_5_TURBO_INSTRUCT,
    GPT_3_5_TURBO_0613,
    GPT_3_5_TURBO_16K_0613,
    GPT_3_5_TURBO_0301

    // []todo:  agregar el resto de gpt 3 
};

