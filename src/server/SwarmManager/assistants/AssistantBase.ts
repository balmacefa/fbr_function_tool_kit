import { Assistant } from 'openai';
import { OpenAIClient } from '../client/OpenAIClient';

abstract class AssistantBase {
    protected client: OpenAIClient;
    protected assistant: Assistant;
    protected name: string;

    constructor(client: OpenAIClient, name: string) {
        this.client = client;
        this.name = name;
        this.assistant = this.initAssistant();
    }

    protected abstract initAssistant(): Assistant;

    async sendMessage(message: string): Promise<string> {
        // Logic to send a message to the assistant and get a response
    }

    getName(): string {
        return this.name;
    }

    // Additional common methods or utilities that all assistants might need
}

export default AssistantBase;
