import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmEmailSuccess = () => {
  return (
    <div className="email-confirmation">
      <h1>Your Email Has Been Successfully Confirmed!</h1>
      <p>Congratulations! You're all set to start using your account.</p>
      <Link to="/" className="btn btn-primary">Go to Dashboard</Link>
    </div>
  );
};

export default ConfirmEmailSuccess;
