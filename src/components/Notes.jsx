import React, { useState, useEffect } from 'react';

const tagColors = {
  tag1: 'brown',
  tag2: 'blue',
  tag3: 'cyan',
  tag4: 'gray',
};

function Notes({ clientNotes }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [uniqueDates, setUniqueDates] = useState([]);

  useEffect(() => {
    const dates = [...new Set(clientNotes.map((note) => note.date))];
    setUniqueDates(['all', ...dates]);
  }, [clientNotes]);

  const filteredNotes = clientNotes.filter((note) => {
    const dateMatch = filterDate === 'all' || note.date === filterDate;
    const tagMatch = filterTag === 'all' || note.tags.includes(filterTag);
    const searchMatch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    return dateMatch && tagMatch && searchMatch;
  });

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
        <select
          className="tag-filter"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        >
          <option value="all">All Tags</option>
          <option value="tag1">Tag 1</option>
          <option value="tag2">Tag 2</option>
          <option value="tag3">Tag 3</option>
          <option value="tag4">Tag 4</option>
        </select>
      </div>
      <div className="notes-list">
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Title</th>
              <th>Owner</th>
              <th>Content</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotes.map((note) => (
              <tr key={note.id}>
                <td>
                  <div
                    className="tag"
                    style={{
                      backgroundColor: note.tags.length > 0 ? tagColors[note.tags[0]] : "transparent",
                    }}
                  >{note.tags[0]}</div>
                </td>
                <td>{note.title}</td>
                <td>{note.owner}</td>
                <td>{note.content}</td>
                <td>{note.date}</td>
                <td>
                  <button className="edit-note-button">&#9998; Edit</button>
                  <button className="delete-note-button">&#128465; Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notes;
