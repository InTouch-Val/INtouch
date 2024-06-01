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
