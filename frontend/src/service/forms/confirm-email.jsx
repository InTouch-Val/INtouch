import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../axios';

export default function ConfirmEmail() {
  const { pk, token } = useParams();
  const [message, setMessage] = React.useState();
  const [isValidLink, setIsValidLink] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const verifyResetLink = async () => {
      try {
        const response = await API.get(`user/update/email/confirm/${pk}/${token}/`);
        console.log(response);
        if (response.status === 200) {
          setMessage(response.data);
        }
      } catch (error) {
        console.error('Error verifying reset link:', error);
        setMessage(response.data.error);
      } finally {
        setLoading(false);
      }
    };

    verifyResetLink();
  }, [pk, token]);

  function handleGoButton() {
    navigate('/settings');
  }

  if (loading) {
    return <div className="welcome-container">Loading...</div>;
  }

  if (message?.error) {
    return (
      <div className="welcome-container">
        <div className="welcome-content">
          <h1>New email not update </h1>
          <p>{message.error}</p>
          <button className="action-button" onClick={handleGoButton}>
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  if (message?.message) {
    return (
      <div className="welcome-container">
        <div className="welcome-content">
          <h1>New email confirmed</h1>
          <p> {message.message}</p>
          <button className="action-button" onClick={handleGoButton}>
            Go to Settings
          </button>
        </div>
      </div>
    );
  }
}
