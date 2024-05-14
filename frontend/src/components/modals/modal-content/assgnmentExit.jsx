import NotificationStyles from './notifications.module.scss';

const AssignmentExit = ({ saveClick, discardClick }) => {
  return (
    <div>
      <p className={NotificationStyles.modal_description}>
        Closing task without completion may lead to data loss
      </p>
      <div className={NotificationStyles.modal_buttons_container}>
        <button
          className={`${NotificationStyles.modal_button} ${NotificationStyles.modal_button_highlighted}`}
          onClick={saveClick}
        >
          Save in progress
        </button>

        <button
          className={`${NotificationStyles.modal_button} ${NotificationStyles.modal_button_neitral}`}
          onClick={discardClick}
        >
          Discard & Close
        </button>
      </div>
    </div>
  );
};

export default AssignmentExit;
