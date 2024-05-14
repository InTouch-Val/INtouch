import NotificationStyles from "./notifications.module.scss";

const AssignmentNotComplete = ({ completeClick, backClick }) => {
  return (
    <div>
      <p className={NotificationStyles.modal_description}>
        It seems not all fields are filled
      </p>
      <div className={NotificationStyles.modal_buttons_container}>
        <button
          className={`${NotificationStyles.modal_button} ${NotificationStyles.modal_button_highlighted}`}
          onClick={backClick}
        >
          Back
        </button>

        <button
          className={`${NotificationStyles.modal_button} ${NotificationStyles.modal_button_neitral}`}
          onClick={completeClick}
        >
          Complete as is
        </button>
      </div>
    </div>
  );
};

export default AssignmentNotComplete;
