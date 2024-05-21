import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { AssignmentsType } from "../../entities/assignments/types";
import { changeAssignmentFavoriteByIdAction } from "../../actions/assignment/assignmentActions";
import { Status } from "../../../utils/constants";

export type IStatusState = "init" | "success" | "loading" | "error";

interface AssignmentState {
  assignments: AssignmentsType[] | null;
  activeTab: "library" | "favorites" | "my-list";
  status: IStatusState;
  message: string | undefined;
}

const initialState: AssignmentState = {
  assignments: null,
  activeTab: "library",
  status: Status.Init,
  message: "default",
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    changeTabActions: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AssignmentState>) => {
    builder
      .addCase(
        changeAssignmentFavoriteByIdAction.fulfilled,
        (state, action) => {
          state.status = Status.Success;
        },
      )
      .addCase(changeAssignmentFavoriteByIdAction.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(changeAssignmentFavoriteByIdAction.rejected, (state, action) => {
        state.status = Status.Error;
      });
  },
});

export const { setAssignments, changeTabActions } = assignmentSlice.actions;

export default assignmentSlice.reducer;
