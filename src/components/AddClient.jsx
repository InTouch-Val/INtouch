import React, { useState } from 'react';
import API from '../service/axios'; 
import "../css/add-client.css"
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await API.post('clients/add/', { 
            first_name: clientData.firstName,
            last_name: clientData.lastName,
            email: clientData.email
        });
  
        if (response.status === 200) {
          setSuccess(true);
          setError('');
          setTimeout(() => {
            navigate('/clients');
          }, 1500);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setError('User with such email already exists');
        } else {
          setError('Error adding client occured');
        }
        setSuccess(false);
      }
  };

  return (
    <div className="add-client-form-container">
      <form className="add-client-form" onSubmit={handleSubmit}>
        <h2>Add Client</h2>
        <input
          type="text"
          name="firstName"
          value={clientData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={clientData.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={clientData.email}
          onChange={handleInputChange}
          placeholder="Client's Email"
          required
        />
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Client created succesfully!</div>}
        <button type="submit">Add Client</button>
      </form>

    </div>
  );
};

export default AddClient;
