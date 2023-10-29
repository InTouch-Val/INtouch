import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom"; // Заменили Link на NavLink
import "../css/app.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app-container">
      <div className="side-bar">
        <div className="user-profile">
          <img
            className="user-avatar"
            src="https://avatars.githubusercontent.com/aksmaxn4?s=120"
            alt="Something"
          />
          <h3>
            Jane <br /> Claus
          </h3>
        </div>
        <div className="menu upper">
          <nav>
            <ul>
              <li>
                <NavLink to={`/clients`} activeClassName="active">
                  Clients
                </NavLink>
              </li>
              <li>
                <NavLink to={`/assignments`} activeClassName="active">
                  Assignments
                </NavLink>
              </li>
              <li>
                <NavLink to={`/community`} activeClassName="active">
                  Community
                </NavLink>
              </li>
              <li>
                <NavLink to={`/storage`} activeClassName="active">
                  Storage
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="menu lower">
          <nav>
            <ul>
              <li>
                <NavLink to={`/settings`} activeClassName="active">
                  Settings
                </NavLink>
              </li>
              <li>
                <NavLink to={`/support`} activeClassName="active">
                  Support
                </NavLink>
              </li>
              <li>
                <NavLink to={`/logout`} activeClassName="active">
                  Logout
                </NavLink>
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

export default App;
