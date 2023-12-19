import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../axios';
import { useAuth } from '../authContext';
import "../../css/registration.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Использование useAuth
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [passwordShown, setPasswordShown] = useState(false)


  const handleTogglePassword = (e) => {
    e.preventDefault()
    setPasswordShown(!passwordShown);
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        username: credentials.email.trim(),
        password: credentials.password.trim(),
      }

      const response = await API.post('token/', requestData);

      if (response.status === 200) {
        login(response.data.access, response.data.refresh);
        navigate('/');
      } else {
        setError("Something went wrong. Please try again");
      }
    } catch (error) {
      const message = error.response?.data.message || 'An error occurred while logging in.';
      setError(message);
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if(credentials.email.trim() === ""){
      setError("Email field must not be blank")
    }
    try {
      const response = await API.post('password/reset/', { email: credentials.email });
      if (response.status === 200) {
        navigate('/password-reset-requested');
      }
    } catch (error) {
      const message = error.response?.data?.email[0] || 'An error occurred during password reset request.';
      console.error('Password reset request error:', error);
      setError(message);
    }
  };

  return (
    <div className='registration-page'>
      <form className="registration-form" onSubmit={handleLogin}>
        <img src="https://i122.fastpic.org/big/2023/1030/7b/1e679a924edf77196513a8491eb5f37b.jpg" width="100px" border="0" />
        <div className='input-fields login'>
          <input
              type='text'
              id='username'
              placeholder='Enter username'
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
          
            <div className='password-field'>
              <input
                type={passwordShown ? 'text' : 'password'}
                id='password'
                placeholder='Enter password'
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              />
              <button onClick={e => handleTogglePassword(e)}> {passwordShown ? (<FontAwesomeIcon icon={faEyeSlash} />) : (<FontAwesomeIcon icon={faEye} />)} </button>
            </div>
        </div>
        <div className='form-buttons'>
            <button type='submit' className='action-button'>
            Login
            </button>
            <button className='action-button' onClick={(e) => handleForgotPassword(e)}>
                Forgot password
            </button>
        </div>
        <p>Don't have an account? Register one <Link to={"/registration"}>here</Link></p>
        {error && <div className='error-message'>{error}</div>}
      </form>
    </div>
  );
}

export default LoginPage;


