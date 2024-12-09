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
import EmptyContentNotice from "../../../stories/empty-content-notice/EmptyContentNotice";
import styles from "./style.module.css";
import EmptyContentNoticeTexts from "../../../utils/notification-texts.json";

export interface PropsTabAssignments {
  filteredAssignments?: AssignmentsType[];
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

  const {
    activeTab,
    activeLanguage,
    activeFilterType,
    activeOrder,
    page,
    assignments,
  } = useAppSelector((state) => state.assignment);

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

  const emptyFavoritesContent = (
    <>
      <span>{EmptyContentNoticeTexts.noContent.psyNoFavouriteAssignments}</span>
      <span>{EmptyContentNoticeTexts.noContent.psyHowToAddFavourite}</span>
    </>
  );

  const emptyMyTasksContent = (
    <>
      <span>{EmptyContentNoticeTexts.noContent.psyMyTasks}</span>

      <span
        dangerouslySetInnerHTML={{
          __html: EmptyContentNoticeTexts.noContent.psyHowToAddAssignment,
        }}
      />
    </>
  );

  const getNoAssignmentsMessage = () => {
    switch (activeTab) {
      case AssignmentTab.favorites:
        return emptyFavoritesContent;
      case AssignmentTab.myList:
        return emptyMyTasksContent;
      default:
        return EmptyContentNoticeTexts.noContent.defaultNoData;
    }
  };

  console.log(assignments)

  return (
    assignments && (
      <section className={styles.assignments_library_contatiner}>
        {assignments.length === 0 && !isLoading ? (
          <EmptyContentNotice label={getNoAssignmentsMessage()} />
        ) : (
          <div className="assignment-grid onboarding-psy-step">
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    type="assignment"
                    user="psy"
                    variant="ps-all-tasks"
                  />
                ))
              : assignments.map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    <AssignmentTile
                      refetch={refetch}
                      assignment={assignment}
                      onFavoriteToggle={toggleFavorite}
                      isFavorite={currentUser?.doctor.assignments.find(
                        (item) => item === assignment.id
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
                  </React.Fragment>
                ))}
          </div>
        )}
      </section>
    )
  );
}
