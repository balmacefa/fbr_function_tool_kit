import { Slice, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type Thunk__function<P> = (state: P, rejectWithValue: (value: unknown) => unknown) => Promise<any>;


export class ReduxClass<T> {
    [key: string]: any; // Add this line

    protected slice: Slice;

    protected thunks: { [key: string]: Function };

    constructor() {
        this.slice = this.initializeSlice();

        // Initialize thunk collection
        this.thunks = {};
        const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (const func of functions) {
            if (func.startsWith('Thunk__')) {
                // Register thunks for dispatch
                this.thunks[func] = this[func]();
            }
        }

    }

    public initializeSlice(): Slice {
        return createSlice({
            name: 'chatSession',
            initialState: {},
            reducers: {
                // tus reducers
            },
            extraReducers: (builder) => {
                // tus extraReducers
            },
        });
    }

    public createThunk(name: string, thunkFunction: Thunk__function<T>): any {
        return createAsyncThunk(name,
            async (_, { rejectWithValue, getState }) => {
                try {
                    const state = getState() as T;
                    return await thunkFunction(state, rejectWithValue);
                } catch (error) {
                    return rejectWithValue(error);
                }
            }

        );
    }

    // Métodos adicionales si es necesario
}
