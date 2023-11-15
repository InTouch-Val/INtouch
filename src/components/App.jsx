import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom"; // Заменили Link на NavLink
import "../css/app.css";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  const updateTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/refresh/', {
        refresh: refreshToken,
      });
  
      const { access: newAccessToken, refresh: newRefreshToken } = response.data;
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error updating tokens:', error);
      handleLogout(); 
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      updateTokens();
    } else {
      axios.get(`http://127.0.0.1:8000/api/v1/get-user/${accessToken}`)
        .then(response => {
          setUserDetails({
            first_name: response.data[0].first_name,
            last_name: response.data[0].last_name,
          });
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            updateTokens()
          } else {
            console.error('Error getting User Data:', error);
            handleLogout(); 
          }
        });
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
                  Clients
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
