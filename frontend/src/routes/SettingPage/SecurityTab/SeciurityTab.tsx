//@ts-nocheck
import { useState, createRef } from "react";
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
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      console.log(response.data);
      setMessage(response.data.message);
    } catch (e) {
      console.error(e);
      setMessage("Error updating password: " + e.data?.message);
    }
  };

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
          {message && <div className="success-message">{message}</div>}
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
