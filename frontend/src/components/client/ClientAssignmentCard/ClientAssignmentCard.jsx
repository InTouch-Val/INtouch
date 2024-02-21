import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './ClientAssignmentCard.css';
import { API } from '../../../service/axios';

function ClientAssignmentCard({ assignmentData, openAssignment }) {
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
  const menuReference = useRef(null);
  const buttonReference = useRef(null);

  function defineStatusClass() {
    switch (assignmentData?.status) {
      case 'to do': {
        return 'card__status_status_to-do';
      }
      case 'in progress': {
        return 'card__status_status_in-progress';
      }
      case 'done': {
        return 'card__status_status_done';
      }
      default: {
        return '';
      }
    }
  }

  function handleShareWithTherapist() {
    API.patch(`assignments-client/${assignmentData?.id}/`, { visible: !assignmentData?.visible })
      .then(() => {
        // TODO [2024-02-19]: прокинуть в родительский компонент и обновлять данные карточки
        setIsShowContextMenu(false);
      })
      .catch((error) => {
        console.error(error.message);
        setIsShowContextMenu(false);
      });
  }

  function showContextMenu() {
    setIsShowContextMenu(!isShowContextMenu);

    // check if the context menu is off-screen after it's shown
    setTimeout(() => {
      const menuRectangle = menuReference.current.getBoundingClientRect();
      const isOffScreen = menuRectangle.right > window.innerWidth;

      if (isOffScreen) {
        menuReference.current.style.left = '-120px';
      }
    }, 0);
  }

  function onCardClick(){
    openAssignment(assignmentData)

  }

  // close a context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isShowContextMenu && event.target !== buttonReference.current) {
        setIsShowContextMenu(false);
      }
    }

    if (isShowContextMenu) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isShowContextMenu]);

  return (
    <article className="card">
      <NavLink to={`/my-assignments/${assignmentData?.id}`} className="card__clickable-container" onClick={onCardClick}>
        <div className="card__wrapper-container">
          <span className="card__date">
            {new Date(assignmentData?.add_date)?.toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className={`card__status ${defineStatusClass()}`}>
            {/* eslint-disable-next-line no-unsafe-optional-chaining */}
            {assignmentData?.status[0]?.toUpperCase() + assignmentData?.status?.slice(1)}
          </span>
        </div>
        <img className="card__image" src={assignmentData?.image_url} alt="assignment" />
      </NavLink>
      <div className="card__wrapper-container">
        <h3 className="card__title" title={assignmentData?.title}>
          {assignmentData?.title}
        </h3>
        <div className="card__action-container">
          <button
            ref={buttonReference}
            className="card__action-button"
            type="button"
            aria-label="More actions..."
            onClick={showContextMenu}
          />
          <menu // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
            ref={menuReference}
            className={`card__action-menu${isShowContextMenu ? '' : ' card__action-menu_disabled'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <li className="card__action-menu-item">
              <NavLink
                to={`/my-assignments/${assignmentData?.id}`}
                className="card__action-menu-text"
              >
                Edit
                <div
                  className="card__action-menu-icon card__action-menu-icon_type_edit"
                  aria-label="Edit"
                />
              </NavLink>
            </li>
            <li className="card__action-menu-item disabled">
              <button type="button" className="card__action-menu-text" disabled={true}>
                Clear
                <div
                  className="card__action-menu-icon card__action-menu-icon_type_clear"
                  aria-label="Clear"
                />
              </button>
            </li>
            <li className="card__action-menu-item disabled">
              <button type="button" className="card__action-menu-text" disabled={true}>
                Duplicate
                <div
                  className="card__action-menu-icon card__action-menu-icon_type_duplicate"
                  aria-label="Duplicate"
                />
              </button>
            </li>
          </menu>
        </div>
      </div>
      <label className="card__input-label">
        Share with my therapist
        <input
          type="checkbox"
          className="card__input-checkbox"
          defaultChecked={assignmentData?.visible}
          onClick={handleShareWithTherapist}
        />
      </label>
    </article>
  );
}

export { ClientAssignmentCard };
