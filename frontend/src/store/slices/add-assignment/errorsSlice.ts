import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorsState {
  messages: Record<string, string>;
}

const initialState: ErrorsState = {
  messages: {},
};

const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<Record<string, string>>) => {
      state.messages = action.payload;
    },
    clearErrors: (state) => {
      state.messages = {};
    },
  },
});

export const { setError, clearErrors } = errorsSlice.actions;

export default errorsSlice.reducer;
