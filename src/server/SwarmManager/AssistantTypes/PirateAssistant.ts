import { Assistant } from 'openai';
import { OpenAIClient } from '../../client/OpenAIClient';
import AssistantBase from '../AssistantBase';

class PirateAssistant extends AssistantBase {
    constructor(client: OpenAIClient) {
        super(client, "PirateAssistant");
    }

    protected initAssistant(): Assistant {
        // Específica la inicialización del asistente pirata aquí
        return this.client.createAssistant({ /* opciones específicas del asistente pirata */ });
    }

    // Métodos específicos del asistente pirata
    tellPirateStory(): Promise<string> {
        // Lógica para contar una historia de piratas
    }
}

export default PirateAssistant;
