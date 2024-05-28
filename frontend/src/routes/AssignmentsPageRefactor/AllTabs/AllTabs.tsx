import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { changeTabActions } from "../../../store/slices/assignments/assignmentSlice";
import { AssignmentTab } from "../../../utils/constants";
import { duplicateAssignmentAction } from "../../../store/actions/assignment/assignmentActions";

export default function AllTabs(): JSX.Element {
  const dispatch = useAppDispatch();

  const { activeTab } = useAppSelector((state) => state.assignment);


  return (
    <div className="tabs">

      <button
        className={activeTab === AssignmentTab.library ? "active" : ""}
        onClick={() => dispatch(changeTabActions(AssignmentTab.library))}
      >
        Library
      </button>
      <button
        className={activeTab === AssignmentTab.favorites ? "active" : ""}
        onClick={() => dispatch(changeTabActions(AssignmentTab.favorites))}
      >
        Favorites
      </button>
      <button
        className={activeTab === AssignmentTab.myList ? "active" : ""}
        onClick={() => dispatch(changeTabActions(AssignmentTab.myList))}
      >
        My Tasks
      </button>
    </div>
  );
}
