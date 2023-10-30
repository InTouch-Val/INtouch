import React, { useState } from 'react';
import axios from 'axios';
import '../css/registration.css';

function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1', credentials);

      if (response.status === 200) {
        setError('');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.error('Login error:', error);
        setError('An error occurred while logging in.');
      }
    }
  };

  const handleForgotPassword = () => {
    
  };

  return (
    <div className='registration-page'>
      <form className="registration-form" onSubmit={handleLogin}>
        <img src="https://i122.fastpic.org/big/2023/1030/7b/1e679a924edf77196513a8491eb5f37b.jpg" width="100px" border="0" />
          <input
            type='text'
            id='username'
            placeholder='Enter username'
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
          <input
            type='password'
            id='password'
            placeholder='Enter password'
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        <div className='form-buttons'>
            <button type='submit'>
            Login
            </button>
            <button onClick={handleForgotPassword}>
                Forgot password
            </button>
        </div>
        {error && <div className='error-message'>{error}</div>}
      </form>
    </div>
  );
}

export default LoginPage;
