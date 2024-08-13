import React from "react";
import { useAuth } from "../../../service/authContext";
import { AssignmentsType } from "../../../store/entities/assignments/types";
import { AssignmentTile } from "../../../components/psy/AssignmentTile/AssignmentTile";
import { useAppSelector } from "../../../store/store";
import {
  AssignmentTab,
  TypeFilter,
  TypeLanguage,
} from "../../../utils/constants";
import { useGetAssignmentsQuery } from "../../../store/entities";
import Skeleton from "../../../stories/skeletons/Skeleton";

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

  const { activeTab, activeLanguage, activeFilterType, activeOrder, page } =
    useAppSelector((state) => state.assignment);

  const { isLoading } = useGetAssignmentsQuery({
    limit: 15,
    page,
    author: activeTab === AssignmentTab.myList ? currentUser?.id : undefined,
    favorite: activeTab === AssignmentTab.favorites && true,
    language: activeLanguage !== TypeLanguage.All ? activeLanguage : undefined,
    assignmentType:
      activeFilterType !== TypeFilter.All ? activeFilterType : undefined,
    ordering: activeOrder,
  });

  return (
    <div className="assignment-grid onboarding-psy-step">
      {filteredAssignments && filteredAssignments.length > 0 ? (
        filteredAssignments.map((assignment, index) => (
          <React.Fragment key={assignment.id}>
            {isLoading ? (
              <Skeleton type="assignment" user="psy" variant="ps-all-tasks" />
            ) : (
              <AssignmentTile
                refetch={refetch}
                assignment={assignment}
                onFavoriteToggle={toggleFavorite}
                isFavorite={currentUser?.doctor.assignments.find(
                  (item) => item === assignment.id,
                )}
                isAuthor={assignment.author === currentUser?.id}
                onDeleteClick={handleDeleteClick}
                onShareClick={handleShareButton}
                isShareModal={isShareModal}
                selectedAssignmentIdForShareModalOnClientPage={
                  selectedAssignmentIdForShareModalOnClientPage
                }
                className={index === 0 ? "first-assignment" : ""} 
          />
            )}
          </React.Fragment>
        ))
      ) : isLoading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton type="assignment" user="psy" variant="ps-all-tasks" />
        ))
      ) : (
        <div className="nothing-to-show">There is nothing to show yet</div>
      )}
    </div>
  );
}
