import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../css/registration.css';
import { isValidEmail, isValidPassword } from './regex';
import { API } from '../axios';

function PasswordResetRequested() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '' });
  const [error, setError] = useState({ email: '', login: '' });
  const [isValidCredentials, setIsValidCredentials] = useState(false);
  const [isSucces, setIsSucces] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError({ email: '', login: '' });

    try {
      const response = await API.post('password/reset/', { email: credentials.email });
      if (response.status === 200) {
        setIsSucces(true);
      }
    } catch (error) {
      const message =
        error.response?.data?.email[0] || 'An error occurred during password reset request.';
      console.error('Password reset request error:', error);
      setError({ ...error, login: message });
    }
  };

  const handleCredentialsBlur = (value) => {
    let newError = { ...error };
    if (!isValidEmail(value)) {
      newError.email =
        'Please make sure your email address is in the format        example@example.com';
    } else {
      newError.email = '';
    }
    setError(newError); // Обновляем состояние с новыми ошибками
    setIsValidCredentials(!newError.email);
  };

  return (
    <div className="registration-page">
      <div className="registration-form">
        <img
          alt="in"
          src="https://i122.fastpic.org/big/2023/1030/7b/1e679a924edf77196513a8491eb5f37b.jpg"
          width="100px"
          border="0"
        />
        {isSucces && (
          <div className="reset-password__succes">
            We've sent you an email with instructions on how to reset your password
          </div>
        )}
        <h1 className="reset-password__heading">Reset Password</h1>
        <p className="reset-password__paragraph">Enter your email to get a reset link</p>
        <div className="input-fields login">
          <input
            className={`input ${error.email || error.login ? 'error' : ''}`}
            type="text"
            id="email"
            placeholder="Email"
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            onBlur={(e) => handleCredentialsBlur(e.target.value)}
            required
          />
        </div>
        <div className="error__text error__text_login">
          {error.email && <div>{error.email}</div>}
          {error.login && <div>{error.login}</div>}
        </div>
        <button
          className="action-button action-button_register-login"
          onClick={handleForgotPassword}
          disabled={!isValidCredentials}
        >
          Send reset link
        </button>
        <p className="link">
          Remember the password? Sign <Link to="/login">in</Link>
        </p>
      </div>
    </div>
  );
}

export { PasswordResetRequested };
