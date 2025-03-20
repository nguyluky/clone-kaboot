import React, { useState } from 'react';
import './ParticipantDetail.css';

// Sample data for demonstration
const sampleParticipantDetail = {
  id: 1,
  name: 'Alice Johnson',
  score: 92,
  rank: 1,
  correctAnswers: 11,
  incorrectAnswers: 1,
  averageResponseTime: 8.3,
  sessionName: 'Marketing Class 101',
  quizName: 'Marketing Quiz',
  date: '2023-08-15',
  totalQuestions: 12,
  answers: [
    {
      questionId: 1,
      questionText: 'What is the 4 Ps of Marketing?',
      correctAnswer: 'Price, Product, Promotion, Place',
      participantAnswer: 'Price, Product, Promotion, Place',
      isCorrect: true,
      responseTime: 7.2,
      points: 100
    },
    {
      questionId: 2,
      questionText: 'Which of these is NOT a marketing strategy?',
      correctAnswer: 'Financial Marketing',
      participantAnswer: 'Financial Marketing',
      isCorrect: true,
      responseTime: 12.5,
      points: 75
    },
    {
      questionId: 3,
      questionText: 'Digital marketing is more effective than traditional marketing in all scenarios.',
      correctAnswer: 'False',
      participantAnswer: 'False',
      isCorrect: true,
      responseTime: 5.3,
      points: 50
    },
    // Adding a sample incorrect answer
    {
      questionId: 4,
      questionText: 'What is the primary goal of content marketing?',
      correctAnswer: 'Provide value to attract and engage a target audience',
      participantAnswer: 'Directly sell products through content',
      isCorrect: false,
      responseTime: 9.8,
      points: 0
    }
  ]
};

export default function ParticipantDetail({ participantId }) {
  // In a real app, you would fetch participant data based on participantId
  const participant = sampleParticipantDetail;
  const [activeTab, setActiveTab] = useState('summary');
  
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
