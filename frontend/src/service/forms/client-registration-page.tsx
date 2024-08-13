//@ts-nocheck
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../axios";
import { useAuth } from "../authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../css/registration.css";
import logo from "../../images/logo.svg";

function ClientRegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = location.state || {};

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    API.get(`/get-user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        setFirstName(response.data[0].first_name);
        setLastName(response.data[0].last_name);
        setEmail(response.data[0].email);
        setUserId(response.data[0].id);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
      });
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }
    if (password.length < 8) {
      setError("You must have at least 8 characters in your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await API.put(
        `update-client/${userId}/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          confirm_password: confirmPassword,
          accept_policy: acceptTerms,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        setError("Updated Sueccessfully");
        setTimeout(() => {
          login(
            localStorage.getItem("accessToken"),
            localStorage.getItem("refreshToken"),
          );
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred during the client update.",
      );
    }
  };

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  const handleToggleConfirmPassword = (e) => {
    e.preventDefault();
    setConfirmPasswordShown(!confirmPasswordShown);
    console.log(confirmPasswordShown);
  };

  return (
    <div className="registration-page">
      <div onSubmit={handleSubmit} className="registration-client">
        <img src={logo} className="registration__logo" alt="logo"></img>
        <h2 className="registration__header">
          {`Hello, ${firstName + " " + lastName}!`}
          <br />
          Welcome to INtouch!
        </h2>
        <h3 className="registration__text">Set Your Password to Proceed</h3>
        <form className="registration__form">
          <div className="registration__password-field">
            <input
              className="registartion-client__input"
              type={passwordShown ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              className="registration__button-eye"
              type="button"
              onClick={(e) => handleTogglePassword(e)}
            >
              {" "}
              {passwordShown ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}{" "}
            </button>
          </div>
          <div className="registration__password-field">
            <input
              type={confirmPasswordShown ? "text" : "password"}
              className="registartion-client__input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              className="registration__button-eye"
              type="button"
              onClick={(e) => handleToggleConfirmPassword(e)}
            >
              {" "}
              {confirmPasswordShown ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}{" "}
            </button>
          </div>
          <div className="registration-client__checkbox-box">
            <input
              className="registration-client__checkbox-input"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label className="registration-client__checkbox">
              I agree to the{" "}
              <a href="https://intouch.care/terms-conditions" target="_blank">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="https://intouch.care/privacypolicy" target="_blank">
                Privacy Policy
              </a>
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-buttons">
            <button type="submit" className="registration__button">
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ClientRegistrationPage };
