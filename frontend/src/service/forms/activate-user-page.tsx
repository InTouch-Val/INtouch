//@ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { API } from "../axios";
import "../../css/app.scss";

function ActivateUserPage() {
  let { userId, userToken } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activationStatus, setActivationStatus] = useState("pending"); // New state for activation status

  useEffect(() => {
    API.get(`confirm-email/${userId}/${userToken}/`)
      .then((response) => {
        if (response.data) {
          if (window.location.pathname.includes("/activate-client/")) {
            localStorage.setItem("refreshToken", response.data.refresh_token);
            localStorage.setItem("accessToken", response.data.access_token);
            navigate(`/client-registration`);
          }
        }
      })
      .catch((error) => {
        console.error("Error activating your account", error);
        setActivationStatus("failed");
      });
  }, []);

  return (
    <div>
      {activationStatus === "pending" && (
        <h1>Account Activation In Progress...</h1>
      )}
      {activationStatus === "failed" && (
        <h1>Account Activation Failed. Please try again.</h1>
      )}
    </div>
  );
}

export { ActivateUserPage };
