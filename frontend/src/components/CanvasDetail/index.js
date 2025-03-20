import React, { useState } from 'react';
import './CanvasDetail.css';
import { useNavigate, useParams } from 'react-router';

// Sample data for demonstration
const sampleCanvas = {
  id: 1,
  title: 'Marketing Quiz',
  category: 'Business',
  description: 'A comprehensive quiz covering basic marketing concepts, strategies, and case studies.',
  createdBy: 'John Smith',
  lastModified: '2023-08-15',
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the 4 Ps of Marketing?',
      timeLimit: 60,
      points: 100,
      options: [
        { id: 'a', text: 'Price, Product, Promotion, Place' },
        { id: 'b', text: 'People, Process, Product, Price' },
        { id: 'c', text: 'Promotion, Place, People, Process' },
        { id: 'd', text: 'Product, Price, Process, People' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Which of these is NOT a marketing strategy?',
      timeLimit: 45,
      points: 75,
      options: [
        { id: 'a', text: 'Outbound Marketing' },
        { id: 'b', text: 'Inbound Marketing' },
        { id: 'c', text: 'Content Marketing' },
        { id: 'd', text: 'Financial Marketing' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 3,
      type: 'true-false',
      question: 'Digital marketing is more effective than traditional marketing in all scenarios.',
      timeLimit: 30,
      points: 50,
      options: [
        { id: 'a', text: 'True' },
        { id: 'b', text: 'False' }
      ],
      correctAnswer: 'b'
    }
  ],
  stats: {
    timesPlayed: 12,
    totalParticipants: 78,
    avgScore: 72,
    completionRate: 94,
    difficultyRating: 'Medium'
  }
};

export default function CanvasDetail() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleStartSession = () => {
    navigate(`/session/start/${id}`);
  };
  
  const handleEditCanvas = () => {
    navigate(`/canva/edit/${id}`);
  };
  
  const handleShareCanvas = () => {
    // In a real app, this would show a share dialog
    alert('Share functionality would be implemented here');
  };
  
  return (
    <div className="canvas-detail-container">
      <div className="canvas-detail-header">
        <div className="canvas-detail-title">
          <span className="canvas-category">{sampleCanvas.category}</span>
          <h1>{sampleCanvas.title}</h1>
          <p className="canvas-detail-meta">
            Created by {sampleCanvas.createdBy} • Last modified: {sampleCanvas.lastModified}
          </p>
        </div>
        <div className="canvas-detail-actions">
          <button className="action-button secondary" onClick={handleEditCanvas}>
            <i className="fas fa-pencil-alt"></i> Edit
          </button>
          <button className="action-button secondary" onClick={handleShareCanvas}>
            <i className="fas fa-share-alt"></i> Share
          </button>
          <button className="action-button primary" onClick={handleStartSession}>
            <i className="fas fa-play"></i> Present
          </button>
        </div>
      </div>
      
      <div className="canvas-detail-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-info-circle"></i> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <i className="fas fa-question-circle"></i> Questions ({sampleCanvas.questions.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <i className="fas fa-chart-bar"></i> Statistics
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="fas fa-cog"></i> Settings
        </button>
      </div>
      
      <div className="canvas-detail-content">
        {activeTab === 'overview' && (
          <div className="canvas-overview">
            <div className="overview-section">
              <h3>Description</h3>
              <p>{sampleCanvas.description}</p>
            </div>
            
            <div className="overview-cards">
              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fas fa-question"></i>
                </div>
                <div className="overview-info">
                  <h4>{sampleCanvas.questions.length}</h4>
                  <p>Questions</p>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="overview-info">
                  <h4>{sampleCanvas.stats.avgScore}%</h4>
                  <p>Avg. Score</p>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="overview-info">
                  <h4>{sampleCanvas.stats.totalParticipants}</h4>
                  <p>Participants</p>
                </div>
              </div>
              
              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="overview-info">
                  <h4>~{sampleCanvas.questions.reduce((sum, q) => sum + q.timeLimit, 0) / 60} min</h4>
                  <p>Duration</p>
                </div>
              </div>
            </div>
            
            <div className="overview-section">
              <h3>Recent Sessions</h3>
              <div className="recent-sessions">
                <div className="empty-state">
                  <i className="fas fa-calendar-alt"></i>
                  <p>No recent sessions found</p>
                  <button className="start-session-btn" onClick={handleStartSession}>
                    <i className="fas fa-play"></i> Start New Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'questions' && (
          <div className="canvas-questions">
            <div className="questions-header">
              <div className="questions-count">
                {sampleCanvas.questions.length} Questions
              </div>
              <button className="add-question-btn">
                <i className="fas fa-plus"></i> Add Question
              </button>
            </div>
            
            <div className="question-list">
              {sampleCanvas.questions.map((question, index) => (
                <div className="question-card" key={question.id}>
                  <div className="question-number">{index + 1}</div>
                  <div className="question-content">
                    <div className="question-text">
                      <h3>{question.question}</h3>
                      <div className="question-meta">
                        <span><i className="fas fa-clock"></i> {question.timeLimit}s</span>
                        <span><i className="fas fa-star"></i> {question.points}pts</span>
                        <span><i className="fas fa-tag"></i> {question.type}</span>
                      </div>
                    </div>
                    <div className="question-options">
                      {question.options.map(option => (
                        <div className={`option ${option.id === question.correctAnswer ? 'correct' : ''}`} key={option.id}>
                          <span className="option-letter">{option.id.toUpperCase()}</span>
                          <span className="option-text">{option.text}</span>
                          {option.id === question.correctAnswer && (
                            <span className="correct-indicator">
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="question-actions">
                    <button className="question-action-btn"><i className="fas fa-pencil-alt"></i></button>
                    <button className="question-action-btn"><i className="fas fa-copy"></i></button>
                    <button className="question-action-btn"><i className="fas fa-trash-alt"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="canvas-stats">
            <div className="stats-cards">
              <div className="stats-card">
                <h3>Times Played</h3>
                <div className="stats-value">{sampleCanvas.stats.timesPlayed}</div>
              </div>
              
              <div className="stats-card">
                <h3>Total Participants</h3>
                <div className="stats-value">{sampleCanvas.stats.totalParticipants}</div>
              </div>
              
              <div className="stats-card">
                <h3>Average Score</h3>
                <div className="stats-value">{sampleCanvas.stats.avgScore}%</div>
              </div>
              
              <div className="stats-card">
                <h3>Completion Rate</h3>
                <div className="stats-value">{sampleCanvas.stats.completionRate}%</div>
              </div>
              
              <div className="stats-card">
                <h3>Difficulty Rating</h3>
                <div className="stats-value">{sampleCanvas.stats.difficultyRating}</div>
              </div>
            </div>
            
            <div className="stats-details">
              <div className="stats-section">
                <h3>Performance by Question</h3>
                <div className="stats-chart">
                  <div className="placeholder-chart">
                    <i className="fas fa-chart-bar"></i>
                    <p>Chart visualization will appear here</p>
                  </div>
                </div>
              </div>
              
              <div className="stats-section">
                <h3>Top Performers</h3>
                <div className="placeholder-data">
                  <i className="fas fa-trophy"></i>
                  <p>Start a session to see performance data</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="canvas-settings">
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="setting-item">
                <label>Canvas Title</label>
                <input type="text" value={sampleCanvas.title} />
              </div>
              
              <div className="setting-item">
                <label>Category</label>
                <select defaultValue={sampleCanvas.category}>
                  <option>Business</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                  <option>Programming</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Description</label>
                <textarea defaultValue={sampleCanvas.description}></textarea>
              </div>
            </div>
            
            <div className="settings-section">
              <h3>Quiz Settings</h3>
              <div className="setting-item checkbox">
                <input type="checkbox" id="randomize-questions" />
                <label htmlFor="randomize-questions">Randomize Question Order</label>
              </div>
              
              <div className="setting-item checkbox">
                <input type="checkbox" id="show-answers" />
                <label htmlFor="show-answers">Show Answers After Each Question</label>
              </div>
              
              <div className="setting-item checkbox">
                <input type="checkbox" id="show-leaderboard" defaultChecked />
                <label htmlFor="show-leaderboard">Show Leaderboard After Quiz</label>
              </div>
            </div>
            
            <div className="settings-actions">
              <button className="action-button secondary">Cancel</button>
              <button className="action-button primary">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
