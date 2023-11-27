import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import "../css/assignments.css";
import API from '../service/axios';
import AssignmentTile from '../components/AssignmentTile';

function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [sortMethod, setSortMethod] = useState('date_asc');
  const [assignments, setAssignments] = useState([]); 
  const [filteredAssignments, setFilteredAssignments] = useState([]); 
  const [userFavorites, setUserFavorites] = useState([]);


    const navigate = useNavigate();

    const toggleFavorite = async (assignmentId) => {
      const isFavorite = userFavorites.includes(assignmentId);
      try {
          const endpoint = isFavorite ? 'delete-list' : 'add-list';
          await API.get(`assignments/${endpoint}/${assignmentId}`);
          setUserFavorites(prevFavorites => {
              if (isFavorite) {
                  return prevFavorites.filter(id => id !== assignmentId);
              } else {
                  return [...prevFavorites, assignmentId];
              }
          });
      } catch (error) {
          console.error("Error toggling favorites:", error);
      }
  };
  

    useEffect(() => {
      const fetchUserFavorites = async () => {
        try{
          const response = await API.get('get-user/')
          setUserFavorites(response.data[0].doctor.assignments)
        }
        catch(error){
          console.error("Error fetching user favorites: " + error)
        }
      }
      fetchUserFavorites()
    }, [])

    useEffect(() => {
      const fetchAssignments = async () => {
          try {
              const response = await API.get('assignments/');
              setAssignments(response.data); 
              setFilteredAssignments(response.data);
              console.log(response.data);
          } catch (error){
              console.error('Error fetching assignments', error);
              navigate("/");
          }
      };
      fetchAssignments();
  }, [navigate]);

    useEffect(() => {
        let updatedAssignments = [...assignments];

        if (searchTerm) {
            updatedAssignments = updatedAssignments.filter((assignment) =>
                assignment.title.toLowerCase()?.includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            updatedAssignments = updatedAssignments.filter((assignment) =>
                assignment.assignment_type === filterType
            );
        }

        if (filterLanguage !== 'all') {
            updatedAssignments = updatedAssignments.filter((assignment) =>
                assignment.language === filterLanguage
            );
        }

        sortAssignments(sortMethod, updatedAssignments);
    }, [searchTerm, filterType, filterLanguage, sortMethod, assignments]);

    const handleSortMethodChange = (e) => {
        setSortMethod(e.target.value);
    };

    const sortAssignments = (method, assignments) => {
        let sortedAssignments = [...assignments];
        switch (method) {
            case "date_asc":
                sortedAssignments.sort((a, b) => new Date(a.add_date) - new Date(b.add_date));
                break;
            case "date_desc":
                sortedAssignments.sort((a, b) => new Date(b.add_date) - new Date(a.add_date));
                break;
            case "popularity_asc":
                sortedAssignments.sort((a, b) => a.likes - b.likes);
                break;
            case "popularity_desc":
                sortedAssignments.sort((a, b) => b.likes - a.likes);
                break;
            default:
                break;
        }
        setFilteredAssignments(sortedAssignments);
    };

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
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="ge">German</option>
          <option value="it">Italian</option>
        </select>
        <select
          value={sortMethod}
          onChange={(e) => handleSortMethodChange(e)}>
            <option value="date_asc">Date Created Up</option>
            <option value="date_desc">Date Created Down</option>
            <option value="popularity_asc">Popularity Up</option>
            <option value="popularity_desc">Popularity Down</option>
        </select>
      </div>
      {activeTab === 'library' && (
        <div className='assignment-grid'>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map(assignment => (
              <AssignmentTile
                key={assignment.id}
                assignment={assignment}
                onFavoriteToggle={toggleFavorite}
                isFavorite={userFavorites?.includes(assignment.id)}
              />
            ))
          ) : (
            <div className="no-assignments">There is nothing to show yet</div>
          )}
        </div>
      )}
      {activeTab === 'my-list' && (
        <div className='assignment-grid'>
          {filteredAssignments.filter(assignment => userFavorites?.includes(assignment.id)).length > 0 ? (
            filteredAssignments
              .filter(assignment => userFavorites?.includes(assignment.id))
              .map(assignment => (
                <AssignmentTile
                  key={assignment.id}
                  assignment={assignment}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={true}
                />
              ))
          ) : (
            <div className="no-assignments">There is nothing to show yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AssignmentsPage;