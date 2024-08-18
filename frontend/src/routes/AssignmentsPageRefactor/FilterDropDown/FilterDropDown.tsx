import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  changeLanguageActions,
  changeFilterTypeActions,
  changeSortActions,
} from "../../../store/slices";
import { TypeFilter, TypeLanguage, TypeOrder } from "../../../utils/constants";

export default function FilterDropDown() {
  const dispatch = useAppDispatch();

  const { activeLanguage, activeFilterType, activeOrder } = useAppSelector(
    (state) => state.assignment,
  );

  const [sortMethod, setSortMethod] = React.useState(activeOrder);

  const handleSortMethodChange = (e): void => {
    setSortMethod(e.target.value);

    switch (e.target.value) {
      case TypeOrder.AddDate: {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case TypeOrder.DecDate: {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case TypeOrder.Popularity: {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case TypeOrder.NoPopularity: {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case TypeOrder.AverageGrade: {
        dispatch(changeSortActions(e.target.value));
        break;
      }
      case TypeOrder.NoAverageGrade: {
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
        <option value={TypeFilter.All}>All Types</option>
        <option value={TypeFilter.Lesson}>Lesson</option>
        <option value={TypeFilter.Exercise}>Exercise</option>
        <option value={TypeFilter.Essay}>Essay</option>
        <option value={TypeFilter.Study}>Study</option>
        <option value={TypeFilter.Quiz}>Quiz</option>
        <option value={TypeFilter.Methodology}>Methodology</option>
        <option value={TypeFilter.Metaphor}>Metaphors</option>
      </select>

      <select
        value={activeLanguage}
        onChange={(e) => dispatch(changeLanguageActions(e.target.value))}
      >
        <option value={TypeLanguage.All}>All Languages</option>
        <option value={TypeLanguage.En}>English</option>
        <option value={TypeLanguage.Es}>Spanish</option>
        <option value={TypeLanguage.Fr}>French</option>
        <option value={TypeLanguage.De}>German</option>
        <option value={TypeLanguage.It}>Italian</option>
      </select>
      <select value={sortMethod} onChange={(e) => handleSortMethodChange(e)}>
        <option value={TypeOrder.AddDate}>Oldest First</option>
        <option value={TypeOrder.DecDate}>Newest First</option>
        <option value={TypeOrder.NoPopularity}>Most Shared</option>
        <option value={TypeOrder.NoAverageGrade}>Top Client Rated</option>
      </select>
    </div>
  );
}
