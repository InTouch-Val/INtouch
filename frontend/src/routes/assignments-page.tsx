//@ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { API } from "../service/axios";
import { AssignmentTile } from "../components/psy/AssignmentTile/AssignmentTile";
import "../css/assignments.css";
import { useAuth } from "../service/authContext";
import { Modal } from "../service/modal";
import { useGetAssignmentsQuery } from "../store/entities";
import { useObserve } from "../utils/hook/useObserve";
import { useAppSelector } from "../store/store";
import addAssignment from "../images/psy-icons/add-assignment-icon.svg";
import Button from "../stories/buttons/Button";

const getObjectFromEditorState = (editorState) => JSON.stringify(editorState);

function AssignmentsPage({
  isShareModal = false,
  setSelectedAssignmentIdForShareModalOnClientPage = "",
  selectedAssignmentIdForShareModalOnClientPage = "",
}) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("library");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [sortMethod, setSortMethod] = useState("date_asc");
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clients, setClients] = useState(currentUser?.doctor?.clients);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [ifError, setIfError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [limit, setLimit] = useState(30);
  const observeElement = useRef(null);
  const [isTotal, setTotal] = useState(false);

  const handleTakeUpdate = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 10);
  }, []);

  // const {
  //   activeTab,
  //   activeLanguage,
  //   activeFilterType,
  //   activeOrder,
  //   searchTerm,
  //   page,
  //   status,
  //   assignments,
  // } = useAppSelector((state) => state.assignment);

  // const {
  //   data: listAssignment,
  //   refetch,
  //   isSuccess,
  //   isFetching,
  // } = useGetAssignmentsQuery(
  //   {
  //     limit: 12,
  //     page: page,
  //     author: activeTab === AssignmentTab.myList ? currentUser.id : undefined,
  //     favorite: activeTab === AssignmentTab.favorites && true,
  //     language:
  //       activeLanguage !== TypeLanguage.All ? activeLanguage : undefined,
  //     assignmentType:
  //       activeFilterType !== TypeFilter.All ? activeFilterType : undefined,
  //     ordering: activeOrder,
  //     search: searchTerm,
  //   },
  //   {
  //     selectFromResult: ({ data, ...originalArgs }) => ({
  //       data: assignmentSelector.selectAll(
  //         data ?? assignmentAdapter.getInitialState()
  //       ),
  //       ...originalArgs,
  //     }),
  //     refetchOnMountOrArgChange: true, // Ensure refetch on arguments change
  //   }
  // );

  // console.log("isFetching", isFetching)
  // console.log("currentData", currentData)

  // if (isFetching && !currentData) return <h1>!!!!!loading!!</h1>

  console.log("filteredAssignments", filteredAssignments);

  useObserve(observeElement, isTotal, handleTakeUpdate);

  const navigate = useNavigate();

  const toggleFavorite = async (assignmentId) => {
    const isFavorite = userFavorites.includes(assignmentId);
    try {
      const endpoint = isFavorite ? "delete-list" : "add-list";
      await API.get(`assignments/${endpoint}/${assignmentId}`);
      setUserFavorites((previousFavorites) => {
        if (isFavorite) {
          return previousFavorites.filter((id) => id !== assignmentId);
        }
        return [...previousFavorites, assignmentId];
      });
    } catch (error) {
      console.error("Error toggling favorites:", error);
    }
  };

  const duplicateAssignment = async (assignmentId) => {
    try {
      const response = await API.get(`assignments/${assignmentId}/`);
      let assignmentData = response.data;
      console.log(assignmentData);

      // Подготавливаем данные для дубликата, используя ту же структуру, что и в handleSubmit
      const blockInfo = assignmentData.blocks.map((block) => {
        if (block.type === "text") {
          return {
            type: block.type,
            question: block.question,
            description: getObjectFromEditorState(block.content),
            choice_replies: [],
          };
        }
        if (block.type === "range") {
          return {
            type: block.type,
            question: block.question,
            start_range: block.minValue,
            end_range: block.maxValue,
            left_pole: block.leftPole || "Left Pole",
            right_pole: block.rightPole || "Right Pole",
          };
        }
        if (block.type === "image") {
          return {
            type: block.type,
            question: block.question,
            image: block.image,
          };
        }
        if (block.type === "open") {
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
        title: assignmentData.title + " COPY",
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
      await API.get(`assignments/${responseAssignmentId}/draft/`);
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

  const handleDeleteClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsDeleteModalOpen(true);
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      await API.delete(`assignments/${assignmentId}`);
      console.log(assignments);
      setAssignments(
        assignments.filter((assignment) => assignment.id !== assignmentId),
      );
      console.log(assignments);
      setSelectedAssignmentId("");
      handleModalClose();
    } catch (error) {
      console.error("Error delete assignment:", error);
      setIfError(true);
      setErrorText(error);
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await API.get(`assignments/?limit=${limit}&offset=0`);
        const filteredAssignments = response.data.results.filter(
          (assignment) => {
            if (isShareModal) {
              return assignment.is_public;
            } else {
              return (
                assignment.is_public || assignment.author === currentUser.id
              );
            }
          },
        );
        setAssignments(filteredAssignments);
        setFilteredAssignments(filteredAssignments);
      } catch (error) {
        console.error("Error fetching assignments", error);
        navigate("/");
      }
    };
    fetchAssignments();
  }, [navigate, currentUser.id, limit]);

  useEffect(() => {
    let updatedAssignments = [...assignments];

    if (searchTerm) {
      updatedAssignments = updatedAssignments.filter((assignment) =>
        assignment.title.toLowerCase()?.includes(searchTerm.toLowerCase()),
      );
    }

    if (filterType !== "all") {
      updatedAssignments = updatedAssignments.filter(
        (assignment) => assignment.assignment_type === filterType,
      );
    }

    if (filterLanguage !== "all") {
      updatedAssignments = updatedAssignments.filter(
        (assignment) => assignment.language === filterLanguage,
      );
    }

    sortAssignments(sortMethod, updatedAssignments);
  }, [searchTerm, filterType, filterLanguage, sortMethod, assignments]);

  const handleSortMethodChange = (e) => {
    setSortMethod(e.target.value);
  };

  const sortAssignments = (method, assignments) => {
    const sortedAssignments = [...assignments];
    switch (method) {
      case "date_asc": {
        sortedAssignments.sort(
          (a, b) => new Date(a.add_date) - new Date(b.add_date),
        );
        break;
      }
      case "date_desc": {
        sortedAssignments.sort(
          (a, b) => new Date(b.add_date) - new Date(a.add_date),
        );
        break;
      }
      case "popularity_asc": {
        sortedAssignments.sort((a, b) => a.likes - b.likes);
        break;
      }
      case "popularity_desc": {
        sortedAssignments.sort((a, b) => b.likes - a.likes);
        break;
      }
      default: {
        break;
      }
    }
    setFilteredAssignments(sortedAssignments);
  };
  const handleAddAssignment = () => {
    navigate("/add-assignment");
  };

  const handleModalClose = () => {
    setIsShareModalOpen(false);
    setIsSuccessModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedAssignmentId("");
    setSelectedClients([]);
    setIfError(false);
    setErrorText("");
  };

  const handleShareButton = (assignmentId) => {
    if (isShareModal) {
      setSelectedAssignmentIdForShareModalOnClientPage(assignmentId);
    } else {
      setSelectedAssignmentId(assignmentId);
      setIsShareModalOpen(true);
    }
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

  return (
    <div className="assignments-page">
      {!isShareModal && (
        <header>
          <h1>Assignments</h1>
          <Button
            buttonSize="small"
            fontSize="medium"
            label="Add Assignment"
            type="button"
            onClick={handleAddAssignment}
            icon={addAssignment}
          />
        </header>
      )}
      <div className="tabs">
        <button
          className={activeTab === "library" ? "active" : ""}
          onClick={() => setActiveTab("library")}
        >
          Library
        </button>
        <button
          className={activeTab === "favorites" ? "active" : ""}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites
        </button>
        <button
          className={activeTab === "my-list" ? "active" : ""}
          onClick={() => setActiveTab("my-list")}
        >
          My Tasks
        </button>
      </div>
      {!isShareModal && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      {!isShareModal && (
        <div className="filter-dropdowns">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="lesson">Lesson</option>
            <option value="exercise">Exercise</option>
            <option value="metaphor">Essay</option>
            <option value="study">Study</option>
            <option value="quiz">Quiz</option>
            <option value="methology">Methodology</option>
            <option value="metaphor">Metaphors</option>
          </select>
          {/* <select
          value={filterTags}
          onChange={(e) => setFilterTags(e.target.value)}
        >
          <option value="all">All Tags</option>
        </select> */}
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="ge">German</option>
            <option value="it">Italian</option>
          </select>
          <select
            value={sortMethod}
            onChange={(e) => handleSortMethodChange(e)}
          >
            <option value="date_asc">Date Created ↑</option>
            <option value="date_desc">Date Created ↓</option>
            <option value="popularity_asc">Popularity ↑</option>
            <option value="popularity_desc">Popularity ↓</option>
          </select>
        </div>
      )}
      {activeTab === "library" && (
        <div className="assignment-grid">
          {filteredAssignments.length > 0 ? (
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
          <div ref={observeElement} />
        </div>
      )}
      {activeTab === "favorites" && (
        <div className="assignment-grid">
          {filteredAssignments.some((assignment) =>
            userFavorites?.includes(assignment.id),
          ) ? (
            filteredAssignments
              .filter((assignment) => userFavorites?.includes(assignment.id))
              .map((assignment) => (
                <AssignmentTile
                  key={assignment.id}
                  assignment={assignment}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={true}
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
      )}
      {activeTab === "my-list" && (
        <div className="assignment-grid">
          {filteredAssignments
            .filter((assignment) => assignment.author === currentUser.id)
            .map((assignment) => (
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
            ))}
        </div>
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
        <div className="share-assignment">
          <button
            className="share-assignment__close-button"
            onClick={handleModalClose}
          >
            x
          </button>
          <h3 className="share-assignment__title">Share assignment with...</h3>
          <div className="share-assignment__list-wrapper">
            {clients.map((client) => (
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
    </div>
  );
}

export { AssignmentsPage };
