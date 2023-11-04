import React, { useState } from 'react';
import assignmentsData from '../data/assignments.json';

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

  const toggleFavorite = (assignmentId) => {
    // Implement logic to toggle the favorite status of an assignment
  };

  return (
    <div className="assignments-page">
      <header>
        <h1>Assignments</h1>
        <button className="create-assignment-button">Create Assignment</button>
      </header>
      <div className="tabs">
        <button
          className={activeTab === 'library' ? 'active' : ''}
          onClick={() => setActiveTab('library')}
        >
          Library
        </button>
        <button
          className={activeTab === 'favorites'? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
        >
            Favorites
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
        <select
          value={filterTags}
          onChange={(e) => setFilterTags(e.target.value)}
        >
          <option value="all">All Tags</option>
          {/* Add tag options here */}
        </select>
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
        <div className="assignments-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Type</th>
              <th>Modified</th>
              <th>Popularity</th>
              <th>Favorite</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsData.filter((assignment) => !assignment.archived).map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.title}</td>
                <td>{assignment.author}</td>
                <td>{assignment.status}</td>
                <td>{assignment.type}</td>
                <td>{assignment.modified}</td>
                <td>{assignment.popularity}</td>
                <td>
                  <button
                    className={
                      assignment.favorite
                        ? 'favorite-button selected'
                        : 'favorite-button'
                    }
                    onClick={() => toggleFavorite(assignment.id)}
                  >
                    &#10084;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {activeTab === 'favorites' && (
        <div className="assignments-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Type</th>
              <th>Modified</th>
              <th>Activities</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsData
              .filter((assignment) => assignment.favorite && !assignment.archived)
              .map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.author}</td>
                  <td>{assignment.status}</td>
                  <td>{assignment.type}</td>
                  <td>{assignment.modified}</td>
                  <td>
                    <button className="activity-button">Publish</button>
                    <button className="activity-button">Edit</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      )}
      {activeTab === 'archive' && (
        <div className="assignments-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Type</th>
              <th>Modified</th>
              <th>Activities</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsData
              .filter((assignment) => assignment.archived)
              .map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.author}</td>
                  <td>{assignment.status}</td>
                  <td>{assignment.type}</td>
                  <td>{assignment.modified}</td>
                  <td>
                    <button className="activity-button">Restore</button>
                    <button className="activity-button">Permanently Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default AssignmentsPage;
