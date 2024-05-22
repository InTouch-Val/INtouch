import React from "react";
import { AssignmentTile } from "../../../components/psy/AssignmentTile";
import { useAuth } from "../../../service/authContext";

export default function TabFavorites({
  filteredAssignments,
  isShareModal = false,
  selectedAssignmentIdForShareModalOnClientPage = "",
  toggleFavorite,
  handleDeleteClick,
  duplicateAssignment,
  handleShareButton,
}) {
  //@ts-ignore
  const { currentUser } = useAuth();
  return (
    <div className="assignment-grid">
      {filteredAssignments &&
        filteredAssignments.map((assignment) => {
          return (
            <AssignmentTile
              key={assignment.id}
              assignment={assignment}
              onFavoriteToggle={toggleFavorite}
              isFavorite={true}
              isAuthor={assignment.author === currentUser.id}
              onDeleteClick={handleDeleteClick}
              onCopyClick={duplicateAssignment}
              onShareClick={handleShareButton}
              isShareModal={isShareModal}
              selectedAssignmentIdForShareModalOnClientPage={
                selectedAssignmentIdForShareModalOnClientPage
              }
            />
          );
        })}
      : (<div className="nothing-to-show">There is nothing to show yet</div>)
    </div>
  );
}
