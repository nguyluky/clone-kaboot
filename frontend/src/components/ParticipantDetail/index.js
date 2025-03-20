import React, { useState, useEffect } from 'react';
import './ParticipantDetail.css';
import { participantApi } from '../../services/fakeDatabase';

export default function ParticipantDetail({ participantId }) {
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  
  useEffect(() => {
    const fetchParticipantDetail = async () => {
      try {
        setLoading(true);
        const data = await participantApi.getById(participantId);
        setParticipant(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch participant data');
        setLoading(false);
      }
    };
    
    fetchParticipantDetail();
  }, [participantId]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading participant data...</p>
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

  if (!participant) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>Participant not found</p>
      </div>
    );
  }
  
  // Calculate participant stats
  const accuracy = ((participant.correctAnswers / participant.totalQuestions) * 100).toFixed(1);
  const fastestAnswer = Math.min(...participant.answers.map(a => a.responseTime)).toFixed(1);
  const slowestAnswer = Math.max(...participant.answers.map(a => a.responseTime)).toFixed(1);
  
  return (
    <div className="participant-detail-container">
      <div className="participant-detail-header">
        <div className="participant-info">
          <div className="participant-rank-badge">{participant.rank}</div>
          <div className="participant-name-info">
            <h2>{participant.name}</h2>
            <p>Participated in {participant.sessionName} - {participant.date}</p>
          </div>
        </div>
        <div className="participant-score-info">
          <div className="participant-score-badge">{participant.score}%</div>
          <div className="participant-score-detail">
            <span className="correct-answers">
              <i className="fas fa-check"></i> {participant.correctAnswers} correct
            </span>
            <span className="incorrect-answers">
              <i className="fas fa-times"></i> {participant.incorrectAnswers} incorrect
            </span>
          </div>
        </div>
      </div>
      
      <div className="participant-tabs">
        <button 
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <i className="fas fa-chart-pie"></i> Performance Summary
        </button>
        <button 
          className={`tab-button ${activeTab === 'answers' ? 'active' : ''}`}
          onClick={() => setActiveTab('answers')}
        >
          <i className="fas fa-list-ol"></i> Question Responses
        </button>
      </div>
      
      <div className="participant-detail-content">
        {activeTab === 'summary' && (
          <div className="participant-summary">
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-label">Accuracy</div>
                <div className="stat-value">{accuracy}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Avg. Response Time</div>
                <div className="stat-value">{participant.averageResponseTime}s</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Fastest Answer</div>
                <div className="stat-value">{fastestAnswer}s</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Slowest Answer</div>
                <div className="stat-value">{slowestAnswer}s</div>
              </div>
            </div>
            
            <div className="performance-chart">
              <h3>Response Time per Question</h3>
              <div className="chart-placeholder">
                <i className="fas fa-chart-line"></i>
                <p>Chart showing response time for each question would appear here</p>
              </div>
            </div>
            
            <div className="performance-breakdown">
              <h3>Performance Breakdown</h3>
              <div className="breakdown-stats">
                <div className="breakdown-item">
                  <span className="breakdown-label">Overall Rank:</span>
                  <span className="breakdown-value">{participant.rank} of 24</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Questions Answered:</span>
                  <span className="breakdown-value">{participant.totalQuestions}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Total Score:</span>
                  <span className="breakdown-value">{participant.score}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'answers' && (
          <div className="participant-answers">
            <div className="answers-list">
              {participant.answers.map(answer => (
                <div className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`} key={answer.questionId}>
                  <div className="answer-header">
                    <div className="question-number">Q{answer.questionId}</div>
                    <div className="answer-stats">
                      <span className="response-time">
                        <i className="fas fa-clock"></i> {answer.responseTime}s
                      </span>
                      <span className="answer-points">
                        <i className="fas fa-star"></i> {answer.points} pts
                      </span>
                      <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                        <i className={`fas ${answer.isCorrect ? 'fa-check' : 'fa-times'}`}></i>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>
                  <div className="question-text">
                    {answer.questionText}
                  </div>
                  <div className="answer-details">
                    <div className="answer-row">
                      <div className="answer-label">Correct Answer:</div>
                      <div className="answer-value correct">{answer.correctAnswer}</div>
                    </div>
                    <div className="answer-row">
                      <div className="answer-label">Participant's Answer:</div>
                      <div className={`answer-value ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                        {answer.participantAnswer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
