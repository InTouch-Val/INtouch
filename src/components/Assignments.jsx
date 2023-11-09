import React, { useState } from 'react';

function Assignments({ clientAssignments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openActionsClientId, setOpenActionsClientId] = useState(null)

  const filteredAssignments = clientAssignments.filter((assignment) => {
    const statusMatch = filterStatus === 'all' || assignment.status.toLowerCase() === filterStatus;
    const searchMatch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const toggleActions = (assignmentId) => {
    if(openActionsClientId === assignmentId) {
        setOpenActionsClientId(null)
    }else{
        setOpenActionsClientId(assignmentId)
    }
  }

  return (
    <div className="assignments-page">
      <header className="first-row">
        <h1>Assignments</h1>
        <button className="add-assignment-button"
        >Add Assignment
        </button>
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
          <button className="search-button">&#128269;</button>
        </form>
        <select
          className="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="assignments-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Sent</th>
              <th>Status</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.title}</td>
                <td>{assignment.sent}</td>
                <td>{assignment.status}</td>
                <td>{assignment.lastUpdate}</td>
                <td>
                  <button className='actions-button'
                    onClick={() => toggleActions(assignment.id)}>&#8942;</button>
                    {openActionsClientId === assignment.id && (
                        <div className='actions-menu'>
                            <button className="edit-assignment-button">&#9998; Edit</button>
                            <button className="delete-assignment-button">&#128465; Delete</button>
                        </div>
                    )}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pagination'>
        {/*Buttons for pagination*/}
      </div>
    </div>
  );
}

export default Assignments;
