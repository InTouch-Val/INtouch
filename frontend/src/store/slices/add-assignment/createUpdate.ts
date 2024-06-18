import { createSlice, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  createAssignment,
  updateAssignment,
  saveAsDraft,
} from "../../actions/add-assignment/addAssAct";
import { Status } from "../../../utils/constants";

export type IStatusState = "init" | "success" | "loading" | "error";

interface createUpdateState {
  status: IStatusState;
}

const initialState: createUpdateState = {
  status: Status.Init,
};

const createUpdate = createSlice({
  name: "assignments",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<createUpdateState>) => {
    builder
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.status = Status.Success;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.status = Status.Success;
      })
      .addCase(saveAsDraft.fulfilled, (state, action) => {
        state.status = Status.Success;
      })
      .addCase(createAssignment.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(updateAssignment.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(saveAsDraft.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = Status.Error;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.status = Status.Error;
      })
      .addCase(saveAsDraft.rejected, (state, action) => {
        state.status = Status.Error;
      });
  },
});

export default createUpdate.reducer;
