//@ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../axios";
import { isValidPassword } from "./regex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../authContext";
import logo from "../../images/LogoBig.svg";

function SetNewUserPassword({ accessToken }) {
  const { currentUser } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ password: "", server: "" });
  const [passwordShown, setPasswordShown] = useState(false);
  const [isValidCredentials, setIsValidCredentials] = useState(false);
  const numberOfMinLengthOfPassword = 8;
  const numberOfMaxLengthOfPassword = 128;

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  const navigate = useNavigate();

  const validatePassword = () => {
    let newError = { password: "", server: "" };
    if (!isValidPassword(password)) {
      newError.password =
        "Password must contain letters, numbers, at least 1 uppercase letter, 1 lowercase letter, and 1 digit, no more than 3 consecutive identical characters and must be at least 8 characters long.";
    } else if (
      currentUser &&
      password.toLowerCase().includes(currentUser.first_name.toLowerCase())
    ) {
      newError.password = "The password is too similar to your first name";
    } else if (
      currentUser &&
      password.toLowerCase().includes(currentUser.last_name.toLowerCase())
    ) {
      newError.password = "The password is too similar to your last name";
    } else if (
      password !== confirmPassword &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      newError.password =
        "Password and confirmation password do not match. Please try again.";
    }
    setError(newError);
    setIsValidCredentials(!newError.password && password === confirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ password: "", server: "" });

    if (validatePassword()) {
      try {
        const response = await API.post(
          "password/reset/complete/",
          {
            new_password: password,
            confirm_new_password: confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.status === 200) {
          setError({ ...error, server: "Password set successfully!" });
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        if (error.response?.data?.detail) {
          setError({ ...error, server: error.response?.data?.detail });
        } else {
          setError({
            ...error,
            server: "Error resetting password. Please try again.",
          });
        }
      }
    }
  };

  return (
    <div className="welcome-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <img alt="inTouch logo" src={logo} className="reset-logo" />
        <h1 className="reset-password__heading reset-password__heading_reset">
          Set Your New Password
        </h1>

        <div className="input-fields login">
          <div className="password-field">
            <input
              className={`input ${error.password ? "error" : ""}`}
              type={passwordShown ? "text" : "password"}
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              value={password}
              minLength={numberOfMinLengthOfPassword}
              maxLength={numberOfMaxLengthOfPassword}
            />
            <button type="button" onClick={(e) => handleTogglePassword(e)}>
              {passwordShown ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
          <div className="password-field">
            <input
              className={`input ${error.password ? "error" : ""}`}
              type={passwordShown ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              onBlur={validatePassword}
              minLength={numberOfMinLengthOfPassword}
              maxLength={numberOfMaxLengthOfPassword}
            />
            <button type="button" onClick={(e) => handleTogglePassword(e)}>
              {passwordShown ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
        </div>

        <div className="error__text error__text_login">
          {error.password && <div>{error.password}</div>}{" "}
          {error.server && <div>{error.server}</div>}
        </div>

        <button
          type="submit"
          className="action-button action-button_register-login"
          disabled={!isValidCredentials}
        >
          Set Password
        </button>
      </form>
    </div>
  );
}

export { SetNewUserPassword };
