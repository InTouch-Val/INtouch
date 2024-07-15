//@ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../axios";
import "../../css/registration.css";
import { isValidEmail, isValidPassword, isValidName } from "./regex";
import eyeIcon from "../../images/icons/eye.svg";
import eyeSlashIcon from "../../images/icons/eyeSlash.svg";
import logo from "../../images/LogoBig.svg";

function RegistrationForm() {
  const [successMessage, setSuccessMessage] = useState(false);
  const [passwordTooLong, setPasswordTooLong] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptPolicy: false,
  });
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({
    email: "",
    password: "",
    name: "",
    second: "",
    terms: "",
  });

  const [passwordShown, setPasswordShown] = useState(false);
  const [isValidCredentials, setIsValidCredentials] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  const navigate = useNavigate();
  const numberOfMinLengthOfPassword = 8;
  const numberOfMaxLengthOfPassword = 128;
  const numberOfMinLengthOfName = 2;
  const numberOfMaxLengthOfName = 50;

  const handleCredentialsBlur = (
    field: "email" | "password" | "name" | "second",
    value: string
  ): void => {
    let newError = { ...validationError };

    const trimmedValue = value.trim();

    if (field === "email" && !isValidEmail(trimmedValue)) {
      newError.email =
        "Please make sure your email address is in the format example@example.com";
    } else if (field === "password" && isValidPassword(trimmedValue)) {
      if (passwordTooLong) {
        newError.password = `Password must be at least ${numberOfMinLengthOfPassword} characters long and cannot exceed ${numberOfMaxLengthOfPassword} characters.`;
      } else if (
        trimmedValue.toLowerCase().includes(formData.firstName.toLowerCase()) ||
        trimmedValue.toLowerCase().includes(formData.lastName.toLowerCase())
      ) {
        newError.password = "The password is too similar to your name";
      } else {
        if (isValidPassword(trimmedValue)) {
          newError.password = "";
        }
      }
    } else if (field === "password" && !isValidPassword(trimmedValue)) {
      const hasUppercase = /[A-Z]/.test(trimmedValue);
      const hasLowercase = /[a-z]/.test(trimmedValue);
      const hasDigit = /\d/.test(trimmedValue);

      if (
        trimmedValue.length < numberOfMinLengthOfPassword ||
        trimmedValue.length > numberOfMaxLengthOfPassword
      ) {
        newError.password = `Password must be at least ${numberOfMinLengthOfPassword} characters long and cannot exceed ${numberOfMaxLengthOfPassword} characters.`;
      } else if (!hasUppercase || !hasLowercase || !hasDigit) {
        newError.password =
          "Password must contain at least one uppercase letter, one lowercase letter, and one digit.";
      } else if (/\s/.test(trimmedValue)) {
        newError.password = "Spaces are not allowed in your password";
      } else {
        newError.password =
          "Password can only contain Latin letters, Arabic numerals, and the characters: ~!? @ # $ % ^ & * _ - + ( ) [ ] { } > < / \\ | '., : ;";
      }
    } else if (
      (field === "firstName" || field === "lastName") &&
      !isValidName(trimmedValue)
    ) {
      if (
        trimmedValue.length < numberOfMinLengthOfName ||
        trimmedValue.length > numberOfMaxLengthOfName
      ) {
        if (field === "firstName") {
          newError.name = `Please write a valid name. Only ${numberOfMinLengthOfName}-${numberOfMaxLengthOfName} letters are allowed.`;
        } else {
          newError.second = `Please write a valid second name. Only ${numberOfMinLengthOfName}-${numberOfMaxLengthOfName} letters are allowed.`;
        }
      } else {
        if (field === "firstName") {
          newError.name = `Please write a valid name. Only ${numberOfMinLengthOfName}-${numberOfMaxLengthOfName} letters are allowed.`;
        } else {
          newError.second = `Please write a valid name. Only ${numberOfMinLengthOfName}-${numberOfMaxLengthOfName} letters are allowed.`;
        }
      }
    } else {
      if (field === "email") {
        newError.email = "";
      } else if (field === "password") {
        newError.password = "";
      } else if (field === "firstName") {
        newError.name = "";
      } else if (field === "lastName") {
        newError.second = "";
      }
    }
    setValidationError(newError);

    setFormData({
      ...formData,
      [field]: trimmedValue,
    });
  };

  useEffect(() => {
    {
      setIsValidCredentials(
        !validationError.email &&
          !validationError.name &&
          !validationError.password &&
          !validationError.second &&
          !validationError.terms
      );
    }
  }, [validationError]);

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "acceptPolicy") {
      setShowTermsError(!checked);

      if (checked) {
        setValidationError({
          ...validationError,
          terms: "",
        });
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "password") {
      if (value.length > numberOfMaxLengthOfPassword) {
        setValidationError({
          ...validationError,
          password: `Password must be at least ${numberOfMinLengthOfPassword} characters long and cannot exceed ${numberOfMaxLengthOfPassword} characters.`,
        });
      } else {
        setValidationError({
          ...validationError,
          password: "",
        });
      }
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("Text");

    let trimmedText = pastedText.substring(0, numberOfMaxLengthOfPassword);

    setFormData((prevFormData) => ({
      ...prevFormData,
      password: trimmedText,
    }));

    if (pastedText.length > numberOfMaxLengthOfPassword) {
      setPasswordTooLong(true);
      setValidationError((prevValidationError) => ({
        ...prevValidationError,
        password: `Password must be at least 8 characters long and cannot exceed ${numberOfMaxLengthOfPassword} characters.`,
      }));
    } else {
      setPasswordTooLong(false);
      setValidationError((prevValidationError) => ({
        ...prevValidationError,
        password: "",
      }));
    }

    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!isValidName(formData.firstName)) {
      setValidationError({
        ...validationError,
        name: "Please use only latin characters, special characters are prohibited",
      });
      return;
    }

    if (!isValidName(formData.lastName)) {
      setValidationError({
        ...validationError,
        second:
          "Please use only latin characters, special characters are prohibited",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError({
        ...validationError,
        password: "Password and Confirm Password must match.",
      });
      return;
    }

    if (!formData.acceptPolicy) {
      setShowTermsError(true);
      setValidationError({
        ...validationError,
        terms: "Please accept the terms and conditions to continue",
      });
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
      await API.post("users/", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setSuccessMessage("Account is activated");
      navigate("/email-confirmation", { state: { emailData: formData.email } });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.email) {
        setValidationError({
          ...validationError,
          email: "This email address already exists. Please use a unique one.",
        });
      } else if (error.response?.data?.password) {
        setValidationError({
          ...validationError,
          password:
            error.response?.data?.password || "'This password is too common",
        });
      } else if (error.response?.status >= 500) {
        setError(
          "Some error occurs from the server, we’re fixing it. Sorry for inconvenience "
        );
      } else {
        setError("Account isn’t activated");
      }
    }
  };

  const isAnyFieldMissingOrInvalid = (): boolean => {
    const anyFieldMissingOrInvalid =
      !isValidCredentials ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password;

    const acceptPolicyNotAccepted = !formData.acceptPolicy && showTermsError;

    return anyFieldMissingOrInvalid || acceptPolicyNotAccepted;
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
            className={`input ${validationError.name ? "error" : ""}`}
            value={formData.firstName}
            onChange={handleChange}
            onBlur={(e) => handleCredentialsBlur("firstName", e.target.value)}
            required
            min={numberOfMinLengthOfName}
            max={numberOfMaxLengthOfName}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`input ${validationError.second ? "error" : ""}`}
            value={formData.lastName}
            onChange={handleChange}
            onBlur={(e) => handleCredentialsBlur("lastName", e.target.value)}
            required
            min={numberOfMinLengthOfName}
            max={numberOfMaxLengthOfName}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`input ${validationError.email ? "error" : ""}`}
            value={formData.email}
            onChange={handleChange}
            onBlur={(e) => handleCredentialsBlur("email", e.target.value)}
            required
          />
          <div className="password-field">
            <input
              className={`input ${validationError.password ? "error" : ""}`}
              type={passwordShown ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={(e) => handleCredentialsBlur("password", e.target.value)}
              onPaste={handlePaste}
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
              className={`input ${validationError.password ? "error" : ""}`}
              type={passwordShown ? "text" : "password"}
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
              className={`${showTermsError ? "error" : ""}`}
              type="checkbox"
              name="acceptPolicy"
              checked={formData.acceptPolicy}
              onChange={handleChange}
            />
            <a href="" className={`${showTermsError ? "error-text" : "terms"}`}>
              I agree with the terms and conditions
            </a>
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
          disabled={isAnyFieldMissingOrInvalid()}
        >
          Register
        </button>
        <p>
          Already have an account? <Link to={"/login"}>Log in</Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        {successMessage && (
          <div className="success-message">{successMessageText}</div>
        )}
      </form>
    </div>
  );
}

export { RegistrationForm };
