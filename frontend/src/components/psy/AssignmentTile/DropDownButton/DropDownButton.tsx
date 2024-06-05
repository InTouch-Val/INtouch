import React from "react";

export default function DropDownButton({
  assignment,
  duplicateAssignmentHandle,
  onDeleteClick,
  isDropdownOpen,
  setIsDropdownOpen,
  isFavorite,
  onFavoriteToggle,
}) {
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
              onClick={(event) => {
                event.stopPropagation();
                onFavoriteToggle(assignment.id);
              }}
            >
              Favorite
            </button>
            <hr className="dropdown-separate-line" />
            <button
              className="assignment__dropdown-copy-btn"
              onClick={(event) => {
                event.stopPropagation();
                duplicateAssignmentHandle(`${assignment.id}`);
              }}
            >
              Duplicate
            </button>
            <hr className="dropdown-separate-line" />
            <button
              className="assignment__dropdown-delete-btn"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteClick(`${assignment.id}`);
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </button>
    </>
  );
}
