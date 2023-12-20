import OpenAIAssistantWrapper, { AssistantOptions } from "./OpenAIAssistantWrapper";

interface SessionData {
    userId: string;
    title: string;

    asistant_wrap: OpenAIAssistantWrapper;
    asistant_wrap_id: OpenAIAssistantWrapper['assistantId'];
}
// TODO: remove this class
export class OpenAIAssistantSessionManager {
    private static instance: OpenAIAssistantSessionManager;
    private sessions: Map<string, SessionData[]>;

    // Constructor privado
    private constructor() {
        this.sessions = new Map();
    }

    // Método estático para acceder a la instancia
    public static getInstance(): OpenAIAssistantSessionManager {
        if (!OpenAIAssistantSessionManager.instance) {
            OpenAIAssistantSessionManager.instance = new OpenAIAssistantSessionManager();
        }
        return OpenAIAssistantSessionManager.instance;
    }

    // Crear y registrar una nueva sesión
    createSession(userId: string, title: string, options: AssistantOptions): SessionData {
        const ass_wrap = new OpenAIAssistantWrapper(options);

        const sessData: SessionData = { userId, title, asistant_wrap: ass_wrap, asistant_wrap_id: ass_wrap.assistantId };
        this.sessions.set(userId, [sessData, ...this.sessions.get(userId) || []]);
        return sessData;
    }

}
