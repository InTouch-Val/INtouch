import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../service/axios";

export const fetchAssignmentById = createAsyncThunk(
  "assignments/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await API.get(`assignments/${id}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
