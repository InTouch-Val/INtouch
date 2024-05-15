import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { AssignmentsType } from "../../entities/assignments/types";
import { changeAssignmentFavoriteByIdAction } from "../../actions/assignment/assignmentActions";

interface AssignmentState {
  assignments: AssignmentsType[] | null;
  activeTab: "library" | "favorites" | "my-list";
  status: "init" | "success" | "loading" | "error";
  message: string | undefined;
}

const initialState: AssignmentState = {
  assignments: null,
  activeTab: "library",
  status: "init",
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
          state.status = "success";
        }
      )
      .addCase(changeAssignmentFavoriteByIdAction.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changeAssignmentFavoriteByIdAction.rejected, (state, action) => {
        state.status = "error";
      });
  },
});

export const { setAssignments, changeTabActions } = assignmentSlice.actions;

export default assignmentSlice.reducer;
