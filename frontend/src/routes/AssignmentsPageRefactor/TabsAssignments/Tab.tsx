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
import ModalAssignments from "../ModalsAssignments/ModalAssignments";

export interface PropsTabAssignments {
  filteredAssignments: AssignmentsType[];
  isShareModal: boolean;
  selectedAssignmentIdForShareModalOnClientPage: string;
  toggleFavorite: (id: number | string) => void;
  handleDeleteClick: (id: number | string, refetch?: () => void) => void;
  handleShareButton: (id: number | string) => void;
  refetch: () => void;
  setIsShareModalOpen: any
  isShareModalOpen: any
  setIsDeleteModalOpen: any
  isDeleteModalOpen: any
  setSelectedAssignmentId: any
  selectedAssignmentId: any
  deleteAssignmentsById: (id: number | string) => void
}

export default function TabsAssignments({
  refetch,
  filteredAssignments,
  isShareModal = false,
  selectedAssignmentIdForShareModalOnClientPage = "",
  toggleFavorite,
  handleDeleteClick,
  handleShareButton,
  setIsShareModalOpen,
  isShareModalOpen,
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  setSelectedAssignmentId,
  selectedAssignmentId,
  deleteAssignmentsById
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

  return (
    <section className={styles.assignments_library_contatiner}>
      {filteredAssignments.length === 0 && !isLoading ? (
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
            : filteredAssignments.map((assignment, index) => (
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
      <ModalAssignments
              deleteAssignmentsById={deleteAssignmentsById}
            refetch={refetch}
        setIsShareModalOpen={setIsShareModalOpen}
        isShareModalOpen={isShareModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        setSelectedAssignmentId={setSelectedAssignmentId}
        selectedAssignmentId={selectedAssignmentId}
      />
    </section>
  );
}
