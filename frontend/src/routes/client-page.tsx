//@ts-nocheck
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddClient from "../images/psy-icons/add-client-icon.svg";
import { useAuth } from "../service/authContext";
import { API } from "../service/axios";
import "../css/clients.css";
import Select from "../components/psy/Select/Select";
import { menuActive, menuDate } from "../utils/constants";
import Button from "../stories/buttons/Button";
import useClientsPageOnboardingTour from "../utils/hook/onboardingHooks/clientsPageOnboardingTour";
import EmptyContentNotice from "../stories/empty-content-notice/EmptyContentNotice";
import EmptyContentNoticeTexts from "../utils/notification-texts.json";

function ClientPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [favoriteAssignments, setFavoriteAssignments] = useState([]);
  const [messageToUser, setMessageToUser] = useState(null);
  const [activityFilter, setActivityFilter] = useState({
    id: 1,
    text: "Status ▼",
    status: "All clients",
  });

  const [activityFilterDate, setActivityFilterDate] = useState({
    id: 1,
    text: "Added ▼",
    status: "Date up",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser, updateUserData } = useAuth();
  const [isSelectActive, setSelectActive] = useState(false);
  const [isSelectDateActive, setSelectDateActive] = useState(false);
  const navigate = useNavigate();

  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(filteredClients.length);
  }, []);

  // useEffect(() => {
  //   updateUserData();
  // }, [updateUserData]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (modalAction === "add") {
        try {
          await API.get("assignments/").then((response) => {
            const data = response.data.results.filter((assignment) =>
              currentUser.doctor.assignments.includes(assignment.id),
            );
            setFavoriteAssignments(data);
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchAssignments();
  }, [modalAction, currentUser.doctor.assignments]);

  const filteredClients =
    currentUser?.doctor?.clients
      .sort((a, b) =>
        activityFilterDate.status === "Date up"
          ? new Date(b.date_joined) - new Date(a.date_joined)
          : new Date(a.date_joined) - new Date(b.date_joined),
      )
      .filter(
        (client) =>
          `${client.first_name} ${client.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (activityFilter.status === "All clients" ||
            client.is_active.toString() === activityFilter.status),
      ) || [];

  const hasClients = !!filteredClients.length;

  useClientsPageOnboardingTour(hasClients);

  const openModal = (clientId) => {
    handleActionSelect("delete");
    setShowModal(true);
    setSelectedClientId(clientId);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClientId(null);
    setModalAction(null);
  };

  const handleActionSelect = (action) => {
    setModalAction(action);
  };

  const handleAddClient = () => {
    navigate("/add-client");
  };

  const handleDeleteClient = async () => {
    try {
      const response = await API.delete(`client/delete/${selectedClientId}/`);
      await updateUserData();
      setMessageToUser(response.data.message);
      closeModal();
    } catch (e) {
      console.error(e);
      setMessageToUser("There was an error deleting the client");
    }
  };

  const handleAssignmentAddToClient = async (assignment) => {
    try {
      const response = await API.get(
        `assignments/set-client/${assignment}/${selectedClientId}/`,
      );
      closeModal();
      setMessageToUser(response.data.detail);
    } catch (e) {
      setMessageToUser(e.message);
    }
  };

  function handleClickOverlay(e) {
    setSelectDateActive(false);
    setSelectActive(false);
  }

  return (
    <div className="clients-page" onClick={handleClickOverlay}>
      <header className="first-row">
        <h1>Clients</h1>
        <Button
          buttonSize="small"
          fontSize="medium"
          label="Add Client"
          type="button"
          onClick={handleAddClient}
          icon={AddClient}
        />
      </header>
      <div className="search-filters">
        <form className="search">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      {messageToUser && <p className="success-message">{messageToUser}</p>}
      <div className="clients-list">
        {hasClients ? (
          <table>
            <thead>
              <tr onClick={(e) => e.stopPropagation()}>
                <th className="table__headColumn">Full Name</th>
                <th className="table__headColumn">
                  <div
                    className="button-select"
                    onClick={() => setSelectActive((prev) => !prev)}
                  >
                    {activityFilter.text}
                  </div>

                  {isSelectActive && (
                    <Select
                      menu={menuActive}
                      setActivityFilter={setActivityFilter}
                    />
                  )}
                </th>
                <th className="table__headColumn">
                  <div
                    className="button-select"
                    onClick={() => setSelectDateActive((prev) => !prev)}
                  >
                    {activityFilterDate.text}
                  </div>
                  {isSelectDateActive && (
                    <Select
                      menu={menuDate}
                      setActivityFilter={setActivityFilterDate}
                    />
                  )}
                </th>
                <th className="table__headColumn">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td id="clients-name-onboarding">
                    <Link
                      className="link-to-client"
                      to={`/clients/${client.id}`}
                    >
                      {`${client.first_name} ${client.last_name}`}
                    </Link>
                  </td>
                  <td id="clients-status-onboarding">
                    {client.is_active ? "Active" : "Inactive"}
                  </td>
                  <td>{new Date(client.date_joined).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="open-modal-button icon-trash"
                      onClick={() => openModal(client.id)}
                    ></button>
                    {showModal && (
                      <div className="modal-overlay" onClick={closeModal}>
                        <div
                          className="modal"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="close-modal-button"
                            onClick={closeModal}
                          >
                            &times;
                          </button>
                          {!modalAction && (
                            <div>
                              <button
                                className="action-button"
                                onClick={() => handleActionSelect("delete")}
                              >
                                Delete Client
                              </button>

                              {/* TODO: Дизайнеры отказались от 2 модалки на этой странице,
                            но сказали, что где то будут ее использовать еще */}
                              <button
                                className="action-button"
                                onClick={() => handleActionSelect("add")}
                              >
                                Add Assignment
                              </button>
                            </div>
                          )}
                          {modalAction === "delete" && (
                            <div className="delete-modal-div">
                              <p>
                                Are you sure you want to delete this client?
                                This action is irrevertable!
                              </p>
                              <div>
                                <button
                                  className="action-button"
                                  onClick={handleDeleteClient}
                                >
                                  Delete
                                </button>
                                <button
                                  className="action-button"
                                  onClick={closeModal}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                          {modalAction === "add" && (
                            <div>
                              <p>Choose the assignment you want to assign:</p>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Language</th>
                                    <th>Author</th>
                                    <th>Update Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {favoriteAssignments.map((assignment) => (
                                    <tr key={assignment.id}>
                                      <td>{assignment.title}</td>
                                      <td>{assignment.text}</td>
                                      <td>{assignment.assignment_type}</td>
                                      <td>{assignment.language}</td>
                                      <td>
                                        {assignment.author_name
                                          ? assignment.author_name
                                          : "Unknow Author"}
                                      </td>
                                      <td>{assignment.update_date}</td>
                                      <td>
                                        <button
                                          className="action-button"
                                          onClick={() =>
                                            handleAssignmentAddToClient(
                                              assignment.id,
                                            )
                                          }
                                        >
                                          Assign
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              <tr>
                <td></td>
                <td className="table__show-result">
                  Show result {filteredClients.length} is {count}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <EmptyContentNotice
            label={EmptyContentNoticeTexts.noContent.psyAddClient}
          />
        )}
      </div>
    </div>
  );
}

export { ClientPage };
