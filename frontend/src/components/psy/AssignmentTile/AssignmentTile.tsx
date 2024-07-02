import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/assignment-tile.css";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  draftAssignmentAction,
  duplicateAssignmentAction,
} from "../../../store/actions/assignment/assignmentActions";
import { AssignmentTab, BlockType, TypeFilter, TypeLanguage } from "../../../utils/constants";
import { AssignmentsType } from "../../../store/entities/assignments/types";
import { useCreateAssignmentMutation, useGetAssignmentsQuery } from "../../../store/entities";
import { formatDate } from "../../../utils/helperFunction/formatDate";
import DropDownButton from "./DropDownButton/DropDownButton";
import { separatedBlock } from "./helperFunction";
import { useAuth } from "../../../service/authContext";

interface Props {
  assignment: AssignmentsType;
  onFavoriteToggle: (id: number | string) => void;
  isFavorite: boolean;
  onShareClick: (id: number) => void;
  isAuthor: boolean;
  onDeleteClick: (id: number) => void;
  isShareModal: boolean;
  selectedAssignmentIdForShareModalOnClientPage: string | number;
  refetch: () => void;
}

function AssignmentTile({
  refetch,
  assignment,
  onFavoriteToggle,
  isFavorite,
  onShareClick,
  isAuthor,
  onDeleteClick,
  isShareModal,
  selectedAssignmentIdForShareModalOnClientPage,
}: Props) {
  const [isSelected, setIsSelected] = useState(
    assignment.id === selectedAssignmentIdForShareModalOnClientPage,
  );



  const dispatch = useAppDispatch();
  const [assignmentId, setAssignments] = useState<AssignmentsType[] | []>([]);
  const [createAssignment, _] = useCreateAssignmentMutation();

  useEffect(() => {
    setIsSelected(
      assignment.id === selectedAssignmentIdForShareModalOnClientPage,
    );
  }, [selectedAssignmentIdForShareModalOnClientPage]);

  const displayDate = formatDate(assignment.update_date);
  const navigate = useNavigate();

  function handleOnTileClick(assignmentId: number): void {
    if (isShareModal) {
      onShareClick(assignmentId);
    } else {
      assignment.is_public
        ? navigate(`/assignment/${assignmentId}`)
        : navigate(`/edit-assignment/${assignmentId}`);
    }
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (
        isDropdownOpen &&
        target.closest(".assignment__dropdown-btn") === null
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", (e) => handleClickOutside(e));

    return () => {
      document.removeEventListener("mousedown", (e) => handleClickOutside(e));
    };
  }, [isDropdownOpen]);

  const duplicateAssignmentHandle = async (
    assignmentId: number,
  ): Promise<void> => {
    try {
      const { payload } = await dispatch(
        duplicateAssignmentAction(assignmentId),
      );

      let assignmentData = await payload;
      if (assignmentData) {
        // Подготавливаем данные для дубликата, используя ту же структуру, что и в handleSubmit

        const blockInfo = separatedBlock(assignmentData);

        const duplicateData = {
          blocks: blockInfo,
          title: `${assignmentData.title} + COPY`,
          text: assignmentData.text,
          assignment_type: assignmentData.assignment_type,
          tags: assignmentData.tags,
          language: assignmentData.language,
          image_url:
            assignmentData.image_url ||
            "https://images.unsplash.com/photo-1641531316051-30d6824c6460?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE0ODh8MHwxfHNlYXJjaHwxfHxsZW9uaWR8ZW58MHx8fHwxNzAwODE4Nzc5fDA&ixlib=rb-4.0.3&q=85",
        };

        // Отправляем данные задания на сервер для создания дубликата
        const duplicateResponse = await createAssignment(duplicateData);

        if (
          !duplicateResponse ||
          !duplicateResponse.data ||
          !duplicateResponse.data.id
        ) {
          throw new Error("Failed to create assignment");
        }
        // Получаем ID созданного задания
        const responseAssignmentId = await duplicateResponse.data.id;

        // Если задание должно быть сохранено как черновик, выполняем GET запрос
        await dispatch(draftAssignmentAction(responseAssignmentId));
        duplicateResponse.data.is_public = false;
        debugger;

        // Если все прошло успешно, добавляем дубликат в список заданий
        if (duplicateResponse.data) {
          setAssignments((prevAssignments) => [
            ...prevAssignments,
            duplicateResponse.data,
          ]);
        }
      }
    } catch (error) {
      console.error("Error duplicating assignment:", error);
    }
    await refetch();
  };

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

  function handleShareClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.stopPropagation();
    onShareClick(assignment.id);
  }

  function handleGoNavigateEdit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.stopPropagation();
    navigate(`/edit-assignment/${assignment.id}`);
  }

  return (
    <div
      className={`assignment-tile ${isSelected && "assignment-tile_selected"}`}
      onClick={() => handleOnTileClick(assignment.id)}
    >
      <div className="assignment-image-container">
        <div className="date-and-type">
          <span>{displayDate}</span>
          {assignment.assignment_type && (
            <span className="type">{assignment.assignment_type}</span>
          )}
          {assignment.is_public === false ? null : (
            <>
              {isAuthor ? (
                <DropDownButton
                  onDeleteClick={onDeleteClick}
                  isFavorite={isFavorite}
                  assignment={assignment}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                  onFavoriteToggle={onFavoriteToggle}
                  duplicateAssignmentHandle={duplicateAssignmentHandle}
                />
              ) : (
                <button
                  className={
                    isFavorite
                      ? "favorite-button favorite-button_selected"
                      : "favorite-button"
                  }
                  onClick={(event) => handleFavoriteClick(event)}
                ></button>
              )}
            </>
          )}
        </div>
        <img alt="Loading..." src={assignment.image_url} />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
        <p>{assignment.author_name}</p>
        <div className="assignment-actions">
          {assignment.is_public === false ? (
            <>
              <button
                className="assignment__edit-btn"
                onClick={(event) => handleGoNavigateEdit(event)}
              ></button>
              <button
                className="assignment__delete-btn"
                onClick={(event) => handleDeleteClick(event)}
              ></button>
            </>
          ) : (
            <>
              <span
                title="Client`s rating"
                className="assignment-actions__statistics assignment-actions__statistics_grades"
              >
                {assignment.average_grade}
              </span>
              <span
                title="Assignments count"
                className="assignment-actions__statistics assignment-actions__statistics_shares"
              >
                {assignment.share}
              </span>
              {isShareModal === false && (
                <button
                  className="assignment-actions__share-with-client"
                  onClick={(event) => handleShareClick(event)}
                ></button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { AssignmentTile };
