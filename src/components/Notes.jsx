import React, { useState, useEffect } from 'react';


function Notes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [uniqueDates, setUniqueDates] = useState([]);
  const [notes, setNotes] = useState([])

  useEffect(() => {
    console.log()
  })
  
  return (
    <div className="notes-page">
      <div className="search-filters">
        <form className='search'>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <select
          className="date-filter"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="all">All Dates</option>
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <div className="notes-list">
        {notes.length > 0 ? (
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
        ): 
        (
          <div className='nothing-to-show'>There are no notes available</div>
        )}
      </div>
    </div>
  );
}

export default Notes;
