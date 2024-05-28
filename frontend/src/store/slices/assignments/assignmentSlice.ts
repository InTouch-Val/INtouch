import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { AssignmentsType } from "../../entities/assignments/types";
import {
  changeAssignmentFavoriteByIdAction,
  draftAssignmentAction,
  duplicateAssignmentAction,
} from "../../actions/assignment/assignmentActions";
import {
  AssignmentTab,
  Status,
  TypeFilter,
  TypeLanguage,
  TypeOrder,
} from "../../../utils/constants";

export type IStatusState =
  | Status.Init
  | Status.Success
  | Status.Loading
  | Status.Error;

interface AssignmentState {
  assignments: AssignmentsType[] | null;
  assignmentsFavorites: AssignmentsType[] | null;
  duplicateAssignment: AssignmentsType | null;
  activeTab:
    | AssignmentTab.library
    | AssignmentTab.favorites
    | AssignmentTab.myList;
  status: IStatusState;
  message: string | undefined;
  activeLanguage:
    | TypeLanguage.All
    | TypeLanguage.En
    | TypeLanguage.Es
    | TypeLanguage.Fr
    | TypeLanguage.De
    | TypeLanguage.It;
  activeFilterType:
    | TypeFilter.All
    | TypeFilter.Lesson
    | TypeFilter.Exercise
    | TypeFilter.Metaphor
    | TypeFilter.Study
    | TypeFilter.Quiz
    | TypeFilter.Methodology
    | TypeFilter.Metaphors;

  activeOrder:
    | TypeOrder.AddDate
    | TypeOrder.DecDate
    | TypeOrder.Popularity
    | TypeOrder.NoPopularity;
  page: number;
  searchTerm: string | undefined;
  isSuccess: boolean;
}

const initialState: AssignmentState = {
  assignments: null,
  duplicateAssignment: null,
  assignmentsFavorites: null,
  activeLanguage: TypeLanguage.All,
  activeTab: AssignmentTab.library,
  activeFilterType: TypeFilter.All,
  activeOrder: TypeOrder.AddDate,
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
      })
      .addCase(duplicateAssignmentAction.fulfilled, (state, action) => {
        state.duplicateAssignment = action.payload;
        state.status = Status.Success;
      })
      .addCase(duplicateAssignmentAction.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(duplicateAssignmentAction.rejected, (state, action) => {
        state.status = Status.Error;
      })
      .addCase(draftAssignmentAction.fulfilled, (state, action) => {
        state.status = Status.Success;
      })
      .addCase(draftAssignmentAction.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(draftAssignmentAction.rejected, (state, action) => {
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
  changeStatusAction,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
