import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import assignmentSlice, {
  setAssignments,
  setAssignmentsFavorites,
} from "./slices/assignments/assignmentSlice";
import { authSlice } from "./slices/index";
import { assignmentApi } from "./entities";
import { authApi } from "./entities/auth/auth";
import blocksReducer from "./slices/add-assignment/blocks";
import formAddAssignmentReducer from "./slices/add-assignment/form";
import errorsReducer from "./slices/add-assignment/errorsSlice";
import createUpdate from "./slices/add-assignment/createUpdate";
import { modalsSlice } from "./slices/modals/modalsSlice";
import { AssignmentTab } from "../utils/constants";

const assignmentsMiddleware = (store) => (next) => (action) => {
  if (assignmentApi.endpoints.getAssignments.matchFulfilled(action)) {
    store.dispatch(setAssignments(action.payload.entities));
  }
  return next(action);
};

const assignmentsFavoritesMiddleware = (store) => (next) => (action) => {
  const activeTab = store.getState().assignment.activeTab;
  if (
    activeTab == AssignmentTab.favorites &&
    assignmentApi.endpoints.getAssignments.matchFulfilled(action)
  ) {
    store.dispatch(setAssignmentsFavorites(action.payload));
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    assignment: assignmentSlice,
    auth: authSlice.reducer,
    blocks: blocksReducer,
    formAddAssignment: formAddAssignmentReducer,
    errors: errorsReducer,
    addAssignment: createUpdate,
    modals: modalsSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [assignmentApi.reducerPath]: assignmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(assignmentApi.middleware, assignmentsMiddleware)
      .concat(assignmentApi.middleware, assignmentsFavoritesMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
