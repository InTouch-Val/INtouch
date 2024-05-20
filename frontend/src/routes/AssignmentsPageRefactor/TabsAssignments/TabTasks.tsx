import React from "react";
import { AssignmentTile } from "../../../components/psy/AssignmentTile";
import { useAuth } from "../../../service/authContext";

export default function TabTasks({
  filteredAssignments,
  userFavorites,
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
        filteredAssignments
          .filter((assignment) => assignment.author === currentUser.id)
          .map((assignment) => (
            <AssignmentTile
              key={assignment.id}
              assignment={assignment}
              onFavoriteToggle={toggleFavorite}
              isFavorite={userFavorites?.includes(assignment.id)}
              isAuthor={assignment.author === currentUser.id}
              onDeleteClick={handleDeleteClick}
              onCopyClick={duplicateAssignment}
              onShareClick={handleShareButton}
              isShareModal={isShareModal}
              selectedAssignmentIdForShareModalOnClientPage={
                selectedAssignmentIdForShareModalOnClientPage
              }
            />
          ))}
    </div>
  );
}
