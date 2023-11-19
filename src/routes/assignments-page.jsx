import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import assignmentsData from '../data/assignments.json';
import "../css/assignments.css";
import API from '../service/axios';
import AssignmentTile from '../components/AssignmentTile';

// const tagColors = {
//   tag1: 'brown',
//   tag2: 'blue',
//   tag3: 'cyan',
//   tag4: 'gray',
// };

function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTags, setFilterTags] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const [filteredAssignments, setFilteredAssignments] = useState([])  //useState(assignmentsData);

  const navigate = useNavigate()

  const toggleFavorite = (assignmentId) => {
    const updatedAssignments = filteredAssignments.map((assignment) => {
      if (assignment.id === assignmentId) {
        return { ...assignment, favorite: !assignment.favorite };
      }
      return assignment;
    });
    setFilteredAssignments(updatedAssignments);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await API.get('assignments/')
        console.log(response)
        setFilteredAssignments(response.data)
      }
      catch (error){
        console.error('Error fetching assignments', error)
        navigate("/")
      }
  }
    fetchAssignments()
  }, [navigate])

  useEffect(() => {
    let updatedAssignments = assignmentsData;

    if (searchTerm) {
      updatedAssignments = updatedAssignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if(filterType !== 'all'){
      updatedAssignments = updatedAssignments.filter((assignment) =>
        assignment.type === filterType
      );
    }

    if(filterLanguage !== 'all'){
      updatedAssignments = updatedAssignments.filter((assignment) =>
        assignment.language === filterLanguage
      )
    }

    setFilteredAssignments(updatedAssignments);
  }, [searchTerm, filterType, filterTags, filterLanguage, filterDate]);
   

  const handleAddAssignment = () => {
    navigate("/add-assignment");
  };

  return (
    <div className="assignments-page">
      <header>
        <h1>Assignments</h1>
        <button className="add-assignment-button" onClick={handleAddAssignment}> Add Assignment</button>
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="lesson">Lesson</option>
          <option value="exercise">Exercise</option>
          <option value="metaphor">Essay</option>
          <option value="study">Study</option>
          <option value="quiz">Quiz</option>
          <option value="methology">Methodology</option>
          <option value="metaphor">Metaphors</option>
        </select>
        <select
          value={filterTags}
          onChange={(e) => setFilterTags(e.target.value)}
        >
          <option value="all">All Tags</option>
        </select>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="ge">German</option>
          <option value="it">Italian</option>
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
        {filteredAssignments.filter((assignment) => !assignment.archived).map((assignment) => (
         <AssignmentTile key={assignment.id} assignment={assignment} onFavoriteToggle={toggleFavorite} />
     ))}
     </div>
      )}
      {activeTab === 'my-list' && (
        <div className='assignment-grid'>
        {filteredAssignments.filter((assignment) => !assignment.archived && assignment.favorite).map((assignment) => (
         <AssignmentTile key={assignment.id} assignment={assignment} onFavoriteToggle={toggleFavorite} />
     ))}
     </div>
      )}
    </div>
  );
}

export default AssignmentsPage;