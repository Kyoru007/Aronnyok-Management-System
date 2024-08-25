import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './lobby.css';

const Lobby = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

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
                        <Link className="nav-link" to="/lobby/logout">
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
