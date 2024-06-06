import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../service/axios";

interface Params {
  isFavorite: boolean;
  assignmentId: number | string;
}

export const changeAssignmentFavoriteByIdAction = createAsyncThunk(
  "assignment/changesAssignmentFavoriteByIdAction",
  async (params: Params, { rejectWithValue }) => {
    const { isFavorite, assignmentId } = params;

    try {
      const endpoint = isFavorite ? "delete-list" : "add-list";
      return await API.get(`assignments/${endpoint}/${assignmentId}`);
    } catch (error) {
      console.error("Error toggling favorites:", error);
      return rejectWithValue;
    }
  },
);

export const duplicateAssignmentAction = createAsyncThunk(
  "assignment/duplicateAssignmentAction",
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      const response = await API.get(`assignments/${assignmentId}/`);
      const data = response.data;

      return data;
    } catch (error) {
      console.error("Error duplicate:", error);
      return rejectWithValue;
    }
  },
);

export const draftAssignmentAction = createAsyncThunk(
  "assignment/draftAssignmentAction",
  async (responseAssignmentId: number, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `assignments/${responseAssignmentId}/draft/`,
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error duplicate:", error);
      return rejectWithValue;
    }
  },
);

export const setClientByIdAction = createAsyncThunk(
  "assignment/setClientByIdAction",
  async (
    { assignmentId, clientId }: { assignmentId: string; clientId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await API.get(
        `assignments/set-client/${assignmentId}/${clientId}/`,
      );
      const data = response;
      return data;
    } catch (error) {
      console.error("Error duplicate:", error);
      return rejectWithValue;
    }
  },
);
