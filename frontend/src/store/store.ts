import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, EntityState } from "@reduxjs/toolkit";
import assignmentSlice, {
  setAssignments,
  setAssignmentsFavorites,
} from "./slices/assignments/assignmentSlice";
import { authSlice } from "./slices/index";
import {
  assignmentAdapter,
  assignmentApi,
  assignmentSelector,
} from "./entities";
import { authApi } from "./entities/auth/auth";
import { modalsSlice } from "./slices/modals/modalsSlice";
import { AssignmentTab } from "../utils/constants";

const assignmentsMiddleware = (store) => (next) => (action) => {
  if (assignmentApi.endpoints.getAssignments.matchFulfilled(action)) {
    const { entities, ...originalArgs } = action.payload;
    const selectedData = assignmentSelector.selectAll(
      assignmentAdapter.setAll(assignmentAdapter.getInitialState(), entities),
    );
    const newArray = selectedData.concat(
      store.getState().assignment.assignments?.entities,
    );
    const modifiedActionPayload = { ...action.payload, entities: newArray };
    store.dispatch(setAssignments(modifiedActionPayload));
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
