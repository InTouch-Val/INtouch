import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import assignmentSlice, {
  setAssignments,
} from "./slices/assignments/assignmentSlice";
import { authSlice } from "./entities/auth/auth";
import { assignmentApi } from "./entities";
import { authApi } from "./entities/auth/auth";

const assignmentsMiddleware = (store) => (next) => (action) => {
  if (assignmentApi.endpoints.getAssignments.matchFulfilled(action)) {
    store.dispatch(setAssignments(action.payload));
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    assignment: assignmentSlice,
    auth: authSlice.reducer,

    [authApi.reducerPath]: authApi.reducer,
    [assignmentApi.reducerPath]: assignmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(assignmentApi.middleware, assignmentsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
