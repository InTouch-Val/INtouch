//@ts-nocheck
import { useState, createRef, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../service/authContext";
import { API } from "../../../service/axios";
import "../../../css/settings.scss";
import useMobileWidth from "../../../utils/hook/useMobileWidth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../stories/buttons/Button";

export const SecurityTab = () => {
  const isMobileWidth = useMobileWidth();
  const { currentUser } = useAuth();

  const [userPassword, setUserPassword] = useState({
    password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserPassword({
      ...userPassword,
      [name]: value,
    });
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(`user/update/password/`, userPassword);
      setMessage(response.data.message);
      setShowSuccessAlert(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
    } catch (e) {
      console.error("response.data.message", e.response.data.new_password);
      setMessage(
        "Error updating password: " + e.response.data.new_password.join(" "),
      );
      setShowErrorAlert(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDeleteProfile = async () => {
    try {
      const response = await API.get(`user/delete/`);
      console.log(response);
      setMessage(response.data.message);
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (e) {
      console.error(e);
      setMessage("Error deleting profile: " + e.data?.message);
    }
  };

  return (
    <div className="security-tab">
      <div className="security-tab_wrapper">
        <h2>Change Password</h2>
        <div className="change-password-form">
          <form onSubmit={handleSubmit}>
            <label>Current Password</label>
            <div className="change-password-form_wrapper">
              <input
                type="password"
                placeholder="***********"
                name="password"
                value={userPassword.password}
                onChange={handleChange}
                className="settings-input"
              />

              <span className="input__container_icon">
                <FontAwesomeIcon
                  icon={faPencil}
                  style={{ color: "#417D88", paddingRight: "5px" }}
                  size="fa-lg"
                />
              </span>
            </div>

            <label>New Password</label>
            <div className="change-password-form_wrapper">
              <input
                type="password"
                placeholder="***********"
                name="new_password"
                value={userPassword.new_password}
                onChange={handleChange}
                className="settings-input"
              />
              <span className="input__container_icon">
                <FontAwesomeIcon
                  icon={faPencil}
                  style={{ color: "#417D88", paddingRight: "5px" }}
                  size="fa-lg"
                />
              </span>
            </div>

            <label>Confirm New Password</label>
            <div className="change-password-form_wrapper">
              <input
                type="password"
                placeholder="***********"
                name="confirm_new_password"
                value={userPassword.confirm_new_password}
                onChange={handleChange}
                className="settings-input"
              />
              <span className="input__container_icon">
                <FontAwesomeIcon
                  icon={faPencil}
                  style={{ color: "#417D88", paddingRight: "5px" }}
                  size="fa-lg"
                />
              </span>
            </div>

            <Button
              buttonSize="large"
              fontSize="medium"
              label={isMobileWidth ? "Save" : "Save Changes"}
              type="submit"
            />
          </form>
          {showSuccessAlert && message && (
            <div className="success-message">{message}</div>
          )}
          {showErrorAlert && message && (
            <div className="error-message">{message}</div>
          )}
        </div>
      </div>
      <div className="danger-zone">
        <h2>Danger zone</h2>
        <button onClick={handleModalToggle}>
          {isMobileWidth ? "Delete Profile" : "Delete Profile Forever"}
        </button>
        {showModal && (
          <div className="modal-overlay" onClick={handleModalToggle}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-modal-button"
                onClick={handleModalToggle}
              >
                &times;
              </button>
              <div className="delete-modal-div">
                <p className="delete-modal__text">
                  Are you sure you want to delete your profile forever? <br />
                  <strong>This action is irrevertable!</strong>
                </p>
                {currentUser.user_type == "doctor" && (
                  <div className="delete-modal__text">
                    Deleting your profile will leave your published assignments
                    public. To remove them, please delete assignments in the “My
                    Tasks” section.
                  </div>
                )}
                <div>
                  <button className="action-button" onClick={handleModalToggle}>
                    Cancel
                  </button>
                  <button
                    className="action-button delete"
                    onClick={handleDeleteProfile}
                  >
                    {isMobileWidth ? " Delete" : " Delete Forever"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
