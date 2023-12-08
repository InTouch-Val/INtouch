import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom"; // Заменили Link на NavLink
import "../css/app.css";
import { useAuth } from "../service/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRightFromBracket, faGear, faUser, faList, faBookMedical, faNoteSticky} from '@fortawesome/free-solid-svg-icons';

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

  const isDoctor = currentUser?.user_type == "doctor"

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
            {isDoctor && (
              <ul>
                <li>
                <NavLink to={`/clients`} activeClassName="active">
                 <FontAwesomeIcon icon={faUser} /> Clients
                </NavLink>
                </li>
                <li>
                <NavLink to={`/assignments`} activeClassName="active">
                 <FontAwesomeIcon icon={faList} /> Assignments
                </NavLink>
                </li>
              </ul>
            )}
            {!isDoctor && (
              <ul>
                <li>
                  <NavLink to={'/my-assignments'} activeClassName="active">
                  <FontAwesomeIcon icon={faList} /> Assignments
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'/my-diary'} activeClassName="active">
                  <FontAwesomeIcon icon={faBookMedical} /> Diary
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'/my-notes'} activeClassName="active">
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
              <li>
                <NavLink to={`/settings`} activeClassName="active">
                <FontAwesomeIcon icon={faGear} /> Settings
                </NavLink>
              </li>
              {/* <li>
                <NavLink to={`/support`} activeClassName="active">
                  Support
                </NavLink>
              </li> */}
              <li>
                <a onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
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
