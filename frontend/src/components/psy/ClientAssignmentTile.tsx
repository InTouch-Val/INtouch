import React, { useEffect, useState } from "react";
import { Modal } from "../../service/modal";
import { formatDate } from "../../utils/helperFunction/formatDate";
import { useDeleteAssignmentClientByUUIDMutation } from "../../store/entities";
import { useNavigate } from "react-router-dom";
import { AssignmentsType } from "../../store/entities/assignments/types";

enum Status {
  ToDo = "to-do",
  Done = "done",
  inProgress = "in-progress",
}

enum StatusFromServer {
  ToDo = "to do",
  Done = "done",
  inProgress = "in progress",
}

interface PropsClient {
  assignment: AssignmentsType;
  onDeleteSuccess: (id: number) => void;
  openAssignment: (card: AssignmentsType) => void;
  clientId: string;
}

export default function ClientAssignmentTile({
  assignment,
  onDeleteSuccess,
  openAssignment,
  clientId,
}: PropsClient) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ifError, setIfError] = useState(false);
  const [statusOneWord, setStatusOneWord] = useState(Status.ToDo);
  const navigate = useNavigate();

  const [deleteClientAssignment, _] = useDeleteAssignmentClientByUUIDMutation();

  useEffect(() => {
    if (assignment.status === StatusFromServer.ToDo) {
      setStatusOneWord(Status.ToDo);
    } else if (assignment.status === StatusFromServer.inProgress) {
      setStatusOneWord(Status.inProgress);
    } else if (assignment.status === StatusFromServer.Done) {
      setStatusOneWord(Status.Done);
    }
  }, [assignment]);

  function onCardClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.stopPropagation();
    navigate(`/clients/${clientId}/assignments/${assignment?.id}`);
    openAssignment(assignment);
  }

  function onRecallClick(): void {
    handleToggleModal();
  }

  const deleteClientsAssignment = async (): Promise<void> => {
    try {
      deleteClientAssignment(assignment.id);
      handleToggleModal();
      onDeleteSuccess(assignment.id);
    } catch (e) {
      setIfError(true);
      console.error(e.message);
    }
  };

  const handleToggleModal = (): void => setShowModal(!showModal);

  function handleRecallClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.stopPropagation();
    onRecallClick();
  }

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
        {assignment.status !== StatusFromServer.ToDo ? (
          <>
            <button
              className="assignment__review-btn"
              title="view task rate"
              onClick={(event) => onCardClick(event)}
              disabled={assignment.review === "" || undefined}
            ></button>
            <button
              className="assignment__view-btn"
              title="view done assignment"
              onClick={(event) => onCardClick(event)}
            ></button>
          </>
        ) : (
          <>
            <button
              className="assignment-actions__share-with-client assignment-actions__share-with-client_recall"
              title="recall assignment"
              onClick={(event) => handleRecallClick(event)}
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
        errorText={"Can`t Recall"}
      >
        <p>Are you sure you want to recall this assignment from client?</p>
      </Modal>
    </div>
  );
}
