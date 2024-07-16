//@ts-nocheck
import { useNavigate } from "react-router-dom";
import "../../css/app.scss";
import Button from "../../stories/buttons/Button";

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

        <Button
            buttonSize="large"
            fontSize="medium"
            label="Go to Login Page"
            type="button"
            onClick={handleGoButton}
          />
        </div>
      </div>
    </div>
  );
}

export { AfterRegistrationPage };
