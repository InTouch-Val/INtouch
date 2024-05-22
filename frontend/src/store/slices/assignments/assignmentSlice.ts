import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { AssignmentsType } from "../../entities/assignments/types";
import { changeAssignmentFavoriteByIdAction } from "../../actions/assignment/assignmentActions";
import { Status } from "../../../utils/constants";

export type IStatusState = "init" | "success" | "loading" | "error";

interface AssignmentState {
  assignments: AssignmentsType[] | null;
  assignmentsFavorites: AssignmentsType[] | null;
  activeTab: "library" | "favorites" | "my-list";
  status: IStatusState;
  message: string | undefined;
  activeLanguage: "all" | "en" | "es" | "fr" | "de" | "it";
  activeFilterType:
    | "all"
    | "lesson"
    | "exercise"
    | "metaphor"
    | "study"
    | "quiz"
    | "methodology "
    | "metaphors";

  activeOrder: "add_date" | "-add_date" | "average_grade" | "-average_grade";
  page: number;
  searchTerm: string | undefined;
  isSuccess: boolean
}

const initialState: AssignmentState = {
  assignments: null,
  assignmentsFavorites: null,
  activeLanguage: "all",
  activeTab: "library",
  activeFilterType: "all",
  activeOrder: "add_date",
  status: Status.Init,
  message: "default",
  page: 1,
  searchTerm: undefined,
  isSuccess: false,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
      state.isSuccess = false;
    },
    changeTabActions: (state, action) => {
      state.activeTab = action.payload;
      state.isSuccess = false;
      state.page = 1;
    },
    changeLanguageActions: (state, action) => {
      state.activeLanguage = action.payload;
      state.isSuccess = false;
    },
    changeFilterTypeActions: (state, action) => {
      state.activeFilterType = action.payload;
      state.isSuccess = false;
    },
    changeSortActions: (state, action) => {
      state.activeOrder = action.payload;
      state.isSuccess = false;
    },

    setAssignmentsFavorites: (state, action) => {
      state.assignmentsFavorites = action.payload;
      state.isSuccess = false;
    },
    changePageAction: (state, action) => {
      state.page = action.payload;
      state.isSuccess = false;
    },
    changeSearchAction: (state, action) => {
      state.searchTerm = action.payload;
      state.isSuccess = false;
    },
    changeStatusAction: (state, action) => {
      state.isSuccess = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AssignmentState>) => {
    builder
      .addCase(
        changeAssignmentFavoriteByIdAction.fulfilled,
        (state, action) => {
          state.status = Status.Success;
        }
      )
      .addCase(changeAssignmentFavoriteByIdAction.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(changeAssignmentFavoriteByIdAction.rejected, (state, action) => {
        state.status = Status.Error;
      });
  },
});

export const {
  setAssignments,
  changeTabActions,
  changeLanguageActions,
  changeFilterTypeActions,
  changeSortActions,
  setAssignmentsFavorites,
  changePageAction,
  changeSearchAction,
  changeStatusAction
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
