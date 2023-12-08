import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import API from '../axios';
import "../../css/app.css"

function ActivateUserPage() {
  let { userId, userToken } = useParams();
  const navigate = useNavigate()
  const {login} = useAuth()

  useEffect(() => {
    API.get(`confirm-email/${userId}/${userToken}/`)
      .then(response => {
        if (window.location.href.includes('/activate-client/')) {
          localStorage.setItem("refreshToken", response.data.refresh_token)
          navigate(`/client-registration`, { state: { accessToken: response.data.access_token } });
        } else if(window.location.href.includes('/activate/')) {
          login(response.data.access_token, response.data.refresh_token);
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error activating your account', error);
      });
  }, [userId, userToken, navigate, login]);

  return (
    <div>
      <h1>Account Activation In Progress...</h1>
    </div>
  );
}

export default ActivateUserPage;
