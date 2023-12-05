import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { OpenAPIClient } from 'openapi-client-axios';
import AssistantBase from '../assistants/AssistantBase';

class CustomerSupportAssistant extends AssistantBase {
    constructor(client: OpenAPIClient) {
        super(client, "CustomerSupportAssistant");
    }

    protected initAssistant(): Assistant {
        // Específica la inicialización del asistente de soporte al cliente aquí
        return this.client.createAssistant({ /* opciones específicas del asistente de soporte */ });
    }

}

export default CustomerSupportAssistant;
