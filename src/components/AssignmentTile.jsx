import React, {useState} from 'react';
import {useNavigate} from "react-router-dom"
import "../css/assignment-tile.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import API from '../service/axios';
import Modal from '../service/modal'

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export const AssignmentTile = ({ assignment, onFavoriteToggle, isFavorite }) => {
  const displayDate = formatDate(assignment.update_date);
  const navigate = useNavigate()

  const handleOnTileClick = (assignmentId) => () => {
    navigate(`/assignment/${assignmentId}`)
  }

  return (
    <div className="assignment-tile">
      <div className="assignment-image-container" onClick={handleOnTileClick(assignment.id)}>
        <div className='date-and-type'>
          <span>{displayDate}</span>
          {assignment.assignment_type && <span className="type">{assignment.assignment_type}</span>}
        </div>
        <img alt="Loading..." src={assignment.image_url}  />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
        <p>{assignment.author_name}</p>
      </div>
      <div className="assignment-actions">
        <span className="popularity">{assignment.likes}</span>
        <button
          className={
            isFavorite ? 'favorite-button selected' : 'favorite-button'
          }
          onClick={() => onFavoriteToggle(assignment.id)}
        >
          {isFavorite ? <><FontAwesomeIcon icon={faBookmark} />  In My List</> : <><FontAwesomeIcon icon={faBookmark} /> Add to List</>}
        </button>
      </div>
    </div>
  );
};

export const ClientAssignmentTile = ({assignment, onDeleteSuccess }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false)

  const deleteClientsAssignment = async () => {
    try{
      const response = await API.delete(`assignments-client/${assignment.id}/`)
      handleToggleModal()
      onDeleteSuccess(assignment.id)
    }
    catch(e){
      console.error(e.message)
    }
  }

  const handleToggleModal = () => setShowModal(!showModal)

  return(
    <div className="assignment-tile"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      <div className="assignment-image-container">
        <div className='date-and-type'>
          <span>{assignment.status}</span>
          {assignment.assignment_type && <span className="type">{assignment.assignment_type}</span>}
        </div>
        <img alt="Loading..." src={assignment.image_url}  />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
      </div>
      {isHovered && (
        <button className='delete-button' onClick={handleToggleModal}>
          <FontAwesomeIcon icon={faTrashCan}/>
        </button>
      )}
      <Modal
        isOpen={showModal}
        onClose={handleToggleModal}
        onConfirm={deleteClientsAssignment}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this assignment from client?</p>
      </Modal>
    </div>
  )
}
