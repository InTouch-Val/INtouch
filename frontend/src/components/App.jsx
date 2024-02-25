import { useState, useCallback, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faGear,
  faUser,
  faList,
  faBookMedical,
  faNoteSticky,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../service/authContext';
import '../css/app.css';
import HeadlinerImg from './psy/HeadlinerImg/HeadlinerImg';

function App() {
  const { currentUser, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showHeadliner, setShowHeadliner] = useState(false); // Состояние для отображения блока кода

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const isDoctor = currentUser?.user_type === 'doctor';

  useEffect(() => {
    if (!isLoading && !currentUser) {
      handleLogout();
    }
  }, [currentUser, isLoading, handleLogout]);

  return (
    <div className="app-container">
      <div className="side-bar">
        <div className="user-profile">
          <img className="user-avatar" src={currentUser?.photo} alt="Something" />
          <h3>
            {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
          </h3>
        </div>
        <div className="menu upper">
          <nav>
            {isDoctor && (
              <ul>
                <li>
                  <NavLink to="/clients" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <FontAwesomeIcon icon={faUser} /> Clients
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assignments"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <FontAwesomeIcon icon={faList} /> Assignments
                  </NavLink>
                </li>
              </ul>
            )}
            {!isDoctor && (
              <ul>
                <li>
                  <NavLink
                    to="/my-assignments"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <FontAwesomeIcon icon={faList} /> Assignments
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-diary"
                    className={({ isActive }) => 'disabled' + (isActive ? 'active' : '')}
                  >
                    <FontAwesomeIcon icon={faBookMedical} /> Diary
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-notes"
                    className={({ isActive }) => 'disabled' + (isActive ? 'active' : '')}
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
              <li>
                <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <FontAwesomeIcon icon={faGear} /> Settings
                </NavLink>
              </li>
              {/* <li>
                <NavLink to="/support" className={({ isActive }) => (isActive ? "active" : "")}>
                  Support
                </NavLink>
              </li> */}

              <li>
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
        {showHeadliner && <HeadlinerImg />}
      </div>
    </div>
  );
}

export { App };
