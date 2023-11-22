import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom"; // Заменили Link на NavLink
import "../css/app.css";
import API from "../service/axios";

function App() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      API.get(`get-user/`)
        .then(response => {
          setUserDetails({
            first_name: response.data[0].first_name,
            last_name: response.data[0].last_name,
          });
        })
        .catch(error => {
          console.error('Error getting User Data:', error);
          handleLogout();
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUserDetails(null);
    navigate('/login');
  };

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
            {userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : 'Loading...'}
          </h3>
        </div>
        <div className="menu upper">
          <nav>
            <ul>
              <li>
                <NavLink to={`/clients`} activeClassName="active">
                <i className='fa fa-address-card'></i> Clients
                </NavLink>
              </li>
              <li>
                <NavLink to={`/assignments`} activeClassName="active">
                  Assignments
                </NavLink>
              </li>
              {/* <li>
                <NavLink to={`/community`} activeClassName="active">
                  Community
                </NavLink>
              </li> */}
              {/* <li>
                <NavLink to={`/storage`} activeClassName="active">
                  Storage
                </NavLink>
              </li> */}
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
              {/* <li>
                <NavLink to={`/support`} activeClassName="active">
                  Support
                </NavLink>
              </li> */}
              <li>
                <a onClick={handleLogout}>
                  Logout
                </a>
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
