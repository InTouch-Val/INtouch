import React, { useState } from "react";
import { Modal } from "../../../service/modal";
import { useAuth } from "../../../service/authContext";
import { API } from "../../../service/axios";

export default function ModalAssignments() {
  //@ts-ignore
  const { currentUser } = useAuth();

  const [clients, setClients] = useState<any>(currentUser?.doctor?.clients);
  const [selectedClients, setSelectedClients] = useState<any>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [ifError, setIfError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsShareModalOpen(false);
    setIsSuccessModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedAssignmentId("");
    setSelectedClients([]);
    setIfError(false);
    setErrorText("");
  };

  const handleShareSubmit = async () => {
    try {
      const assignmentId = selectedAssignmentId;

      if (!assignmentId) {
        console.error("No assignment ID selected for sharing.");
        return;
      }

      if (selectedClients.length === 0) {
        console.error("No clients selected for sharing the assignment.");
        return;
      }

      const res = await Promise.all(
        selectedClients.map(async (clientId) => {
          const response = await API.get(
            `assignments/set-client/${assignmentId}/${clientId}/`,
          );
          return response;
        }),
      );

      const allResponsesSuccessful = res.every(
        (response) => response.status >= 200 && response.status <= 300,
      );

      if (allResponsesSuccessful) {
        setIfError(false);
        setErrorText("");
        handleModalClose();
        setIsShareModalOpen(false);
        setIsSuccessModalOpen(true);
        setSelectedClients([]); // Очищаем выбранные клиенты после успешной отправки
        setSelectedAssignmentId("");
        console.log("handleShareSubmit completed");
      }
    } catch (error) {
      console.error("Error assigning assignment to clients:", error);
      setSelectedClients([]);
      setSelectedAssignmentId("");
      setIfError(true);
      setErrorText("Task already assigned to the selected client.");
    }
  };

  const handleClientSelect = (clientId) => {
    setSelectedClients((prevSelectedClients) => {
      if (prevSelectedClients.includes(clientId)) {
        return prevSelectedClients.filter((id) => id !== clientId);
      }
      return [...prevSelectedClients, clientId];
    });
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      await API.delete(`assignments/${assignmentId}`);
      //   console.log(assignments);
      //   setAssignments(assignments.filter((assignment) => assignment.id !== assignmentId));
      setSelectedAssignmentId("");
      handleModalClose();
    } catch (error) {
      console.error("Error delete assignment:", error);
      setIfError(true);
      setErrorText(error);
    }
  };

  return (
    <>
      <Modal
        // showCancel={false}
        isOpen={isShareModalOpen}
        onClose={handleModalClose}
        onConfirm={handleShareSubmit}
        confirmText="Share"
        ifError={ifError}
        errorText={errorText}
      >
        <div className="share-assignment">
          <button
            className="share-assignment__close-button"
            onClick={handleModalClose}
          >
            x
          </button>
          <h3 className="share-assignment__title">Share assignment with...</h3>
          <div className="share-assignment__list-wrapper">
            {clients.map((client: any) => (
              <div key={client.id} className="share-assignment__item">
                <input
                  type="checkbox"
                  id={`client-${client.id}`}
                  className={`share-assignment__checkbox ${selectedClients.includes(client.id) ? "share-assignment__checkbox--checked" : ""}`}
                  checked={selectedClients.includes(client.id)}
                  onChange={() => handleClientSelect(client.id)}
                />
                <label
                  htmlFor={`client-${client.id}`}
                  className="share-assignment__checkbox-label"
                >{`${client.first_name} ${client.last_name}`}</label>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Modal
        // showCancel={false}
        isOpen={isSuccessModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
        confirmText="OK"
        ifError={ifError}
        errorText={errorText}
      >
        <h2>Assignment has been successfully sent!</h2>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onConfirm={() => deleteAssignment(selectedAssignmentId)}
        confirmText="Yes, delete"
        ifError={ifError}
        errorText={errorText}
      >
        <h2>Are you sure you want to delete this assignment?</h2>
      </Modal>
    </>
  );
}