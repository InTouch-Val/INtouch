import React, { useState } from 'react';
import API from '../service/axios'; 
import "../css/add-client.css"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../service/authContext';

const AddClient = () => {
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const {updateUserData} = useAuth()

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
          await updateUserData()
          setTimeout(() => {
            navigate('/clients');
          }, 1500);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            
            const retryResponse = await API.post('clients/add/', {
              first_name: clientData.firstName,
              last_name: clientData.lastName,
              email: clientData.email
            });
      
            if (retryResponse.status === 200) {
              setSuccess(true);
              setError('');
              await updateUserData();
              setTimeout(() => {
                navigate('/clients');
              }, 1500);
            }
          } catch (retryError) {
            // Обработка ошибок повторного запроса, если он тоже не удался
            setError('Error adding client occurred after retry');
          }
        } else if (error.response && error.response.status === 400) {
          setError('User with such email already exists');
        } else {
          setError('Error adding client occurred');
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
