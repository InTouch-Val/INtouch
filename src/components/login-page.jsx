import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/registration.css';


function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const requestData = {
            email: credentials.email.trim(),
            password: credentials.password.trim(),
        }

      const response = await axios.post('http://127.0.0.1:8000/api/v1/login/', requestData, {
        headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
      } );

      if (response.status === 200) {
        localStorage.setItem('userId', response.data.user);
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

  const handleForgotPassword = () => {
    // TODO: handle forgot password
  };

  return (
    <div className='registration-page'>
      <form className="registration-form" onSubmit={handleLogin}>
        <img src="https://i122.fastpic.org/big/2023/1030/7b/1e679a924edf77196513a8491eb5f37b.jpg" width="100px" border="0" />
          <input
            type='text'
            id='username'
            placeholder='Enter username'
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
        <p>Don't have an account? Register one <Link to={"/registration"}>here</Link></p>
        {error && <div className='error-message'>{error}</div>}
      </form>
    </div>
  );
}

export default LoginPage;
