import { createSlice, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  createAssignment,
  updateAssignment,
  saveAsDraft,
} from "../../actions/add-assignment/addAssAct";
import { Status } from "../../../utils/constants";

enum StatusState {
  Init = "init",
  Success = "success",
  Loading = "loading",
  Error = "error",
}

interface createUpdateState {
  status: StatusState;
}

const initialState: createUpdateState = {
  status: StatusState.Init,
};

const createUpdate = createSlice({
  name: "assignments",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<createUpdateState>) => {
    builder
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.status = StatusState.Success;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.status = StatusState.Success;
      })
      .addCase(saveAsDraft.fulfilled, (state, action) => {
        state.status = StatusState.Success;
      })
      .addCase(createAssignment.pending, (state, action) => {
        state.status = StatusState.Loading;
      })
      .addCase(updateAssignment.pending, (state, action) => {
        state.status = StatusState.Loading;
      })
      .addCase(saveAsDraft.pending, (state, action) => {
        state.status = StatusState.Loading;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = StatusState.Error;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.status = StatusState.Error;
      })
      .addCase(saveAsDraft.rejected, (state, action) => {
        state.status = StatusState.Error;
      });
  },
});

export default createUpdate.reducer;
