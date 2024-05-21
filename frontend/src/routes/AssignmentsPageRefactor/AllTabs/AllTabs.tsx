import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { changeTabActions } from "../../../store/slices/assignments/assignmentSlice";

export default function AllTabs() {
  const dispatch = useAppDispatch();

  const { activeTab } = useAppSelector((state) => state.assignment);
  return (
    <div className="tabs">
      <button
        className={activeTab === "library" ? "active" : ""}
        onClick={() => dispatch(changeTabActions("library"))}
      >
        Library
      </button>
      <button
        className={activeTab === "favorites" ? "active" : ""}
        onClick={() => dispatch(changeTabActions("favorites"))}
      >
        Favorites
      </button>
      <button
        className={activeTab === "my-list" ? "active" : ""}
        onClick={() => dispatch(changeTabActions("my-list"))}
      >
        My Tasks
      </button>
    </div>
  );
}
