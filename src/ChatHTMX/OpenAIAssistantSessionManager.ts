import OpenAIAssistantWrapper, { AssistantOptions } from "./OpenAIAssistantWrapper";

interface SessionData {
    id: string;
    userId: string;
    title: string;

    asistant_wrap: OpenAIAssistantWrapper;
    asistant_wrap_id: OpenAIAssistantWrapper['assistantId'];
}

export class OpenAIAssistantSessionManager {
    // TODO Use a db to manage this data
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
        const sessionId = this.generateSessionId();

        const sessData: SessionData = { id: sessionId, userId, title, asistant_wrap: ass_wrap, asistant_wrap_id: ass_wrap.assistantId };
        this.sessions.set(userId, [sessData, ...this.sessions.get(userId) || []]);
        return sessData;
    }

    // Obtener una sesión por su ID
    getSession(userId: string, sessionId: string): SessionData | undefined {
        // Obtener todas las sesiones asociadas con el userId
        const userSessions = this.sessions.get(userId);

        // Buscar la sesión específica por sessionId
        if (userSessions) {
            return userSessions.find(session => session.id === sessionId);
        }

        // Retornar undefined si no se encuentra la sesión
        return undefined;
    }


    // Listar todas las sesiones de un usuario específico
    listUserSessions(userId: string): SessionData[] {
        return this.sessions.get(userId) || [];
    }

    // Eliminar una sesión
    async deleteSession(userId: string, sessionId: string): Promise<boolean> {
        const session = this.getSession(userId, sessionId);
        if (session) {
            if (await session.asistant_wrap.deleteAssistant()) {
                const userSessions = this.sessions.get(userId) as SessionData[];
                const new_user_list = userSessions?.filter(session => session.id !== sessionId);
                this.sessions.set(userId, new_user_list)
            }
        }
        return false;
    }

    // Generar un ID único para la sesión
    private generateSessionId(): string {
        return crypto.randomUUID(); // Usar UUID para generar un identificador único
    }

    // Métodos adicionales pueden ser añadidos aquí
    public getChatsByUserId(user_id: string) {
        return [{ id: "13", title: "hola chat" }, { id: "123", title: "chat" + user_id }]
    }
}
