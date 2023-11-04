import React, { useState } from 'react';
import assignmentsData from '../data/assignments.json';
import "../css/assignments.css";
import AssignmentTile from '../components/AssignmentTile';

const tagColors = {
  tag1: 'brown',
  tag2: 'blue',
  tag3: 'cyan',
  tag4: 'gray',
};

function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterTags, setFilterTags] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [assignments, setAssignments] = useState(assignmentsData);

  const toggleFavorite = (assignmentId) => {
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id === assignmentId) {
        return { ...assignment, favorite: !assignment.favorite };
      }
      return assignment;
    });
    setAssignments(updatedAssignments);
  };

  return (
    <div className="assignments-page">
      <header>
        <h1>Assignments</h1>
        <button className="add-assignment-button">Add Assignment</button>
      </header>
      <div className="tabs">
        <button
          className={activeTab === 'library' ? 'active' : ''}
          onClick={() => setActiveTab('library')}
        >
          Library
        </button>
        <button
          className={activeTab === 'my-list'? 'active' : ''}
          onClick={() => setActiveTab('my-list')}
        >
            My List
        </button>
        <button
          className={activeTab === 'archive' ? 'active' : ''}
          onClick={() => setActiveTab('archive')}
        >
            Archive
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-dropdowns">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          {/* Add status options here */}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          {/* Add type options here */}
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
          {/* Add language options here */}
        </select>
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="all">All Dates</option>
          {/* Add date options here */}
        </select>
      </div>
      {activeTab === 'library' && (
        <div className='assignment-grid'>
           {assignments.filter((assignment) => !assignment.archived).map((assignment) => (
            <AssignmentTile key={assignment.id} assignment={assignment} onFavoriteToggle={toggleFavorite} />
        ))}
        </div>
      )}
      {activeTab === 'my-list' && (
        <div className='assignment-grid'>
        {assignments.filter((assignment) => !assignment.archived && assignment.favorite).map((assignment) => (
         <AssignmentTile key={assignment.id} assignment={assignment} onFavoriteToggle={toggleFavorite} />
     ))}
     </div>
      )}
      {activeTab === 'archive' && (
        <div className='assignment-grid'>
        {assignments.filter((assignment) => assignment.archived).map((assignment) => (
         <AssignmentTile key={assignment.id} assignment={assignment} onFavoriteToggle={toggleFavorite} />
     ))}
     </div>
      )}
    </div>
  );
}

export default AssignmentsPage;