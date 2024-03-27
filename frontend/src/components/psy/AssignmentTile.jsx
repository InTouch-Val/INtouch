import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { API } from '../../service/axios';
import { Modal } from '../../service/modal';
import '../../css/assignment-tile.css';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

function AssignmentTile({
  assignment,
  onFavoriteToggle,
  isFavorite,
  onShareToggle,
  isAuthor,
  onCopyClick,
  onDeleteClick,
}) {
  const displayDate = formatDate(assignment.update_date);
  const navigate = useNavigate();

  const handleOnTileClick = (assignmentId) => () => {
    assignment.is_public
      ? navigate(`/assignment/${assignmentId}`)
      : navigate(`/edit-assignment/${assignmentId}`);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && event.target.closest('.assignment__dropdown-btn') === null) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="assignment-tile">
      <div className="assignment-image-container" onClick={handleOnTileClick(assignment.id)}>
        <div className="date-and-type">
          <span>{displayDate}</span>
          {assignment.assignment_type && <span className="type">{assignment.assignment_type}</span>}
          {assignment.is_public === false ? null : (
            <>
              {isAuthor ? (
                <button
                  className="assignment__dropdown-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  {isDropdownOpen ? (
                    <div className="assignment__dropdown">
                      <button
                        className={
                          isFavorite
                            ? 'favorite-button favorite-button_dropdown_selected favorite-button_dropdown'
                            : 'favorite-button favorite-button_dropdown'
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          onFavoriteToggle(assignment.id);
                        }}
                      >
                        Favorite
                      </button>
                      <hr className="dropdown-separate-line" />
                      <button
                        className="assignment__dropdown-copy-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          onCopyClick(assignment.id);
                        }}
                      >
                        Duplicate
                      </button>
                      <hr className="dropdown-separate-line" />
                      <button
                        className="assignment__dropdown-delete-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteClick(assignment.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </button>
              ) : (
                <button
                  className={
                    isFavorite ? 'favorite-button favorite-button_selected' : 'favorite-button'
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    onFavoriteToggle(assignment.id);
                  }}
                ></button>
              )}
            </>
          )}
        </div>
        <img alt="Loading..." src={assignment.image_url} />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
        <p>{assignment.author_name}</p>
        <div className="assignment-actions">
          {assignment.is_public === false ? (
            <>
              <button
                className="assignment__edit-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/edit-assignment/${assignment.id}`);
                }}
              ></button>
              <button
                className="assignment__delete-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteClick(assignment.id);
                }}
              ></button>
            </>
          ) : (
            <>
              <span
                title="Client`s rating"
                className="assignment-actions__statistics assignment-actions__statistics_grades"
              >
                {assignment.average_grade}
              </span>
              <span
                title="Assignments count"
                className="assignment-actions__statistics assignment-actions__statistics_shares"
              >
                {assignment.share}
              </span>
              <button
                className="assignment-actions__share-with-client"
                onClick={() => onShareToggle()}
              ></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ClientAssignmentTile({ assignment, onDeleteSuccess }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusOneWord, setStatusOneWord] = useState('to-do');

  useEffect(() => {
    if (assignment.status === 'to do') {
      setStatusOneWord('to-do');
    } else if (assignment.status === 'in progress') {
      setStatusOneWord('in-progress');
    }
  }, [assignment]);

  const deleteClientsAssignment = async () => {
    try {
      await API.delete(`assignments-client/${assignment.id}/`);
      handleToggleModal();
      onDeleteSuccess(assignment.id);
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleToggleModal = () => setShowModal(!showModal);

  return (
    <div
      className="assignment-tile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="assignment-image-container">
        <div className="date-and-type">
          <span className={`status ${statusOneWord}`}>{assignment.status}</span>
          {assignment.assignment_type && <span className="type">{assignment.assignment_type}</span>}
        </div>
        <img alt="Loading..." src={assignment.image_url} />
      </div>
      <div className="assignment-info">
        <h3>{assignment.title}</h3>
      </div>
      {isHovered && (
        <button className="delete-button" onClick={handleToggleModal}>
          <FontAwesomeIcon icon={faTrashCan} />
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
  );
}

export { AssignmentTile, ClientAssignmentTile };
