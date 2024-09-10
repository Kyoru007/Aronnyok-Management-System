import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './lobby.css';
import axios from 'axios';

const Lobby = () => {
    const [collapsed, setCollapsed] = useState(false);
    axios.defaults.withCredentials = true
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const getWelcomeMessage = () => {
        switch (location.pathname) {
            case '/lobby/employee':
                return 'Welcome to Manage Employees';
            case '/lobby/category':
                return 'Welcome to Category Management';
            case '/lobby/profile':
                return 'Welcome to Your Profile';
            case '/lobby/university':
                return 'Welcome to University Management';
            case '/lobby':
                return 'Welcome to the Lobby';
            default:
                return 'Welcome';
        }
    };

    const handleLogout = () => {

        // Clear user authentication data (like token) from localStorage or sessionStorage
        axios.get('http://localhost:3000/auth/logout')
            .then(result => {
                if (result.data.Status) {
                    navigate('/bosslogin', { replace: true });
                }
                localStorage.removeItem('authToken'); // Example: remove the auth token
                sessionStorage.removeItem('authToken'); // If stored in sessionStorage

                // Redirect to login page
                navigate('/bosslogin'); // Adjust the path as needed
            })
    };

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Lobby</a>
                <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
            </nav>

            <div className="d-flex">
                <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <div className="collapse-btn" onClick={toggleSidebar}>
                        {collapsed ? 'Expand' : 'Collapse'}
                    </div>
                    <nav className="nav flex-column">
                        <Link className="nav-link" to="/lobby">
                            <span>Lobby</span>
                        </Link>
                        <Link className="nav-link" to="/lobby/employee">
                            <span>Manage Employees</span>
                        </Link>
                        <Link className="nav-link" to="/lobby/category">
                            <span>Category Management</span>
                        </Link>
                        <Link className="nav-link" to="/lobby/university">
                            <span>University Management</span>
                        </Link>
                        <Link className="nav-link" to="/lobby/profile">
                            <span>Your Profile</span>
                        </Link>
                        {/* Add onClick to trigger logout */}
                        <Link className="nav-link" to="#" onClick={handleLogout}>
                            <span>Logout</span>
                        </Link>
                    </nav>
                </div>

                <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                    <div className="welcome-message">
                        <h1>{getWelcomeMessage()}</h1>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Lobby;
