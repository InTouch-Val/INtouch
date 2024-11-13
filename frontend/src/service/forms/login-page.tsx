import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../axios";
import { useAuth } from "../authContext";
import "../../css/registration.css";
import { isValidEmail, isValidPassword } from "./regex";
import eyeIcon from "../../images/icons/eye.svg";
import eyeSlashIcon from "../../images/icons/eyeSlash.svg";
import logo from "../../images/LogoBig.svg";
import React from "react";
import Button from "../../stories/buttons/Button";

function LoginPage() {
  //@ts-ignore
  const navigate = useNavigate();
  const { login } = useAuth(); // Использование useAuth
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "", login: "" });
  const [passwordShown, setPasswordShown] = useState(false);
  const [isValidCredentials, setIsValidCredentials] = useState(false);
  const [tooMuchLoginAttempts, setTooMuchLoginAttempts] = useState(false);
  const [waitTime, setWaitTime] = useState(60);
  const numberOfMinPassLegth = 8;

  const handleCredentialsBlur = (
    field: "email" | "password",
    value: string,
  ): void => {
    let newError = { ...error };
    if (field === "email" && !isValidEmail(value)) {
      newError.email =
        "Please make sure your email address is in the format        example@example.com";
    } else if (field === "password" && value.length < numberOfMinPassLegth) {
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

  const handleTogglePassword = (e): void => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    let timerId: number;
    if (tooMuchLoginAttempts) {
      timerId = setInterval(() => {
        setWaitTime((prevTime) => prevTime - 1);
        if (waitTime <= 0) {
          clearInterval(timerId);
          setTooMuchLoginAttempts(false);
        }
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [tooMuchLoginAttempts, waitTime]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Если количество попыток достигло 3, отключаем кнопку входа
    if (tooMuchLoginAttempts) {
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
        setTooMuchLoginAttempts(false);
        setWaitTime(60);
      } else {
        setError({ ...error, login: "Something went wrong. Please try again" });
      }
    } catch (error) {
      console.log(error);
      let message: string;
      if (error.response.status === 401) {
        message = "Invalid username or password. Please try again";
      } else if (error.response.status === 429) {
        message = "";
        setTooMuchLoginAttempts(true);
      } else {
        message =
          error.response?.data.detail || "An error occurred while logging in.";
      }
      // Добавляем ошибку ввода в состояние
      setError({ ...error, login: message });
      console.error("Login error:", error);
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
              className={`input ${error.password || error.login ? "error" : ""}`}
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
        <div className="error__text error__text_login">
          {error.email && <div>{error.email}</div>}
          {error.password && <div>{error.password}</div>}
          {error.login && <div>{error.login}</div>}
          {tooMuchLoginAttempts && (
            <div>
              Too many login attempts. Please try again in {waitTime} seconds.
            </div>
          )}
        </div>
        <button
          type="button"
          className="forgot-button"
          onClick={(e) => handleForgotPassword(e)}
        >
          Forgot password?
        </button>
 

        <div className="form-buttons">
          <Button
            buttonSize="large"
            fontSize="medium"
            label="Login"
            disabled={
              !isValidCredentials ||
              tooMuchLoginAttempts ||
              credentials.email.length === 0 ||
              credentials.password.length === 0
            }
            type="submit"
          />
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
