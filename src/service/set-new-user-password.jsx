import React, { useState } from 'react';

const SetNewUserPassword = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // Handle password update logic here
      console.log('Password set successfully!');
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
