//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../axios';
import { SetNewUserPassword } from './set-new-user-password';

function PasswordResetMock() {
  const { pk, token } = useParams();
  const [isValidLink, setIsValidLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setToken] = useState(null);

  useEffect(() => {
    const verifyResetLink = async () => {
      try {
        const response = await API.get(`password/reset/confirm/${pk}/${token}/`);
        if (response.status === 200) {
          setIsValidLink(true);
          setToken(response.data.access_token);
        }
      } catch (error) {
        console.error('Error verifying reset link:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyResetLink();
  }, [pk, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isValidLink) {
    return <div>Invalid or expired link.</div>;
  }

  return <SetNewUserPassword accessToken={accessToken} />;
}

export { PasswordResetMock };
