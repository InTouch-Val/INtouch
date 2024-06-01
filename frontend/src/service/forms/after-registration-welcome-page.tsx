//@ts-nocheck
import { useNavigate } from "react-router-dom";
import "../../css/app.scss";

function AfterRegistrationPage() {
  const navigate = useNavigate();

  const handleGoButton = () => {
    navigate("/login");
  };
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div>
          <h2>Welcome to InTouch</h2>
        </div>
        <div>
          <p>Welcome to InTouch! We are thrilled to have you here!</p>
          <p>
            Please follow intstructions sent to your e-mail to finish
            registration!
          </p>
        </div>
        <div>
          <button className="action-button" onClick={handleGoButton}>
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  );
}

export { AfterRegistrationPage };
