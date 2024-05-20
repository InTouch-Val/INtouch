//@ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../axios";
import { useAuth } from "../authContext";
import "../../css/registration.css";
import { isValidEmail, isValidPassword } from "./regex";
import eyeIcon from "../../images/icons/eye.svg";
import eyeSlashIcon from "../../images/icons/eyeSlash.svg";
import logo from "../../images/LogoBig.svg";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Использование useAuth
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "", login: "" });
  const [passwordShown, setPasswordShown] = useState(false);
  const [isValidCredentials, setIsValidCredentials] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [waitTime, setWaitTime] = useState(60);
  const numberOfMaxLoginAttempts = 3;

  const handleCredentialsBlur = (field, value) => {
    let newError = { ...error };
    if (field === "email" && !isValidEmail(value)) {
      newError.email =
        "Please make sure your email address is in the format        example@example.com";
    } else if (field === "password" && !isValidPassword(value)) {
      newError.password = "Password must be at least 8 characters long.";
    } else {
      if (field === "email") {
        newError.email = "";
      } else if (field === "password") {
        newError.password = "";
      }
    }
    setError(newError);
    setIsValidCredentials(!newError.email && !newError.password);
  };

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    let timerId;
    if (loginAttempts >= numberOfMaxLoginAttempts) {
      timerId = setInterval(() => {
        setWaitTime((prevTime) => prevTime - 1);
        if (waitTime === 0) {
          clearInterval(timerId);
          setLoginAttempts(0);
        }
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [loginAttempts, waitTime]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Если количество попыток достигло 3, отключаем кнопку входа
    if (loginAttempts >= numberOfMaxLoginAttempts) {
      return;
    }

    // Очищаем ошибки перед попыткой входа
    setError({ email: "", password: "", login: "" });

    try {
      const requestData = {
        username: credentials.email.trim(),
        password: credentials.password.trim(),
      };

      const response = await API.post("token/", requestData);

      if (response.status === 200) {
        login(response.data.access, response.data.refresh);
        navigate("/");
        // Сбрасываем количество попыток и время ожидания при успешном входе
        setLoginAttempts(0);
        setWaitTime(60);
      } else {
        setError({ ...error, login: "Something went wrong. Please try again" });
        setLoginAttempts(loginAttempts + 1);
      }
    } catch (error) {
      const message =
        error.response?.data.detail || "An error occurred while logging in.";
      // Добавляем ошибку ввода в состояние
      setError({ ...error, login: message });
      console.error("Login error:", error);
      setLoginAttempts(loginAttempts + 1);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    navigate("/password-reset-requested");
  };

  return (
    <div className="registration-page">
      <form className="registration-form" onSubmit={handleLogin}>
        <img alt="inTouch Logo" src={logo} className="login-logo" />
        <div className="input-fields login">
          <input
            className={`input ${error.email || error.login ? "error" : ""}`}
            type="text"
            id="email"
            placeholder="Email"
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            onBlur={(e) => handleCredentialsBlur("email", e.target.value)}
            required
          />

          <div className="password-field">
            <input
              className={`input ${error.email || error.login ? "error" : ""}`}
              type={passwordShown ? "text" : "password"}
              id="password"
              placeholder="Password"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              onBlur={(e) => handleCredentialsBlur("password", e.target.value)}
            />
            <button type="button" onClick={(e) => handleTogglePassword(e)}>
              {passwordShown ? (
                <img src={eyeIcon} alt="eye-slash-icon" />
              ) : (
                <img src={eyeSlashIcon} alt="eye-icon" />
              )}
            </button>
          </div>
        </div>
        <button
          type="button"
          className="forgot-button"
          onClick={(e) => handleForgotPassword(e)}
        >
          Forgot password?
        </button>
        <div className="error__text error__text_login">
          {error.email && <div>{error.email}</div>}
          {error.password && <div>{error.password}</div>}
          {error.login && <div>{error.login}</div>}
          {loginAttempts >= numberOfMaxLoginAttempts && (
            <div>
              Too many login attempts. Please try again in {waitTime} seconds.
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="action-button action-button_register-login"
            disabled={
              !isValidCredentials || loginAttempts >= numberOfMaxLoginAttempts
            }
          >
            Login
          </button>
        </div>
        <p className="link">
          Don't have an account? Register one{" "}
          <Link to="/registration">here</Link>
        </p>
      </form>
    </div>
  );
}

export { LoginPage };
