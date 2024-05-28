//@ts-nocheck
import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../service/axios";
import { Modal } from "../../service/modal";
import "../../css/assignment-tile.css";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { duplicateAssignmentAction, useDeleteAssignmentClientByUUIDMutation } from "../../store/actions/assignment/assignmentActions";
import { BlockType } from "../../utils/constants";
import { AssignmentsType } from "../../store/entities/assignments/types";

const formatDate = (dateString: Date): Date => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const getObjectFromEditorState = (editorState: string) => JSON.stringify(editorState);

interface Props {
  assignment: AssignmentsType,
  onFavoriteToggle: (id: number | string) => void;
  isFavorite: boolean,
  onShareClick: (id: string) => void,
  isAuthor: boolean,
  onDeleteClick: (id: string) => void,
  isShareModal: boolean,
  selectedAssignmentIdForShareModalOnClientPage: string
}

function AssignmentTile({
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
    assignment.id === selectedAssignmentIdForShareModalOnClientPage
  );

  const dispatch = useAppDispatch();
  const { duplicateAssignment } = useAppSelector((store) => store.assignment);

  const [assignmentId, setAssignments] = useState<any>([]);

  useEffect(() => {
    setIsSelected(
      assignment.id === selectedAssignmentIdForShareModalOnClientPage
    );
  }, [selectedAssignmentIdForShareModalOnClientPage]);

  const displayDate = formatDate(assignment.update_date);
  const navigate = useNavigate();

  const handleOnTileClick = (assignmentId) => () => {
    if (isShareModal) {
      onShareClick(assignmentId);
    } else {
      assignment.is_public
        ? navigate(`/assignment/${assignmentId}`)
        : navigate(`/edit-assignment/${assignmentId}`);
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        event.target.closest(".assignment__dropdown-btn") === null
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const duplicateAssignmentHandle = async (assignmentId: string): void => {
    try {
      dispatch(duplicateAssignmentAction(assignmentId));
      let assignmentData = duplicateAssignment;

      // Подготавливаем данные для дубликата, используя ту же структуру, что и в handleSubmit
      const blockInfo = assignmentData.blocks.map((block) => {
        if (block.type === BlockType.Text) {
          return {
            type: block.type,
            question: block.question,
            description: getObjectFromEditorState(block.content),
            choice_replies: [],
          };
        }
        if (block.type === BlockType.Range) {
          return {
            type: block.type,
            question: block.question,
            start_range: block.minValue,
            end_range: block.maxValue,
            left_pole: block.leftPole || "Left Pole",
            right_pole: block.rightPole || "Right Pole",
          };
        }
        if (block.type === BlockType.Image) {
          return {
            type: block.type,
            question: block.question,
            image: block.image,
          };
        }
        if (block.type === BlockType.Open) {
          return {
            type: block.type,
            question: block.question,
          };
        }
        return {
          type: block.type,
          question: block.question,
          choice_replies: block.choice_replies,
        };
      });

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
      const duplicateResponse = await API.post(`assignments/`, duplicateData);
      if (
        !duplicateResponse ||
        !duplicateResponse.data ||
        !duplicateResponse.data.id
      ) {
        throw new Error("Failed to create assignment");
      }
      // Получаем ID созданного задания
      const responseAssignmentId = duplicateResponse.data.id;

      // Если задание должно быть сохранено как черновик, выполняем GET запрос
      await dispatch(draftAssignmentAction(responseAssignmentId));
      duplicateResponse.data.is_public = false;

      // Если все прошло успешно, добавляем дубликат в список заданий
      if (duplicateResponse.status === 201) {
        setAssignments((prevAssignments) => [
          ...prevAssignments,
          duplicateResponse.data,
        ]);
      }
    } catch (error) {
      console.error("Error duplicating assignment:", error);
    }
  };

  return (
    <div
      className={`assignment-tile ${isSelected && "assignment-tile_selected"}`}
      onClick={handleOnTileClick(assignment.id)}
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
                          duplicateAssignmentHandle(assignment.id);
                        }}
                      >
                        Duplicate
                      </button>
                      <hr className="dropdown-separate-line" />
                      <button
                        className="assignment__dropdown-delete-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteClick(assignment.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </button>
              ) : (
                <button
                  className={
                    isFavorite
                      ? "favorite-button favorite-button_selected"
                      : "favorite-button"
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    onFavoriteToggle(assignment.id);
                  }}
                ></button>
              )}
            </>
          )}
        </div>
        <img loading="lazy" alt="Loading..." src={assignment.image_url} />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
        <p>{assignment.author_name}</p>
        <div className="assignment-actions">
          {assignment.is_public === false ? (
            <>
              <button
                className="assignment__edit-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/edit-assignment/${assignment.id}`);
                }}
              ></button>
              <button
                className="assignment__delete-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteClick(assignment.id);
                }}
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
                  onClick={(event) => {
                    event.stopPropagation();
                    onShareClick(assignment.id);
                  }}
                ></button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface PropsClient {
  assignment: AssignmentsType,
  onDeleteSuccess: (id: string) => void,
  openAssignment: (card: AssignmentsType) => void,
  clientId: string
}

