//@ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../service/authContext";
import { API } from "../../service/axios";
import { Notes } from "./Notes";
import { Modal } from "../../service/modal";
import shareImage from "../../images/shareArrow_white.svg";
import "../../css/clients.css";
import DiaryNotes from "./DiaryNotes/DiaryNotes";
import { useObserve } from "../../utils/hook/useObserve";
import ClientAssignmentTile from "./ClientAssignmentTile";
import Button from "../../stories/buttons/Button";
import shareIcon from "../../images/psy-icons/share-assignment-icon.svg";
import AssignmentsPageRefactor from "../../routes/AssignmentsPageRefactor/AssignmentsPage";
import useClientProfileOnboardingTour from "../../utils/hook/onboardingHooks/clientProfileOnboardingTour";
import EmptyContentNotice from "../../stories/empty-content-notice/EmptyContentNotice";
import EmptyContentNoticeTexts from "../../utils/notification-texts.json";

function ClientDetailsPage() {
  useClientProfileOnboardingTour();

  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUserData } = useAuth();
  const client = currentUser?.doctor.clients.find(
    (client) => client.id === Number(id),
  );
  const { setCurrentCard, card } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [clientAssignments, setClientAssignments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableClient, setEditableClient] = useState({ ...client.client });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [ifError, setIfError] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  useEffect(() => {
    selectedAssignment && setIfError(false);
  }, [selectedAssignment]);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [limit, setLimit] = useState(50);
  const observeElement = useRef(null);
  const [isTotal, setTotal] = useState(false);
  const [hasDiaries, setHasDiaries] = useState<boolean>(false);

  const handleDiaryStatusChange = (hasDiaries: boolean) => {
    setHasDiaries(hasDiaries);
  };

  const handleTakeUpdate = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 10);
  }, []);

  useObserve(observeElement, isTotal, handleTakeUpdate);

  const switchToProfileTab = () => {
    setActiveTab("profile");
  };
  const switchToAssignmentsTab = () => {
    setActiveTab("assignments");
  };
  const switchToNotesTab = () => {
    setActiveTab("notes");
  };
  const switchToDiaryTab = () => {
    setActiveTab("diary");
  };

  useEffect(() => {
    const fetchClientAssignments = async () => {
      if (activeTab === "assignments") {
        try {
          const response = await API.get(
            `assignments-client/?limit=${limit}&offset=0`,
          );
          const data = response.data.results.filter(
            (assignment) => assignment.user === Number(id),
          );
          setClientAssignments(data);
          console.log(response);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchClientAssignments();
  }, [id, activeTab, limit]);
  // const sendMessage = () => {
  //     if (newMessage.trim() !== '') {
  //         const message = {
  //             messageId: chatHistory.length + 1,
  //             sender: 'user',
  //             content: newMessage,
  //             date: new Date().toLocaleString(),
  //         };
  //         setChatHistory([...chatHistory, message]);
  //         setNewMessage('');
  //     }
  // };

  //   useEffect(() => {
  //     setChatHistory(client.chatHistory);
  //   }, [client.chatHistory]);

  const handleEditToggle = async () => {
    if (isEditing) {
      //save changes
      await saveClientChanges();
      //update client
      await updateUserData();
    }
    setIsEditing(!isEditing);
  };

  const emptyNoticeContent = (
    <>
      <span>{EmptyContentNoticeTexts.noContent.psySharedAssignments}</span>
      <span
        dangerouslySetInnerHTML={{
          __html: EmptyContentNoticeTexts.noContent.psyHowToShareAssignment,
        }}
      />
    </>
  );

  const handleInputChange = (e) => {
    setEditableClient({
      ...editableClient,
      [e.target.name]: e.target.value,
    });
  };

  const saveClientChanges = async () => {
    const requestBody = {
      client: {
        diagnosis: editableClient.diagnosis,
        about: editableClient.about,
      },
    };
    console.log(requestBody);
    try {
      const response = await API.put(`client/update/${id}/`, requestBody);
      console.log(response);
    } catch (e) {
      console.error("Error saving client", e.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableClient({ ...client.client });
  };

  const handleDeleteAssignment = (deletedAssignmentId) => {
    setClientAssignments((currentAssignments) =>
      currentAssignments.filter(
        (assignment) => assignment.id !== deletedAssignmentId,
      ),
    );
  };

  const handleModalClose = () => {
    setIsShareModalOpen(false);
    setIsSuccessModalOpen(false);
    setSelectedAssignment("");
    setIfError(true);
    setErrorText("");
  };

  const handleShareBtn = () => {
    setIsShareModalOpen(true);
  };

  const handleShareSubmit = async () => {
    try {
      const assignmentId = selectedAssignment;

      if (!assignmentId) {
        console.error("No assignment ID selected for sharing.");
        const errorText = "No assignment ID selected for sharing.";
        setIfError(true);
        setErrorText(errorText);
        return;
      } else {
        setIfError(false);
        setErrorText("");
      }

      const res = await API.get(
        `assignments/set-client/${assignmentId}/${id}/`,
      );

      if (res.status >= 200 && res.status <= 300) {
        setIfError(false);
        setErrorText("");
        setIsShareModalOpen(false);
        setIsSuccessModalOpen(true);
        setSelectedAssignment("");
      }
    } catch (error) {
      console.error("Error assigning assignment to clients:", error);
      setSelectedAssignment("");
      setIfError(true);
      setErrorText("Something happened");
    }
  };

  function openAssignment(card) {
    setCurrentCard(card);
  }

  console.log(client.client);

  return (
    <>
      <div className="client-detail-page">
        <header>
          <div>
            <h2>{`${client.first_name} ${client.last_name}`}</h2>
          </div>
          <div>
            {activeTab === "profile" && (
              <Button
                buttonSize="large"
                fontSize="medium"
                label={isEditing ? "Save Changes" : "Edit Client"}
                type="button"
                onClick={handleEditToggle}
              />
            )}
            {activeTab === "profile" && isEditing && (
              <Button
                buttonSize="large"
                fontSize="medium"
                label="Cancel"
                type="button"
                onClick={handleCancelEdit}
              />
            )}
            {activeTab === "assignments" && (
              <Button
                buttonSize="small"
                fontSize="small"
                label="Share assignment"
                type="button"
                onClick={handleShareBtn}
                icon={shareIcon}
              />
            )}
          </div>
          {activeTab === "notes" && (
            <button
              onClick={() => navigate(`/add-note/${client.id}/`)}
              className="client-button"
            >
              <FontAwesomeIcon icon={faNoteSticky} /> Add Note
            </button>
          )}
        </header>
        <div className="tabs">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={switchToProfileTab}
            id="client-profile-onboarding"
          >
            Profile
          </button>
          {/* <button className={activeTab === 'chat'? 'active' : ''} onClick={switchToChatTab}>Chat</button> */}
          <button
            className={activeTab === "assignments" ? "active" : ""}
            onClick={switchToAssignmentsTab}
            id="client-assignments-onboarding"
          >
            Assignments
          </button>
          {/* <button className={activeTab ==='stats'? 'active' : ''} onClick={switchToStatsTab}>Stats</button> */}
          {/* <button className={activeTab === 'notes' ? 'active' : ''} onClick={switchToNotesTab}>
          Notes
        </button> */}
          <button
            className={activeTab === "diary" ? "active" : ""}
            onClick={switchToDiaryTab}
            id="client-diary-onboarding"
          >
            Diary
          </button>
        </div>
        {/*Profile Tab View */}
        {activeTab === "profile" && (
          <div className="profile-tab">
            <h3>Last Update</h3>
            <p>
              {new Date(client.last_update).toLocaleDateString() ||
                "No info yet"}
            </p>

            <h3>Diagnosis</h3>
            {isEditing ? (
              <input
                type="text"
                name="diagnosis"
                value={editableClient.diagnosis || ""}
                onChange={handleInputChange}
                className="settings-input"
              />
            ) : (
              <p>{client.client?.diagnosis || "No info yet"}</p>
            )}

            <h3>About Client</h3>
            {isEditing ? (
              <input
                type="text"
                name="about"
                value={editableClient.about || ""}
                onChange={handleInputChange}
                className="settings-input"
              />
            ) : (
              <p>{client.client?.about || "No info yet"}</p>
            )}
          </div>
        )}
        {/*Assignments Tab View */}
        {activeTab === "assignments" &&
          (clientAssignments.length > 0 ? (
            <div className="assignments-tab">
              {clientAssignments.map((assignment) => (
                <ClientAssignmentTile
                  key={assignment.id}
                  assignment={assignment}
                  onDeleteSuccess={handleDeleteAssignment}
                  openAssignment={openAssignment}
                  clientId={id}
                />
              ))}
            </div>
          ) : (
            <EmptyContentNotice label={emptyNoticeContent} />
          ))}
        <div ref={observeElement} />
        {/*Notes Tab View */}
        {activeTab === "notes" && <Notes clientId={client.id} />}
        {activeTab === "diary" && (
          <>
            {!hasDiaries && (
              <EmptyContentNotice
                label={EmptyContentNoticeTexts.noContent.psyNoDiaries}
              />
            )}

            <DiaryNotes
              clientId={client.id}
              onDiaryStatusChange={handleDiaryStatusChange}
            />
          </>
        )}
        <Modal
          showCancel={false}
          isOpen={isShareModalOpen}
          onClose={handleModalClose}
          onConfirm={handleShareSubmit}
          confirmText="Share"
          ifError={ifError}
          errorText={errorText}
        >
          <div className="share-assignment share-assignment_clientDetailsPage">
            <button
              className="share-assignment__close-button"
              onClick={handleModalClose}
            >
              X
            </button>
            <h3 className="share-assignment__title">
              Choose assignment you want to share
            </h3>
            <div className="share-assignment__content-container">
              <AssignmentsPageRefactor
                isShareModal={true}
                setSelectedAssignmentIdForShareModalOnClientPage={
                  setSelectedAssignment
                }
                selectedAssignmentIdForShareModalOnClientPage={
                  selectedAssignment
                }
              ></AssignmentsPageRefactor>
            </div>
          </div>
        </Modal>
      </div>

      <Modal
        showCancel={false}
        isOpen={isSuccessModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
        confirmText="OK"
        ifError={ifError}
        errorText={errorText}
      >
        <h2>Assignment has been successfully sent!</h2>
      </Modal>
    </>
  );
}

export { ClientDetailsPage };
