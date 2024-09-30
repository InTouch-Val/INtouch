//@ts-nocheck
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useAuth } from "../../service/authContext";
import { API } from "../../service/axios";
import { ClientAssignmentCard } from "./ClientAssignmentCard/ClientAssignmentCard";
import { AuthProvider } from "../../service/authContext";
import { useObserve } from "../../utils/hook/useObserve";
import { useGetAssignmentsQuery } from "../../store/entities";
import { StatusFromServer } from "../psy/ClientAssignmentTile";

function ClientAssignments() {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("all");
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentCard, card } = useAuth();
  const [limit, setLimit] = useState(10);
  const observeElement = useRef(null);
  const [isTotal, setTotal] = useState(false);

  const handleTakeUpdate = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 10);
  }, []);

  useObserve(observeElement, isTotal, handleTakeUpdate);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        let response = await API.get(
          `/assignments-client/?limit=${limit}&offset=0`,
        );
        response = response.data.results.filter(
          (assignment) => assignment.user === currentUser.id,
        );
        // response = response.data.results;
        setAssignments(response);

        setIsLoading(false);
      } catch (error) {
        console.error(error.message);
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [currentUser.id, limit]);

  useEffect(() => {
    // let updatedAssignments = [...assignments];
    let updatedAssignments = assignments;

    // Filter assignments based on status
    if (currentTab !== "all") {
      updatedAssignments = updatedAssignments.filter(
        (assignment) => assignment.status === currentTab, // Assuming 'status' field in assignment
      );
    }

    setFilteredAssignments(updatedAssignments);
  }, [currentTab, assignments]);

  function openAssignment(card) {
    setCurrentCard(card);
  }

  return (
    <div className="assignments-page">
      <header>
        <h1>Assignments</h1>
      </header>
      <div className="client tabs">
        <button
          className={currentTab === "all" ? "active" : ""}
          onClick={() => setCurrentTab("all")}
        >
          To do
        </button>
        <button
          className={currentTab === "in_progress" ? "active" : ""}
          onClick={() => setCurrentTab("in_progress")}
        >
          In Progress
        </button>
        <button
          className={currentTab === "done" ? "active" : ""}
          onClick={() => setCurrentTab("done")}
        >
          Done
        </button>
      </div>
      <div className="assignment-grid">
        {isLoading ? (
          <div className="nothing-to-show">Loading...</div>
        ) : filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => {
            return (
              assignment.status == StatusFromServer.ToDo && (
                <ClientAssignmentCard
                  key={assignment.id}
                  assignmentData={assignment}
                  openAssignment={openAssignment}
                />
              )
            );
          })
        ) : (
          <div className="nothing-to-show">
            You have no assignments. Contact your doctor
          </div>
        )}
        <div className="assignment__observeElement" ref={observeElement} />
      </div>
    </div>
  );
}

export { ClientAssignments };
