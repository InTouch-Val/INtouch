import React from 'react';
import "../css/assignmentTile.css"; 

// Helper function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

const AssignmentTile = ({ assignment, onFavoriteToggle }) => {
  // Assuming 'assignment.date' is in 'YYYY-MM-DD' format
  const displayDate = formatDate(assignment.modified);

  return (
    <div className="assignment-tile">
      <div className="assignment-image-container">
        {/* Here we add the date and type as an overlay */}
        <div className='date-and-type'>
          <span>{displayDate}</span>
          {/* Add the .type span only if type is available */}
          {assignment.type && <span className="type">{assignment.type}</span>}
        </div>
        <img src={assignment.image} alt={assignment.title} />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
        <p>{assignment.author}</p>
      </div>
      <div className="assignment-actions">
        <span className="popularity">{assignment.popularity}</span>
        <button
          className={
            assignment.favorite ? 'favorite-button selected' : 'favorite-button'
          }
          onClick={() => onFavoriteToggle(assignment.id)}
        >
          {assignment.favorite ? <><span dangerouslySetInnerHTML={{ __html: "&#10084;" }} /> In My List</> : <><span dangerouslySetInnerHTML={{ __html: "&#10084;" }} /> Add to List</>}
        </button>
      </div>
    </div>
  );
};

export default AssignmentTile;
