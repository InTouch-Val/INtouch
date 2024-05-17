import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../axios';
import '../../css/registration.css';
import { isValidEmail, isValidPassword } from './regex';
import eyeIcon from '../../images/icons/eye.svg';
import eyeSlashIcon from '../../images/icons/eyeSlash.svg';
import logo from '../../images/LogoBig.svg';

function RegistrationForm() {
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptPolicy: false,
  });
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState({
    email: '',
    password: '',
    name: '',
    second: '',
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [isValidCredentials, setIsValidCredentials] = useState(false);
  const navigate = useNavigate();
  const numberOfMinLengthOfPassword = 8;
  const numberOfMaxLengthOfPassword = 128;
  const numberOfMinLengthOfName = 2;
  const numberOfMaxLengthOfName = 50;

  const handleCredentialsBlur = (field, value) => {
    let newError = { ...validationError };
    if (field === 'email' && !isValidEmail(value)) {
      newError.email =
        'Please make sure your email address is in the format        example@example.com';
    } else if (field === 'password' && !isValidPassword(value)) {
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      if (
        value.length < numberOfMinLengthOfPassword ||
        value.length > numberOfMaxLengthOfPassword
      ) {
        newError.password =
          'Password must be at least 8 characters long and cannot exceed 128 characters.';
      } else if (!hasUppercase || !hasLowercase || !hasDigit) {
        newError.password =
          'Password must contain at least one uppercase letter, one lowercase letter, and one digit.';
      } else {
        newError.password =
          "Password can only contain Latin letters, Arabic numerals, and the characters: ~!? @ # $ % ^ & * _ - + ( ) [ ] { } > < / \\ | '., : ;";
      }
    } else if (
      (field === 'name' || field === 'second') &&
      (value.length < numberOfMinLengthOfName || value.length > numberOfMaxLengthOfName)
    ) {
      if (field === 'name') {
        newError.name = 'Please write a valid name. Only 2-50 letters are allowed.';
      } else {
        newError.second = 'Please write a valid second name. Only 2-50 letters are allowed.';
      }
    } else {
      if (field === 'email') {
        newError.email = '';
      } else if (field === 'password') {
        newError.password = '';
      } else if (field === 'name') {
        newError.name = '';
      } else if (field === 'second') {
        newError.second = '';
      }
    }
    setValidationError(newError);
    setIsValidCredentials(!newError.email && !newError.password);
  };

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError({
        ...validationError,
        password: 'Password and Confirm Password must match.',
      });
      return;
    }

    if (formData.password === formData.firstName || formData.password === formData.lastName) {
      setValidationError({
        ...validationError,
        password: 'The password is too similar to your name',
      });
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
      setSuccessMessage('Account is activated');
      navigate('/welcome-to-intouch');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.email[0]) {
        setError('This email address already exists. Please use a unique one.');
      } else if (error.response?.status >= 500) {
        setError('Some error occurs from the server, we’re fixing it. Sorry for inconvenience ');
      } else {
        setError('Account isn’t activated');
      }
    }
  };

  return (
    <div className="registration-page">
      <form className="registration-form" onSubmit={handleSubmit}>
        <img alt="inTouch logo" src={logo} className="registration-logo" />
        <div className="input-fields">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={`input ${validationError.name ? 'error' : ''}`}
            value={formData.firstName}
            onChange={handleChange}
            onBlur={(e) => handleCredentialsBlur('name', e.target.value)}
            required
            min={numberOfMinLengthOfName}
            max={numberOfMaxLengthOfName}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`input ${validationError.second ? 'error' : ''}`}
            value={formData.lastName}
            onChange={handleChange}
            onBlur={(e) => handleCredentialsBlur('second', e.target.value)}
            required
            min={numberOfMinLengthOfName}
            max={numberOfMaxLengthOfName}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`input ${validationError.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            onBlur={(e) => handleCredentialsBlur('email', e.target.value)}
            required
          />
          <div className="password-field">
            <input
              className={`input ${validationError.password ? 'error' : ''}`}
              type={passwordShown ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={(e) => handleCredentialsBlur('password', e.target.value)}
              required
              minLength={numberOfMinLengthOfPassword}
              maxLength={numberOfMaxLengthOfPassword}
            />
            <button type="button" onClick={(e) => handleTogglePassword(e)}>
              {passwordShown ? (
                <img src={eyeIcon} alt="eye-slash-icon" />
              ) : (
                <img src={eyeSlashIcon} alt="eye-icon" />
              )}
            </button>
          </div>
          <div className="password-field">
            <input
              className={`input ${validationError.password ? 'error' : ''}`}
              type={passwordShown ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={numberOfMinLengthOfPassword}
              maxLength={numberOfMaxLengthOfPassword}
            />
            <button type="button" onClick={(e) => handleTogglePassword(e)}>
              {passwordShown ? (
                <img src={eyeIcon} alt="eye-slash-icon" />
              ) : (
                <img src={eyeSlashIcon} alt="eye-icon" />
              )}
            </button>
          </div>
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
        <div className="error__text error__text_login">
          {validationError.email && <div>{validationError.email}</div>}
          {validationError.password && <div>{validationError.password}</div>}
          {validationError.name && <div>{validationError.name}</div>}
          {validationError.second && <div>{validationError.second}</div>}
        </div>
        <button
          type="submit"
          className="action-button action-button_register-login"
          disabled={!isValidCredentials}
        >
          Register
        </button>
        <p>
          Already have an account? <Link to={'/login'}>Log in</Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <div className="success-message">{successMessageText}</div>}
      </form>
    </div>
  );
}

export { RegistrationForm };
