import React from 'react';
import { useNavigate } from 'react-router';
import './Dashboard.css';

// Sample recent activity data
const recentActivities = [
  { id: 1, type: 'session', title: 'Marketing Class 101', date: '2023-08-15', participants: 24 },
  { id: 2, type: 'canvas', title: 'JavaScript Fundamentals', date: '2023-08-12', action: 'created' },
  { id: 3, type: 'session', title: 'Geography Finals', date: '2023-08-10', participants: 45 },
  { id: 4, type: 'canvas', title: 'Marketing Quiz', date: '2023-08-08', action: 'updated' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'session':
        return 'fas fa-play';
      case 'canvas':
        return 'fas fa-edit';
      default:
        return 'fas fa-bell';
    }
  };
  
  const getActivityDescription = (activity) => {
    if (activity.type === 'session') {
      return `Hosted session with ${activity.participants} participants`;
    } else if (activity.type === 'canvas') {
      return `Quiz ${activity.action}`;
    }
    return '';
  };
  
  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back!</h1>
          <p>Manage your quizzes, view reports, and create engaging content all in one place.</p>
        </div>
        <div className="quick-actions">
          <button className="action-button primary" onClick={() => navigate('/canva/new')}>
            <i className="fas fa-plus"></i> Create New Quiz
          </button>
          <button className="action-button secondary" onClick={() => navigate('/admin/quizzes')}>
            <i className="fas fa-list"></i> View All Quizzes
          </button>
          <button className="action-button secondary" onClick={() => navigate('/admin/report')}>
            <i className="fas fa-chart-line"></i> View Reports
          </button>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-palette"></i>
          </div>
          <div className="stat-info">
            <h3>6</h3>
            <p>Total Quizzes</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>128</h3>
            <p>Total Participants</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="stat-info">
            <h3>15</h3>
            <p>Sessions Conducted</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>24h</h3>
            <p>Total Play Time</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-info">
            <h3>8</h3>
            <p>Analytics Reports</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div className="activity-item" key={activity.id}>
                <div className="activity-icon">
                  <i className={getActivityIcon(activity.type)}></i>
                </div>
                <div className="activity-details">
                  <h4>{activity.title}</h4>
                  <p>{getActivityDescription(activity)}</p>
                </div>
                <div className="activity-date">
                  {activity.date}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="popular-quizzes-section">
          <div className="section-header">
            <h2>Most Popular Quizzes</h2>
            <button className="view-all-btn" onClick={() => navigate('/admin/quizzes')}>View All</button>
          </div>
          
          <div className="popular-quizzes-list">
            <div className="popular-quiz-card">
              <div className="popular-quiz-info">
                <h4>Marketing Quiz</h4>
                <p>78 participants • 72% avg. score</p>
              </div>
              <div className="popular-quiz-plays">
                <span className="plays-count">12</span>
                <span className="plays-label">plays</span>
              </div>
            </div>
            
            <div className="popular-quiz-card">
              <div className="popular-quiz-info">
                <h4>JavaScript Fundamentals</h4>
                <p>32 participants • 65% avg. score</p>
              </div>
              <div className="popular-quiz-plays">
                <span className="plays-count">8</span>
                <span className="plays-label">plays</span>
              </div>
            </div>
            
            <div className="popular-quiz-card">
              <div className="popular-quiz-info">
                <h4>World Geography</h4>
                <p>45 participants • 82% avg. score</p>
              </div>
              <div className="popular-quiz-plays">
                <span className="plays-count">5</span>
                <span className="plays-label">plays</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
