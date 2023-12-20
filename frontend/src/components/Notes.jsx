import React, { useState, useEffect } from 'react';
import API from '../service/axios';
import {useAuth} from '../service/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';


function Notes({clientId}) {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [uniqueDates, setUniqueDates] = useState([]);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await API.get('notes/');
        let fetchedNotes = response.data;

        if (currentUser.user_type === "doctor") {
          const clientNotesIds = currentUser.doctor.clients.find(client => client.id === clientId).client.notes
          console.log(clientNotesIds)
          fetchedNotes = fetchedNotes.filter(note => clientNotesIds.includes(note.id));
        }

        const dates = [...new Set(fetchedNotes.map(note => new Date(note.add_date).toDateString()))];
        setUniqueDates(dates);

        setNotes(fetchedNotes);
        setFilteredNotes(fetchedNotes); 
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchNotes();
  }, [clientId, currentUser]);

  useEffect(() => {
    const filter = () => {
      let tempNotes = [...notes];

      if (filterDate !== 'all') {
        tempNotes = tempNotes.filter(note => new Date(note.add_date).toDateString() === filterDate);
      }

      if (searchTerm) {
        tempNotes = tempNotes.filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          convertContentToText(note.content).toLowerCase().includes(searchTerm.toLowerCase()));
      }

      setFilteredNotes(tempNotes);
    };

    filter();
  }, [notes, filterDate, searchTerm]);

  const convertContentToText = (content) => {
    try {
      const contentObj = JSON.parse(content);
  
      // Извлекаем блоки текста
      const blocks = contentObj?._immutable?.currentContent?.blockMap;
      if (!blocks) {
        return content;
      }
  
      // Находим первый непустой блок текста
      for (const blockKey in blocks) {
        if (blocks[blockKey].text.trim() !== '') {
          return blocks[blockKey].text;
        }
      }
      return content;
    } catch (e) {
      console.error('Error parsing content:', e);
      return content;
    }
  };

  
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
            {filteredNotes.map(note => (
                <tr key={note.id}>
                  <td>{note.title}</td>
                  <td>{note.author_name}</td>
                  <td>{convertContentToText(note.content)}</td>
                  <td>{new Date(note.add_date).toLocaleDateString()}</td>
                  <td>
                    <button className='action-button'><FontAwesomeIcon icon={faTrashCan} /></button>
                  </td>
                </tr>
              ))}
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
