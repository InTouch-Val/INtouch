import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/app.css"

function ActivateUserPage() {
  let { userId, userToken } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:8000/api/v1/confirm-email/${userId}/${userToken}`;

    // Опции для запроса
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    };

    axios.get(apiUrl, options)
      .then(response => {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        navigate('/')
      })
      .catch(error => {
        console.error('Error activating your account', error);
      });
  }, [userId, userToken]);

  return (
    <div>
      <h1>Account Activation In Progress...</h1>
    </div>
  );
}

export default ActivateUserPage;
