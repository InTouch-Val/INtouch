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
      return isFavorite
        ? await API.delete(`assignments/delete-list/${assignmentId}/`)
        : await API.post(`assignments/add-list/${assignmentId}/`);
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
      const response = await API.patch(
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
    {
      assignmentId,
      selectedClients,
    }: { assignmentId: string; selectedClients: string[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await API.post(
        `assignments/set-client/${assignmentId}/?clients=${selectedClients}`,
      );
      const data = response;
      return data;
    } catch (error) {
      console.error("Error duplicate:", error);
      return rejectWithValue;
    }
  },
);

export const clientAssignmentClear = createAsyncThunk(
  "assignment/clientAssignmentClear",
  async ({ assignmentId }: { assignmentId: string }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `assignments-client/${assignmentId}/clear/`,
      );
      const data = response;
      return data;
    } catch (error) {
      console.error("Error duplicate:", error);
      return rejectWithValue;
    }
  },
);
