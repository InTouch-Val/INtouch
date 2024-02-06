import { useNavigate } from 'react-router-dom';

function PasswordResetRequested() {
  const navigate = useNavigate();

  const handleGoButton = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Reset Link Has Been Sent To Your E-Mail</h1>
        <p>Check your E-Mail and follow instructions to reset your password</p>
        <button className="action-button" onClick={handleGoButton}>
          Go to Login Page
        </button>
      </div>
    </div>
  );
}

export { PasswordResetRequested };
