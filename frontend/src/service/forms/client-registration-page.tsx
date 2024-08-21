import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../axios";
import { useAuth } from "../authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../css/registration.css";
import logo from "../../images/logo.svg";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { clientRegistrationSchema } from "../../utils/validationSchem/client-registartion-schema";
import { yupResolver } from "@hookform/resolvers/yup";

function ClientRegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
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

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  const handleToggleConfirmPassword = (e) => {
    e.preventDefault();
    setConfirmPasswordShown(!confirmPasswordShown);
    console.log(confirmPasswordShown);
  };

  const onSubmit = async (data) => {
    try {
      const response = await API.put(
        `update-client/${userId}/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: data.password,
          confirm_password: data.confirmPassword,
          accept_policy: data.acceptTerms,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setError("Updated Sueccessfully");
        setTimeout(() => {
          login(
            localStorage.getItem("accessToken") as string,
            localStorage.getItem("refreshToken") as string
          );
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred during the client update."
      );
    }
  };

  const methods = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    resolver: yupResolver(clientRegistrationSchema),
    mode: "onChange",
  });



  return (
    <div className="registration-page">
      <div
        onSubmit={methods.handleSubmit(onSubmit)}
        className="registration-client"
      >
        <img src={logo} className="registration__logo" alt="logo"></img>
        <h2 className="registration__header">
          {`Hello, ${firstName + " " + lastName}!`}
          <br />
          Welcome to INtouch!
        </h2>
        <h3 className="registration__text">Set Your Password to Proceed</h3>
        <form className="registration__form">
          <div className="registration__password-field">
            <Controller
              name="password"
              control={methods.control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`registartion-client__input ${methods.formState.errors.password ? "error" : ""}`}
                  type={passwordShown ? "text" : "password"}
                  placeholder="Password"
                />
              )}
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
            <Controller
              name="confirmPassword"
              control={methods.control}
              render={({ field }) => (
                <input
                  {...field}
                  type={confirmPasswordShown ? "text" : "password"}
                  className={`registartion-client__input ${methods.formState.errors.confirmPassword ? "error" : ""}`}
                  placeholder="Confirm Password"
                  required
                />
              )}
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
            <Controller
              name="acceptTerms"
              control={methods.control}
              render={({ field: { ...fieldProps } }) => (
                <input
                  className="registration-client__checkbox-input"
                  type="checkbox"
                  required
                  checked={fieldProps.value}
                  onChange={(e) => fieldProps.onChange(e.target.checked)}
                />
              )}
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
          <div className="error-container-text">
            {methods.formState.errors && (
              <span className={`error-text`}>
                {methods.formState.errors["password"]?.message || ""}
              </span>
            )}

            {methods.formState.errors && (
              <span className={`error-text`}>
                {methods.formState.errors["confirmPassword"]?.message || ""}
              </span>
            )}
            {methods.formState.errors && (
              <span className={`error-text`}>
                {methods.formState.errors["acceptTerms"]?.message || ""}
              </span>
            )}
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="registration__button"
              disabled={!methods.formState.isValid}
            >
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ClientRegistrationPage };