function ClientAssignmentTile({
  assignment,
  onDeleteSuccess,
  openAssignment,
  clientId,
}: PropsClient) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ifError, setIfError] = useState(false);
  const [errorText, setErrorText] = useState("Can`t Recall");
  const [statusOneWord, setStatusOneWord] = useState("to-do");
  const navigate = useNavigate();

  const [deleteClientAssignment, _] = useDeleteAssignmentClientByUUIDMutation()

  useEffect(() => {
    if (assignment.status === "to do") {
      setStatusOneWord("to-do");
    } else if (assignment.status === "in progress") {
      setStatusOneWord("in-progress");
    } else if (assignment.status === "done") {
      setStatusOneWord("done");
    }
  }, [assignment]);

  function onCardClick() {
    navigate(`/clients/${clientId}/assignments/${assignment?.id}`);
    openAssignment(assignment);
  }

  function onRecallClick() {
    handleToggleModal();
  }

  const deleteClientsAssignment = async () => {
    try {
      deleteClientAssignment(assignment.id)
      handleToggleModal();
      onDeleteSuccess(assignment.id);
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleToggleModal = () => setShowModal(!showModal);

  return (
    <div
      className="assignment-tile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="assignment-image-container assignment-image-container_client">
        <div className="date-and-type">
          <span>Sent: {formatDate(assignment.add_date)}</span>
          <span className={`status ${statusOneWord}`}>{assignment.status}</span>
        </div>
        <img alt="Loading..." src={assignment.image_url} />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
        <p>UPD: {assignment.update_date}</p>
      </div>
      <div className="assignment-actions">
        {assignment.status !== "to do" ? (
          <>
            <button
              className="assignment__review-btn"
              title="view task rate"
              onClick={(event) => {
                event.stopPropagation();
                onCardClick();
              }}
              disabled={assignment.review === "" || undefined || null}
            ></button>
            <button
              className="assignment__view-btn"
              title="view done assignment"
              onClick={(event) => {
                event.stopPropagation();
                onCardClick();
              }}
            ></button>
          </>
        ) : (
          <>
            <button
              className="assignment-actions__share-with-client assignment-actions__share-with-client_recall"
              title="recall assignment"
              onClick={(event) => {
                event.stopPropagation();
                onRecallClick();
              }}
            ></button>
          </>
        )}
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleToggleModal}
        onConfirm={deleteClientsAssignment}
        confirmText="Yes, Recall"
        showCancel={true}
        ifError={ifError}
        errorText={errorText}
      >
        <p>Are you sure you want to recall this assignment from client?</p>
      </Modal>
    </div>
  );
}

export { AssignmentTile, ClientAssignmentTile };
