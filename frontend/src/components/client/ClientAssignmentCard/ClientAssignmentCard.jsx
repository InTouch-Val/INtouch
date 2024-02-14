import './ClientAssignmentCard.css';
import { NavLink } from 'react-router-dom';

function ClientAssignmentCard({ assignmentData }) {
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

  return (
    <article className="card">
      <NavLink to={`/my-assignments/${assignmentData?.id}`} className="card__clickable-container">
        <div className="card__wrapper-container">
          <span className="card__date">
            {new Date(assignmentData?.update_date)?.toLocaleString('en-US', {
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
        <h3 className="card__title">{assignmentData?.title}</h3>
        <button className="card__actions" type="button" aria-label="More actions..." />
      </div>
      <label className="card__input-label">
        Share with my therapist
        <input type="checkbox" className="card__input-checkbox" />
      </label>
    </article>
  );
}

export { ClientAssignmentCard };
