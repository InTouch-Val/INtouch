import React, { useState } from 'react';
import axios from 'axios';
import '../css/registration.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptPolicy: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка наличия букв и цифр в пароле
    const passwordRegex = /^(?=(?:.*[a-zA-Z]+))(?=(?:.*\d+))(?!.*(.)\1{3,}).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain letters, numbers, and no more than 3 consecutive identical characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password must match.');
      return;
    }

    // Проверка согласия с политикой
    if (!formData.acceptPolicy) {
      setError('You must accept the terms and conditions.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/users/', formData);
      console.log(response.data);
      // Возможно, вам нужно выполнить дополнительные действия после успешной регистрации.
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className='registration-page'>
      <form className='registration-form' onSubmit={handleSubmit}>
      <img src="https://i122.fastpic.org/big/2023/1030/7b/1e679a924edf77196513a8491eb5f37b.jpg" width="160px" border="0" />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="8"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength="8"
        />
        <label>
          <input
            type="checkbox"
            name="acceptPolicy"
            checked={formData.acceptPolicy}
            onChange={handleChange}
          />
          I agree with the terms and conditions
        </label>
        <button type="submit">Register</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default RegistrationForm;
