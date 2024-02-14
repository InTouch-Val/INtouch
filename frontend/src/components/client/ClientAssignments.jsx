import { useState, useEffect } from 'react';
import { useAuth } from '../../service/authContext';
import { API } from '../../service/axios';
import { ClientAssignmentCard } from './ClientAssignmentCard/ClientAssignmentCard';

function ClientAssignments() {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState('all');
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        let response = await API.get('assignments-client/');
        console.log(response);
        // response = response.data.filter((assignment) => assignment.user === currentUser.id);
        response = response.data;
        setAssignments(response);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchAssignments();
  }, [currentUser.id]);

  useEffect(() => {
    // let updatedAssignments = [...assignments];
    let updatedAssignments = assignments;

    // Filter assignments based on status
    if (currentTab !== 'all') {
      updatedAssignments = updatedAssignments.filter(
        (assignment) => assignment.status === currentTab, // Assuming 'status' field in assignment
      );
    }

    setFilteredAssignments(updatedAssignments);
  }, [currentTab, assignments]);

  return (
    <div className="assignments-page">
      <header>
        <h1>My Assignments</h1>
      </header>
      <div className="client tabs">
        <button
          className={currentTab === 'all' ? 'active' : ''}
          onClick={() => setCurrentTab('all')}
        >
          All Assignments
        </button>
        <button
          className={currentTab === 'in_progress' ? 'active' : ''}
          onClick={() => setCurrentTab('in_progress')}
        >
          In Progress
        </button>
        <button
          className={currentTab === 'done' ? 'active' : ''}
          onClick={() => setCurrentTab('done')}
        >
          Done
        </button>
      </div>
      <div className="assignment-grid">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <ClientAssignmentCard key={assignment.id} assignmentData={assignment} />
          ))
        ) : (
          <div className="nothing-to-show">You have no assignments. Contact your doctor</div>
        )}
      </div>
    </div>
  );
}

export { ClientAssignments };
