import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../service/axios";
import { AssignmentReqData } from "../../entities/add-assignment/types";

interface FetchByIdParams {
  id: number;
}

interface CreateAssignmentParams {
  requestData: AssignmentReqData;
}

interface UpdateAssignmentParams {
  id: number;
  requestData: AssignmentReqData;
}

export const fetchAssignmentById = createAsyncThunk<void, FetchByIdParams>(
  "assignments/fetchById",
  async ({ id }, thunkAPI) => {
    try {
      const response = await API.get(`assignments/${id}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createAssignment = createAsyncThunk<void, CreateAssignmentParams>(
  "assignments/create",
  async ({ requestData }, thunkAPI) => {
    const response = await API.post("/assignments/", requestData);
    return response.data;
  }
);

export const updateAssignment = createAsyncThunk<void, UpdateAssignmentParams>(
  "assignments/update",
  async ({ id, requestData }, thunkAPI) => {
    const response = await API.patch(`/assignments/${id}/`, requestData);
    return response.data;
  }
);

export const saveAsDraft = createAsyncThunk<void, FetchByIdParams>(
  "assignments/saveAsDraft",
  async ({ id }, thunkAPI) => {
    const response = await API.post(`assignments/${id}/draft/`);
    return response.data;
  }
);
