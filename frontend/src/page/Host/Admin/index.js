import React from 'react'
import './Admin.css'
import { Outlet, Link } from "react-router";

export default function Admin() {
    return (
        <div className="admin-container" data-color-mode="light">
            <div className="admin-side-bar">
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/admin/dashboard" className="sidebar-item">
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </Link>
                    <Link to="/admin/quizzes" className="sidebar-item">
                        <i className="fas fa-question-circle"></i>
                        <span>Quizzes</span>
                    </Link>
                    <Link to="/admin/report" className="sidebar-item">
                        <i className="fas fa-chart-line"></i>
                        <span>Reports</span>
                    </Link>
                    <Link to="/admin/settings" className="sidebar-item">
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                    </Link>
                </nav>
            </div> 
            <div className="admin-content">
                <Outlet />                
            </div>
        </div>
    )
}