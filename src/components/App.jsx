import React, {useState} from "react";
import { Outlet, Link } from "react-router-dom";
import "../css/app.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app-container">
        <div className="side-bar">
            <div className="user-profile">
                <img className="user-avatar" src="https://avatars.githubusercontent.com/aksmaxn4?s=120" alt="Something" />
                <h3>Jane <br/> Claus</h3>
            </div>
            <div className="menu">
                <nav>
                    <ul>
                        <li>
                            <Link to={`/clients`}>Clients</Link>
                        </li>
                        <li>
                            <Link to={`/assignments`}>Assignments</Link>
                        </li>
                        <li>
                            <Link to={`/community`}>Community</Link>
                        </li>
                        <li>
                            <Link to={`/storage`}>Storage</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div className="content">
            <Outlet />
        </div>  
    </div>
  )
}

export default App