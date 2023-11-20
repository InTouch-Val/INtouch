import React, { useState } from 'react';
import API from '../axios';

const SetNewUserPassword = ({ accessToken }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = () => {
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
          //confirm_new_password: confirmPassword
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.status === 200) {
          setError('Password set successfully!');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        setError('Error resetting password:', error);
      }
    }
  };

  return (
    <div className="set-password">
      <form onSubmit={handleSubmit}>
        <h2>Set Your New Password</h2>
        
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
};

export default SetNewUserPassword;
