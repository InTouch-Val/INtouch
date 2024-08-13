//@ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import "shepherd.js/dist/css/shepherd.css"; //for onboarding
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faGear,
  faUser,
  faList,
  faBookMedical,
  faNoteSticky,
  faXmark,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../service/authContext";
import "../css/app.scss";
import { API } from "../service/axios";

export const loaderCheckToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  if (
    !accessToken &&
    location.pathname !== "/login" &&
    location.pathname !== "/registration"
  ) {
    window.location.href = "/login";
  }

  try {
    const request = API.post("/token/refresh/", { refresh: refreshToken });
    return request;
  } catch (e) {
    console.error(e);
  }
};

function App() {
  const { currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  const [sideBarOpened, setSideBarOpened] = useState(false);
  const handleSideBar = () => {
    sideBarOpened ? setSideBarOpened(false) : setSideBarOpened(true);
  };

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const isDoctor = currentUser?.user_type === "doctor";

  useEffect(() => {
    if (!isLoading && !currentUser) {
      handleLogout();
    }
  }, [currentUser, isLoading, handleLogout]);

  useEffect(() => {
    if (location.pathname === "/") {
      if (currentUser?.user_type === "doctor") {
        navigate("/clients");
      } else if (currentUser?.user_type === "client") {
        navigate("/my-assignments");
      }
    }
  }, [location.pathname, currentUser, navigate]);

  return (
    <div className="app-container">
      <span className="mobile-nav-header"></span>
      <div className={`side-bar ${sideBarOpened ? "opened" : ""}`}>
        <span
          className={`toggle-button ${sideBarOpened ? "opened" : ""}`}
          onClick={handleSideBar}
        >
          {sideBarOpened ? (
            <FontAwesomeIcon
              icon={faXmark}
              style={{ color: "#417D88" }}
              size="2xl"
            />
          ) : (
            <FontAwesomeIcon
              icon={faBars}
              style={{ color: "#417D88" }}
              size="xl"
            />
          )}
        </span>
        <div className="user-profile">
          <img
            className="user-avatar"
            src={currentUser?.photo}
            alt="Something"
          />
          <h3>
            {currentUser
              ? `${currentUser.first_name} ${currentUser.last_name}`
              : "Loading..."}
          </h3>
        </div>
        <div className="menu upper">
          <nav>
            {isDoctor && (
              <ul>
                <li onClick={() => setSideBarOpened(false)}>
                  <NavLink
                    to="/clients"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FontAwesomeIcon icon={faUser} /> Clients
                  </NavLink>
                </li>
                <li onClick={() => setSideBarOpened(false)}>
                  <NavLink
                    to="/assignments"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    id="onboarding_assignments_menu"
                  >
                    <FontAwesomeIcon icon={faList} /> Assignments
                  </NavLink>
                </li>
              </ul>
            )}
            {!isDoctor && (
              <ul>
                <li onClick={() => setSideBarOpened(false)}>
                  <NavLink
                    to="/my-assignments"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FontAwesomeIcon icon={faList} /> Assignments
                  </NavLink>
                </li>
                <li onClick={() => setSideBarOpened(false)}>
                  <NavLink
                    to="/my-diary"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FontAwesomeIcon icon={faBookMedical} /> Diary
                  </NavLink>
                </li>
                <li onClick={() => setSideBarOpened(false)}>
                  <NavLink
                    to="/my-notes"
                    className={({ isActive }) =>
                      "disabled" + (isActive ? "active" : "")
                    }
                  >
                    <FontAwesomeIcon icon={faNoteSticky} /> Notes
                  </NavLink>
                </li>
              </ul>
            )}
          </nav>
        </div>
        <div className="menu lower">
          <nav>
            <ul>
              <li onClick={() => setSideBarOpened(false)}>
                <NavLink
                  to="/settings"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FontAwesomeIcon icon={faGear} /> Settings
                </NavLink>
              </li>
              {/* <li>
                <NavLink to="/support" className={({ isActive }) => (isActive ? "active" : "")}>
                  Support
                </NavLink>
              </li> */}

              <li onClick={() => setSideBarOpened(false)}>
                <button id="logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export { App };
