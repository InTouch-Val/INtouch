import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../axios';
import { useAuth } from '../authContext';
import '../../css/registration.css';
import logo from '../../images/logo.svg';

function ClientRegistrationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = location.state || {};

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    API.get(`/get-user`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        setFirstName(response.data[0].first_name);
        setLastName(response.data[0].last_name);
        setEmail(response.data[0].email);
        setUserId(response.data[0].id);
      })
      .catch((error) => {
        console.error('Error fetching user data', error);
      });
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }
    if (password.length < 8) {
      setError('You must have at least 8 characters in your password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await API.put(
        `update-client/${userId}/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          confirm_password: confirmPassword,
          accept_policy: acceptTerms,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        setError('Updated Sueccessfully');
        setTimeout(() => {
          login(localStorage.getItem('accessToken'), localStorage.getItem('refreshToken'));
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      setError(error.response?.data?.message || 'An error occurred during the client update.');
    }
  };

  return (
    <div className="registration-page">
      <div onSubmit={handleSubmit} className="registration-client">
        <img src={logo} className="registration__logo" alt="logo"></img>
        <h2 className="registration__header">
          Hello and Welcome to INtouch! Set Your Password To Proceed
        </h2>
        <form className="registration__form">
          <input
            className="registartion-client__input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
          <input
            className="registartion-client__input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
          <input
            className="registartion-client__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="registartion-client__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            className="registartion-client__input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <div className="registration-client__checkbox-box">
            <input
              className="registration-client__checkbox-input"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label className="registration-client__checkbox">
              I agree with the terms and conditions
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-buttons">
            <button type="submit" className="registration__button">
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ClientRegistrationPage };
