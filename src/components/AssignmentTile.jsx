import React from 'react';
import "../css/assignmentTile.css"; 

// Helper function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

const AssignmentTile = ({ assignment, onFavoriteToggle }) => {
  // Assuming 'assignment.date' is in 'YYYY-MM-DD' format
  const displayDate = formatDate(assignment.update_date);

  return (
    <div className="assignment-tile">
      <div className="assignment-image-container">
        <div className='date-and-type'>
          <span>{displayDate}</span>
          {assignment.assignment_type && <span className="type">{assignment.assignment_type}</span>}
        </div>
        <img alt={assignment.title}  />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
        <p>{assignment.author}</p>
      </div>
      <div className="assignment-actions">
        <span className="popularity">{assignment.likes}</span>
        <button
          className={
            assignment.favorite ? 'favorite-button selected' : 'favorite-button'
          }
          onClick={() => onFavoriteToggle(assignment.id)}
        >
          {assignment.favorite ? <><i class='fa fa-bookmark'></i> In My List</> : <><i class='fa fa-bookmark'></i> Add to List</>}
        </button>
      </div>
    </div>
  );
};

export default AssignmentTile;
