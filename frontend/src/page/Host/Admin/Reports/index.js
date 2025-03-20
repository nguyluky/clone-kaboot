import React from 'react';
import SessionList from '../../../../components/SessionList';
import './Reports.css';

export default function Reports() {
  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Session Reports</h1>
        <p>View analytics and statistics for all your quiz sessions</p>
      </div>
      
      <div className="reports-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="summary-content">
            <h3>148</h3>
            <p>Total Participants</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="summary-content">
            <h3>225</h3>
            <p>Total Minutes</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="summary-content">
            <h3>77.8%</h3>
            <p>Average Score</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="summary-content">
            <h3>5</h3>
            <p>Sessions Conducted</p>
          </div>
        </div>
      </div>
      
      <SessionList />
    </div>
  );
}
