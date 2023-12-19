import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';

const SetNewUserPassword = ({ accessToken }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate()

  const validatePassword = () => {
    setError("")
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        const response = await API.post('password/reset/complete/', {
          new_password: password,
          confirm_new_password: confirmPassword
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.status === 200) {
          setError('Password set successfully!');
          setTimeout(() => {
            navigate('/login')
          }, 1500)
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        if (error.message) {
          setError(error.message);
        } else {
          setError('Error resetting password. Please try again.');
        }
      }
    }
  };

  return (
    <div className="welcome-container">
      <form className='registration-form' onSubmit={handleSubmit}>
        <h2>Set Your New Password</h2>
        
        <div>
          <label style={{fontSize: "16px"}}>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{width: '100%'}} 
          />
        </div>
        
        <div>
          <label style={{fontSize: "16px"}}>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{width: '100%'}} 
          />
        </div>
        
        {error && <p className="success-message">{error}</p>}
        
        <button type="submit" className='action-button'>Set Password</button>
      </form>
    </div>
  );
};

export default SetNewUserPassword;
