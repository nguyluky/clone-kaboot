import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './Dashboard.css';
import { dashboardApi } from '../../../../services/fakeDatabase';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [popularQuizzes, setPopularQuizzes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardApi.getStats();
        const quizzesData = await dashboardApi.getPopularQuizzes();
        const activityData = await dashboardApi.getRecentActivity();
        
        setStats(statsData);
        setPopularQuizzes(quizzesData);
        setRecentActivity(activityData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  
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
            <h3>{stats.totalQuizzes}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalParticipants}</h3>
            <p>Total Participants</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalSessions}</h3>
            <p>Sessions Conducted</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalPlayTime}</h3>
            <p>Total Play Time</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.reportsCount}</h3>
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
            {recentActivity.map(activity => (
              <div className="activity-item" key={activity.id}>
                <div className="activity-icon">
                  <i className={`fas ${activity.type === 'session' ? 'fa-play' : 'fa-edit'}`}></i>
                </div>
                <div className="activity-details">
                  <h4>{activity.name}</h4>
                  <p>
                    {activity.type === 'session' 
                      ? `Hosted session with ${activity.participants} participants` 
                      : `Quiz ${activity.action}`}
                  </p>
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
            {popularQuizzes.map(quiz => (
              <div className="popular-quiz-card" key={quiz.id}>
                <div className="popular-quiz-info">
                  <h4>{quiz.title}</h4>
                  <p>{quiz.participants} participants • {quiz.avgScore}% avg. score</p>
                </div>
                <div className="popular-quiz-plays">
                  <span className="plays-count">{quiz.plays}</span>
                  <span className="plays-label">plays</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
