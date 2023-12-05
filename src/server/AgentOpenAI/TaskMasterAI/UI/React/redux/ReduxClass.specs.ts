import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReduxClass } from "./ReduxClass";

describe('ReduxClass', () => {
    let reduxClass: ReduxClass<any>;

    beforeEach(() => {
        reduxClass = new ReduxClass<any>(jest.fn());
    });

    it('should initialize slice', () => {
        const slice = reduxClass.initializeSlice();
        expect(slice).toEqual(createSlice({
            name: 'chatSession',
            initialState: {},
            reducers: {
                // tus reducers
            },
            extraReducers: (builder) => {
                // tus extraReducers
            },
        }));
    });

    it('should create thunk', () => {
        const thunkFunction = jest.fn();
        const thunk = reduxClass.createThunk('testThunk', thunkFunction);
        expect(thunk).toEqual(createAsyncThunk('testThunk', expect.any(Function)));
    });

    // Add more test cases for other methods if necessary
});