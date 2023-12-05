import OpenAPIClientAxios from "openapi-client-axios";
import { Client } from "../../../../../../openapi";
import { SliceState } from "../task_master_chat/ChatSlice";
import { ReduxClass } from "./ReduxClass";


let api: OpenAPIClientAxios | null = null;

export const get_axios_client = async () => {
    if (!api) {
        api = new OpenAPIClientAxios({
            definition: 'http://localhost:3000/docs.json',
        });
    }
    const client = await api.init<Client>();
    return client;
};
export class ChatManager extends ReduxClass<SliceState> {
    constructor() {
        super();
        // Inicialización adicional si es necesario
    }

    async Thunk__createSession() {
        return this.createThunk('chat/createSession', async (state, rejectWithValue) => {
            // Lógica para crear la sesión

            try {
                const username = state.user.username; // Adjust path according to your state structure

                const res = await (await get_axios_client()).assistants_manager___create_session(null, { username });

                return res.data; // Assuming the response data contains the session ID
            } catch (error) {
                return rejectWithValue(error);
            }

        });
    }

    // Sobrescribir o añadir métodos específicos del ChatManager
}

const chatManager = new ChatManager();
const chatSlice = chatManager.initializeSlice();
const sendMessageThunk = chatManager.createThunk('chat/sendMessage', async (message, thunkAPI) => {
    // Lógica para enviar mensajes
});

export const { actions, reducer } = chatSlice;
