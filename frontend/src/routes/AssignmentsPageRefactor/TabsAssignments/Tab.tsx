import React from "react";
import { useAuth } from "../../../service/authContext";
import { AssignmentsType } from "../../../store/entities/assignments/types";
import { AssignmentTile } from "../../../components/psy/AssignmentTile/AssignmentTile";

export interface PropsTabAssignments {
  filteredAssignments: AssignmentsType[];
  isShareModal: boolean;
  selectedAssignmentIdForShareModalOnClientPage: string;
  toggleFavorite: (id: number | string) => void;
  handleDeleteClick: (id: number | string) => void;
  handleShareButton: (id: number | string) => void;
  refetch: () => void;
}

export default function TabsAssignments({
  refetch,
  filteredAssignments,
  isShareModal = false,
  selectedAssignmentIdForShareModalOnClientPage = "",
  toggleFavorite,
  handleDeleteClick,
  handleShareButton,
}: PropsTabAssignments) {
  //@ts-ignore
  const { currentUser } = useAuth();

  return (
    <div className="assignment-grid">
      {filteredAssignments && filteredAssignments.length > 0 ? (
        filteredAssignments.map((assignment) => (
          <AssignmentTile
            refetch={refetch}
            key={assignment.id}
            assignment={assignment}
            onFavoriteToggle={toggleFavorite}
            isFavorite={currentUser.doctor.assignments.find(
              (item) => item == assignment.id,
            )}
            isAuthor={assignment.author === currentUser.id}
            onDeleteClick={handleDeleteClick}
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
