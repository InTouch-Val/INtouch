//@ts-nocheck
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../axios';
import '../../css/registration.css';

//TODO: PopUp windows

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptPolicy: false,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      setError(
        'Password must contain letters, numbers, and no more than 3 consecutive identical characters.',
      );
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

    // Преобразование полей для отправки на сервер
    const requestData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      accept_policy: formData.acceptPolicy,
    };

    try {
      await API.post('users/', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      navigate('/welcome-to-intouch');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again. Email:' + error.response?.data?.email[0]);
    }
  };

  return (
    <div className="registration-page">
      <form className="registration-form" onSubmit={handleSubmit}>
        <img
          alt="in"
          src="https://i122.fastpic.org/big/2023/1030/7b/1e679a924edf77196513a8491eb5f37b.jpg"
          width="140px"
          border="0"
        />
        <div className="input-fields">
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
        </div>
        <button type="submit" className="action-button">
          Register
        </button>
        <p>
          Already have an account? <Link to={'/login'}>Log in</Link>
        </p>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export { RegistrationForm };
