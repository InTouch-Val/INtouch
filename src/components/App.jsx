import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom"; // Заменили Link на NavLink
import "../css/app.css";
import { useAuth } from "../service/authContext";

function App() {
  const { currentUser, logout, isLoading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login'); 
    }
  }, [currentUser, isLoading, navigate]);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <div className="app-container">
      <div className="side-bar">
        <div className="user-profile">
          <img
            className="user-avatar"
            src={currentUser?.photo}
            alt="Something"
          />
          <h3>
            {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
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
