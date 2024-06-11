import React, { SetStateAction } from "react";
import { AssignmentsType } from "../../../../store/entities/assignments/types";

interface Props {
  assignment: AssignmentsType;
  duplicateAssignmentHandle: (id: number) => Promise<void>;
  onDeleteClick: (id: number) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<SetStateAction<boolean>>;
  isFavorite: boolean;
  onFavoriteToggle: (id: number) => void;
}

export default function DropDownButton({
  assignment,
  duplicateAssignmentHandle,
  onDeleteClick,
  isDropdownOpen,
  setIsDropdownOpen,
  isFavorite,
  onFavoriteToggle,
}: Props): JSX.Element {
  function handleFavoriteClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.stopPropagation();
    onFavoriteToggle(assignment.id);
  }

  function handleDeleteClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.stopPropagation();
    onDeleteClick(assignment.id);
  }

  function handleDuplicateClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.stopPropagation();
    duplicateAssignmentHandle(assignment.id);
  }

  return (
    <>
      <button
        className="assignment__dropdown-btn"
        onClick={(event) => {
          event.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        {isDropdownOpen ? (
          <div className="assignment__dropdown">
            <button
              className={
                isFavorite
                  ? "favorite-button favorite-button_dropdown_selected favorite-button_dropdown"
                  : "favorite-button favorite-button_dropdown"
              }
              onClick={(event) => handleFavoriteClick(event)}
            >
              Favorite
            </button>
            <hr className="dropdown-separate-line" />
            <button
              className="assignment__dropdown-copy-btn"
              onClick={(event) => handleDuplicateClick(event)}
            >
              Duplicate
            </button>
            <hr className="dropdown-separate-line" />
            <button
              className="assignment__dropdown-delete-btn"
              onClick={(event) => handleDeleteClick(event)}
            >
              Delete
            </button>
          </div>
        ) : null}
      </button>
    </>
  );
}
