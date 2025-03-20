import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './SessionList.css';
import api from '../../services/fakeApi';
import Loading from '../common/Loading';
import Error from '../../components/common/Error';

// Sample data for demonstration

export default function SessionList() {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const navigate = useNavigate();
  const [sampleSessions, setSampleSessionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    api.getSessions().then(setSampleSessionDetails).catch(setError).finally(() => setLoading(false));
  }
    
  useEffect(() => {
    loadData();
  }, []);
  
  const handleViewSessionDetails = (id) => {
    navigate(`/admin/report/${id}`);
  };

      if (loading) {
        return <Loading message="Loading dashboard" subMessage="Fetching your quizzes and activity data" />;
    }

    if (error) {
        return (
            <Error
                title="Dashboard data unavailable"
                message={error}
                onRetry={loadData}
                onBack={() => navigate('/')}
            />
        );
    }


  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h2>Session Reports</h2>
        <div className="view-toggles">
          <button 
            className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <i className="fas fa-table"></i> Table View
          </button>
          <button 
            className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            <i className="fas fa-th-large"></i> Card View
          </button>
        </div>
      </div>
      
      <div className="session-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search sessions..." />
        </div>
        <select className="filter-dropdown">
          <option>All Quizzes</option>
          <option>Marketing Quiz</option>
          <option>JavaScript Fundamentals</option>
          <option>World Geography</option>
          <option>Science Quiz</option>
        </select>
        <select className="date-dropdown">
          <option>All Dates</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
      
      {viewMode === 'table' ? (
        <div className="sessions-table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Session Name</th>
                <th>Quiz</th>
                <th>Date</th>
                <th>Participants</th>
                <th>Avg. Score</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleSessions.map(session => (
                <tr key={session.id} onClick={() => handleViewSessionDetails(session.id)} style={{ cursor: 'pointer' }}>
                  <td>{session.name}</td>
                  <td>{session.quiz}</td>
                  <td>{session.date} <span className="session-time">{session.time}</span></td>
                  <td>{session.participants}</td>
                  <td>
                    <div className="score-container">
                      <div className="score-bar" style={{ width: `${session.avgScore}%` }}></div>
                      <span>{session.avgScore}%</span>
                    </div>
                  </td>
                  <td>{session.duration}</td>
                  <td>
                    <button className="table-action-btn" onClick={(e) => {
                      e.stopPropagation();
                      handleViewSessionDetails(session.id);
                    }}>
                      <i className="fas fa-chart-bar"></i>
                    </button>
                    <button className="table-action-btn">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="table-action-btn">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="session-cards">
          {sampleSessions.map(session => (
            <div className="session-card" key={session.id} onClick={() => handleViewSessionDetails(session.id)}>
              <div className="session-card-header">
                <h3>{session.name}</h3>
                <div className="session-actions">
                  <button className="action-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleViewSessionDetails(session.id);
                  }}>
                    <i className="fas fa-chart-bar"></i>
                  </button>
                  <button className="action-btn"><i className="fas fa-download"></i></button>
                  <button className="action-btn"><i className="fas fa-ellipsis-v"></i></button>
                </div>
              </div>
              <div className="session-card-body">
                <div className="session-info-item">
                  <i className="fas fa-question-circle"></i>
                  <span>{session.quiz}</span>
                </div>
                <div className="session-info-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{session.date} at {session.time}</span>
                </div>
                <div className="session-info-item">
                  <i className="fas fa-users"></i>
                  <span>{session.participants} participants</span>
                </div>
                <div className="session-info-item">
                  <i className="fas fa-clock"></i>
                  <span>{session.duration}</span>
                </div>
              </div>
              <div className="session-card-footer">
                <div className="score-label">Average Score</div>
                <div className="score-container">
                  <div className="score-bar" style={{ width: `${session.avgScore}%` }}></div>
                  <span className="score-value">{session.avgScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
