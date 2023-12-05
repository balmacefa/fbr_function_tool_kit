import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get_axios_client } from '../redux/ChatManager';
import { ChatMessage, Role } from './types';

export interface SliceState {
    chat: {
        session_id: string;
    };
    user: {
        username: string;
        // foo: string;
    };
    display_messages: {
        messages: ChatMessage[];
        object: string;
        data: any[];
        has_more: boolean;
        next: any;
        page: number;
        pages: number;
        per_page: number;
        total: number;
    };
    input: {
        prompt: string;
    }
}

const messages: ChatMessage[] = [
    {
        id: "msg_001",
        object: "thread.message",
        created_at: 1698984000,
        thread_id: "thread_123",
        role: Role.User,
        content: [
            {
                type: "text",
                text: {
                    value: "Hey, check out this cool photo!",
                    annotations: [],
                },
            },
        ],
        file_ids: [],
        assistant_id: null,
        run_id: null,
        metadata: {},
    },
    {
        id: "msg_002",
        object: "thread.message",
        created_at: 1698984050,
        thread_id: "thread_123",
        role: Role.User,
        content: [
            {
                type: "image_file",
                image_file: {
                    file_id: "img_123",
                },
            },
        ],
        file_ids: ["img_123"],
        assistant_id: null,
        run_id: null,
        metadata: {},
    },
    {
        id: "msg_003",
        object: "thread.message",
        created_at: 1698984100,
        thread_id: "thread_123",
        role: Role.Assistant,
        content: [
            {
                type: "text",
                text: {
                    value: "That's an amazing photo! Where was it taken?",
                    annotations: [],
                },
            },
        ],
        file_ids: [],
        assistant_id: "asst_001",
        run_id: null,
        metadata: {},
    },
    {
        id: "msg_004",
        object: "thread.message",
        created_at: 1698984150,
        thread_id: "thread_123",
        role: Role.User,
        content: [
            {
                type: "text",
                text: {
                    value: "It was taken on the way to San Francisco last summer.",
                    annotations: [],
                },
            },
        ],
        file_ids: [],
        assistant_id: null,
        run_id: null,
        metadata: {},
    },
    {
        id: "msg_005",
        object: "thread.message",
        created_at: 1698984200,
        thread_id: "thread_123",
        role: Role.Assistant,
        content: [
            {
                type: "text",
                text: {
                    value: "That's awesome! I would love to go there some day.",
                    annotations: [],
                },
            },
        ],
        file_ids: [],
        assistant_id: "asst_001",
        run_id: null,
        metadata: {},
    },
    {
        id: "msg_006",
        object: "thread.message",
        created_at: 1698984250,
        thread_id: "thread_123",
        role: Role.Assistant,
        content: [
            {
                type: "text",
                text: {
                    value: "Thanks for sharing.",
                    annotations: [],
                },
            },
        ],
        file_ids: [],
        assistant_id: "asst_001",
        run_id: null,
        metadata: {},
    },
];

const initialState: SliceState = {
    display_messages: {
        messages: messages,
        object: "list",
        data: [],
        has_more: false,
        next: null,
        page: 0,
        pages: 0,
        per_page: 0,
        total: 0,
    },
    input: {
        prompt: "",
    },
    user: {
        username: "user_001",
        // foo: "bar",
    },
    chat: {
        session_id: ''
    }
};

const definition = 'http://localhost:3000/docs.json';



export const assistants_manager___get_display_messages = createAsyncThunk(
    'chat_assistant/assistants_manager___get_display_messages',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as SliceState;
            const session_id = state.chat.session_id;
            const client = await get_axios_client();
            const res = await client.
                assistants_manager___get_display_messages(null, { session_id });

            return res.data;

        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const assistants_manager___create_session = createAsyncThunk('chat_assistant/assistants_manager___create_session', async (_, { getState, rejectWithValue }) => {

    try {
        const state = getState() as SliceState;
        const username = state.user.username; // Adjust path according to your state structure
        const client = await get_axios_client();
        const res = await client.assistants_manager___create_session(null, { username });

        return res.data; // Assuming the response data contains the session ID
    } catch (error) {
        return rejectWithValue(error);
    }

});


// /assistants_manager___send_message
export const assistants_manager___send_message = createAsyncThunk(
    'chat_assistant/assistants_manager___send_message',
    async (message: string, { rejectWithValue, getState }) => {
        try {

            const state = getState() as SliceState;
            const session_id = state.chat.session_id;
            const client = await get_axios_client();
            const res = await client.assistants_manager___send_message(null, {
                message,
                session_id,
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// /assistants_manager___update_session
export const assistants_manager___update_session = createAsyncThunk(
    'chat_assistant/assistants_manager___update_session',
    async (_, { rejectWithValue, getState }) => {
        try {

            const state = getState() as SliceState;
            const session_id = state.chat.session_id;

            const client = await get_axios_client();
            const res = await client.assistants_manager___update_session(
                null,
                {
                    session_id,
                }
            );
            type d = typeof res.data
            return res.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Represents the slice of the repository state in the Redux store.
 */
const repositorySlice = createSlice({
    name: 'repository',
    initialState,
    reducers: {
        setPrompt: (state, action: PayloadAction<string>) => {
            state.input.prompt = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handling get_display_messages
            .addCase(assistants_manager___get_display_messages.fulfilled, (state, action) => {
                state.display_messages = action.payload as unknown as any; // Update display messages
            })
            // Handling create_session
            .addCase(assistants_manager___create_session.fulfilled, (state, action) => {
                state.chat.session_id = action.payload.session_id; // Update session ID
            })
            // Handling send_message
            .addCase(assistants_manager___send_message.fulfilled, (state, action) => {
                // Start a timer to periodically check session status
                const intervalId = setInterval(() => {
                    store.dispatch(assistants_manager___update_session());
                }, 5000); // Check every 5 seconds

                // Store intervalId in the state for later reference
                state.chat.intervalId = intervalId;
            })
            // Handling update_session
            .addCase(assistants_manager___update_session.fulfilled, (state, action) => {
                // Check if session is completed
                if (action.payload.isCompleted) {
                    clearInterval(state.chat.intervalId); // Clear the interval
                    store.dispatch(assistants_manager___get_display_messages()); // Fetch latest messages
                }
            })
            .addCase(assistants_manager___get_display_messages.pending, (state) => {
                // Optional: Handle loading state
            })
            .addCase(assistants_manager___get_display_messages.rejected, (state, action) => {
                // Optional: Handle error state
                console.error('Error fetching display messages:', action.error);
            })
            .addCase(assistants_manager___create_session.pending, (state) => {
                // Optional: Handle loading state
            })
            .addCase(assistants_manager___create_session.rejected, (state, action) => {
                // Optional: Handle error state
                console.error('Error creating session:', action.error);
            })
            .addCase(assistants_manager___send_message.pending, (state) => {
                // Optional: Handle loading state
            })
            .addCase(assistants_manager___send_message.rejected, (state, action) => {
                // Optional: Handle error state
                console.error('Error sending message:', action.error);
            })
            .addCase(assistants_manager___update_session.pending, (state) => {
                // Optional: Handle loading state
            })
            .addCase(assistants_manager___update_session.rejected, (state, action) => {
                // Optional: Handle error state
                console.error('Error updating session:', action.error);
            });
    },


});

export const repositoryActions = repositorySlice.actions;

export default repositorySlice.reducer;

export const TaskMasterChatReducer = repositorySlice.reducer;
