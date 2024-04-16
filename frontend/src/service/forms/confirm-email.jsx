import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../axios';

export default function ConfirmEmail() {
  const { pk, token } = useParams();
  const [isValidLink, setIsValidLink] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // const verifyResetLink = async () => {
    //   try {
    //     const response = await API.get(`email/update/${pk}/${token}/`);
    //     debugger;
    //     if (response.status === 200) {
    //       setIsValidLink(true);
    //     }
    //   } catch (error) {
    //     console.error('Error verifying reset link:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    try {
      const response = API.get(`email/update/${pk}/${token}/`);
      if (response.status === 200) {
        setIsValidLink(true);
      }
    } catch (error) {
      console.error('Error verifying reset link:', error);
    } finally {
      setLoading(false);
    }

    // verifyResetLink();
  }, [pk, token]);

  if (loading) {
    return <div className="welcome-container">Loading...</div>;
  }

  if (!isValidLink) {
    return <div className="welcome-container">Invalid or expired link.</div>;
  }

  return <div className="welcome-container">Все ок</div>;
}
