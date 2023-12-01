import React, { useState, useEffect } from 'react';


function Notes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [uniqueDates, setUniqueDates] = useState([]);

  
  return (
    <div className="notes-page">
      <header className="first-row">
        <h1>Notes</h1>
        <button className="add-note-button">Add Note</button>
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
          className="date-filter"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <div className="notes-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Content</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notes;
