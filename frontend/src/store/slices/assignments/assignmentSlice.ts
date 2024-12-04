import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import {
  AssignmentsResponseType,
  AssignmentsType,
} from "../../entities/assignments/types";
import {
  changeAssignmentFavoriteByIdAction,
  draftAssignmentAction,
  duplicateAssignmentAction,
  setClientByIdAction,
} from "../../actions/assignment/assignmentActions";
import {
  AssignmentTab,
  Status,
  TypeFilter,
  TypeIssue,
  TypeLanguage,
  TypeOrder,
} from "../../../utils/constants";

export type IStatusState = Status;

interface AssignmentState {
  assignments: AssignmentsType[] | null;
  assignmentsFavorites: AssignmentsType[] | null;
  duplicateAssignment: AssignmentsType | null;
  activeTab: AssignmentTab;

  status: IStatusState;
  message: string | undefined;
  activeLanguage: TypeLanguage;

  activeFilterType: TypeFilter;
  activeIssue: TypeIssue;
  activeOrder: TypeOrder;

  page: number;
  searchTerm: string | undefined;
  isSuccess: boolean;
  setClientId: AssignmentsResponseType | null | any;
}

export const initialStateAssignment: AssignmentState = {
  assignments: null,
  duplicateAssignment: null,
  assignmentsFavorites: null,
  setClientId: null,
  activeLanguage: TypeLanguage.All,
  activeTab: AssignmentTab.library,
  activeFilterType: TypeFilter.All,
  activeOrder: TypeOrder.DecDate,
  activeIssue: TypeIssue.all,
  status: Status.Init,
  message: "default",
  page: 1,
  searchTerm: undefined,
  isSuccess: false,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: initialStateAssignment,
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
      state.page = 1;
    },
    changeFilterTypeActions: (state, action) => {
      state.activeFilterType = action.payload;
      state.isSuccess = false;
      state.page = 1;
    },
    changeIssueActions: (state, action) => {
      state.activeIssue = action.payload;
      state.isSuccess = false;
      state.page = 1;
    },
    changeSortActions: (state, action) => {
      state.activeOrder = action.payload;
      state.isSuccess = false;
      state.page = 1;
    },

    setAssignmentsFavorites: (state, action) => {
      state.assignmentsFavorites = action.payload;
      state.isSuccess = false;
      state.page = 1;
    },
    changePageAction: (state, action) => {
      state.page = action.payload;
      state.isSuccess = false;
    },
    changeSearchAction: (state, action) => {
      state.searchTerm = action.payload;
      state.isSuccess = false;
      state.page = 1;
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
        },
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
      })
      .addCase(setClientByIdAction.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.setClientId = action.payload;
      })
      .addCase(setClientByIdAction.pending, (state, action) => {
        state.status = Status.Loading;
      })
      .addCase(setClientByIdAction.rejected, (state, action) => {
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
  changeIssueActions,
} = assignmentSlice.actions;

export const assignmentReducer = assignmentSlice.reducer;
export default assignmentSlice.reducer;
