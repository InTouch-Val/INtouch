import React from "react";
import { AssignmentTile } from "../../../components/psy/AssignmentTile";
import { useAuth } from "../../../service/authContext";

import { API } from "../../../service/axios";

export default function TabLibrary({
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
  const [userFavorites, setUserFavorites] = React.useState<string[]>([]);

  return (
    <div className="assignment-grid">
      {filteredAssignments && filteredAssignments.length > 0 ? (
        filteredAssignments.map((assignment) => (
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
        ))
      ) : (
        <div className="nothing-to-show">There is nothing to show yet</div>
      )}
    </div>
  );
}
