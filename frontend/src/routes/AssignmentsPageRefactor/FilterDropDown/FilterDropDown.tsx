import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  changeLanguageActions,
  changeFilterTypeActions,
  changeSortActions
} from "../../../store/slices";

export default function FilterDropDown() {
  const dispatch = useAppDispatch();

  const { activeLanguage, activeFilterType } = useAppSelector(
    (state) => state.assignment
  );

  const [sortMethod, setSortMethod] = React.useState("add_date");

  const handleSortMethodChange = (e) => {
    setSortMethod(e.target.value);

    switch (e.target.value) {
      case "add_date": {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case "-add_date": {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case "average_grade": {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case "-average_grade": {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <div className="filter-dropdowns">
      <select
        value={activeFilterType}
        onChange={(e) => dispatch(changeFilterTypeActions(e.target.value))}
      >
        <option value="all">All Types</option>
        <option value="lesson">Lesson</option>
        <option value="exercise">Exercise</option>
        <option value="metaphor">Essay</option>
        <option value="study">Study</option>
        <option value="quiz">Quiz</option>
        <option value="methodology">Methodology</option>
        <option value="metaphors">Metaphors</option>
      </select>

      <select
        value={activeLanguage}
        onChange={(e) => dispatch(changeLanguageActions(e.target.value))}
      >
        <option value="all">All Languages</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
      </select>
      <select value={sortMethod} onChange={(e) => handleSortMethodChange(e)}>
        <option value="add_date">Date Created ↑</option>
        <option value="-add_date">Date Created ↓</option>
        <option value="average_grade">Popularity ↑</option>
        <option value="-average_grade">Popularity ↓</option>
      </select>
    </div>
  );
}
