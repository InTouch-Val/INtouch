import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../axios";
import "../../css/app.scss";
import "../../css/activateUser.scss";
import { useAuth } from "../authContext";

function ActivateUserPage() {
  let { userId, userToken } = useParams();
  const navigate = useNavigate();
  const [activationStatus, setActivationStatus] = useState("pending"); // New state for activation status
  const [showModal, setShowModal] = useState(false);
  const [doctor, setDoctor] = useState(false);
  const [answer, setAnswer] = useState(false);
  const { currentUser, login } = useAuth();

  useEffect(() => {
    if (window.location.pathname.includes("/activate-client/")) {
      if (localStorage.getItem("accessToken")) {
        setDoctor(currentUser?.user_type === "doctor");
        setShowModal(true);
      } else {
        setAnswer(true);
      }
    } else {
      setAnswer(true);
    }
  }, []);

  useEffect(() => {
    if (answer) {
      API.get(`confirm-email/${userId}/${userToken}/`)
        .then((response) => {
          if (response.data) {
            if (window.location.pathname.includes("/activate-client/")) {
              localStorage.setItem("refreshToken", response.data.refresh_token);
              localStorage.setItem("accessToken", response.data.access_token);
              navigate(`/client-registration`);
            }
            if (window.location.pathname.includes("/activate/")) {
              login(response.data.access_token, response.data.refresh_token);
              navigate("/");
            }
          }
        })
        .catch((error) => {
          console.error("Error activating your account", error);
          setActivationStatus("failed");
        });
    }
  }, [answer]);

  return (
    <div>
      {activationStatus === "pending" && (
        <h1>Account Activation In Progress...</h1>
      )}
      {activationStatus === "failed" && (
        <h1>Account Activation Failed. Please try again.</h1>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-div">
              <p>
                It seems that you are trying to create another account. <br />
                Would you like to continue as a client or stay logged into your
                psychologist account?
              </p>
              <div className="container__button">
                <button
                  className="action-button"
                  onClick={() => {
                    localStorage.clear();
                    setAnswer(true);
                  }}
                >
                  Continue as {doctor ? "Client" : "Different Client"}
                </button>
                <button className="action-button" onClick={() => navigate("/")}>
                  Stay as {doctor ? "Psychologist" : "Client"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { ActivateUserPage };
