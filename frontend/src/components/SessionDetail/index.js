import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './SessionDetail.css';
import { useNavigate, useParams } from 'react-router';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Sample data for demonstration
const sampleSessionDetail = {
  id: 1,
  name: 'Marketing Class 101',
  quiz: 'Marketing Quiz',
  date: '2023-08-15',
  time: '10:30 AM',
  duration: '45 min',
  host: 'John Smith',
  participants: [
    { id: 1, name: 'Alice Johnson', score: 92, correct: 11, incorrect: 1, rank: 1 },
    { id: 2, name: 'Bob Williams', score: 85, correct: 10, incorrect: 2, rank: 2 },
    { id: 3, name: 'Charlie Brown', score: 77, correct: 9, incorrect: 3, rank: 3 },
    { id: 4, name: 'David Miller', score: 70, correct: 8, incorrect: 4, rank: 4 },
    { id: 5, name: 'Eva Davis', score: 62, correct: 7, incorrect: 5, rank: 5 },
    { id: 6, name: 'Frank Wilson', score: 54, correct: 6, incorrect: 6, rank: 6 },
  ],
  questions: [
    {
      id: 1,
      question: 'What is the 4 Ps of Marketing?',
      correctAnswer: 'Price, Product, Promotion, Place',
      correctPercentage: 83,
      avgResponseTime: 12.4,
      distribution: [
        { answer: 'Price, Product, Promotion, Place', count: 20, isCorrect: true },
        { answer: 'People, Process, Product, Price', count: 3, isCorrect: false },
        { answer: 'Promotion, Place, People, Process', count: 1, isCorrect: false },
        { answer: 'Product, Price, Process, People', count: 0, isCorrect: false }
      ]
    },
    {
      id: 2,
      question: 'Which of these is NOT a marketing strategy?',
      correctAnswer: 'Financial Marketing',
      correctPercentage: 62,
      avgResponseTime: 18.7,
      distribution: [
        { answer: 'Outbound Marketing', count: 2, isCorrect: false },
        { answer: 'Inbound Marketing', count: 3, isCorrect: false },
        { answer: 'Content Marketing', count: 4, isCorrect: false },
        { answer: 'Financial Marketing', count: 15, isCorrect: true }
      ]
    },
    {
      id: 3,
      question: 'Digital marketing is more effective than traditional marketing in all scenarios.',
      correctAnswer: 'False',
      correctPercentage: 75,
      avgResponseTime: 8.1,
      distribution: [
        { answer: 'True', count: 6, isCorrect: false },
        { answer: 'False', count: 18, isCorrect: true }
      ]
    }
  ],
  stats: {
    avgScore: 78,
    avgTimePerQuestion: 13.1,
    totalParticipants: 24,
    completionRate: 100,
  }
};

export default function SessionDetail() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  
  // Prepare chart data
  const scoreDistribution = {
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [
      {
        label: 'Number of Students',
        data: [1, 2, 3, 12, 6], // Sample distribution based on participants scores
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const timeAnalysisData = {
    labels: sampleSessionDetail.questions.map((_, index) => `Question ${index + 1}`),
    datasets: [
      {
        label: 'Average Response Time (seconds)',
        data: sampleSessionDetail.questions.map(q => q.avgResponseTime),
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      }
    ]
  };

  const correctnessData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Answers',
        data: [
          sampleSessionDetail.questions.reduce((sum, q) => sum + q.correctPercentage, 0) / sampleSessionDetail.questions.length,
          100 - (sampleSessionDetail.questions.reduce((sum, q) => sum + q.correctPercentage, 0) / sampleSessionDetail.questions.length),
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Score Distribution',
      },
    },
  };

  const handleViewParticipantDetails = (participantId) => {
    navigate(`/admin/report/${sessionId}/participant/${participantId}`);
  };

  return (
    <div className="session-detail-container">
      <div className="session-detail-header">
        <div className="session-detail-title">
          <h1>{sampleSessionDetail.name}</h1>
          <p className="session-detail-meta">
            {sampleSessionDetail.date} at {sampleSessionDetail.time} • Duration: {sampleSessionDetail.duration}
          </p>
          <div className="session-quiz-info">
            <span className="session-quiz-tag">Quiz: {sampleSessionDetail.quiz}</span>
            <span className="session-host-tag">Host: {sampleSessionDetail.host}</span>
          </div>
        </div>
        
        <div className="session-detail-actions">
          <button className="action-button secondary">
            <i className="fas fa-file-export"></i> Export Data
          </button>
          <button className="action-button primary">
            <i className="fas fa-play"></i> Start New Session
          </button>
        </div>
      </div>
      
      <div className="session-detail-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="summary-info">
            <h3>{sampleSessionDetail.stats.totalParticipants}</h3>
            <p>Participants</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="summary-info">
            <h3>{sampleSessionDetail.stats.avgScore}%</h3>
            <p>Average Score</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="summary-info">
            <h3>{sampleSessionDetail.stats.avgTimePerQuestion}s</h3>
            <p>Avg. Response Time</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="summary-info">
            <h3>{sampleSessionDetail.stats.completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>
      
      <div className="session-detail-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-chart-pie"></i> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          <i className="fas fa-users"></i> Participants
        </button>
        <button 
          className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <i className="fas fa-question-circle"></i> Questions
        </button>
      </div>
      
      <div className="session-detail-content">
        {activeTab === 'overview' && (
          <div className="session-overview">
            <div className="overview-section">
              <h3>Performance Overview</h3>
              <div className="charts-container">
                <div className="chart-wrapper">
                  <h4>Score Distribution</h4>
                  <div className="chart-item">
                    <Bar data={scoreDistribution} options={chartOptions} />
                  </div>
                </div>
                <div className="chart-wrapper">
                  <h4>Overall Correctness</h4>
                  <div className="chart-item pie-chart">
                    <Pie data={correctnessData} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overview-section">
              <h3>Top Performers</h3>
              <div className="top-performers">
                {sampleSessionDetail.participants.slice(0, 3).map(participant => (
                  <div className="performer-card" key={participant.id}>
                    <div className="performer-rank">{participant.rank}</div>
                    <div className="performer-info">
                      <h4>{participant.name}</h4>
                      <div className="performer-stats">
                        <span>{participant.score}%</span>
                        <span>{participant.correct} correct</span>
                        <span>{participant.incorrect} incorrect</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="overview-section">
              <h3>Time Analysis</h3>
              <div className="chart-container">
                <Bar 
                  data={timeAnalysisData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Response Time by Question'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'participants' && (
          <div className="session-participants">
            <div className="participants-header">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search participants..." />
              </div>
              <div className="sort-options">
                <select>
                  <option>Sort by Rank</option>
                  <option>Sort by Name</option>
                  <option>Sort by Score (High to Low)</option>
                  <option>Sort by Score (Low to High)</option>
                </select>
              </div>
            </div>
            
            <div className="participants-table-container">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleSessionDetail.participants.map(participant => (
                    <tr key={participant.id}>
                      <td className="rank-cell">{participant.rank}</td>
                      <td>{participant.name}</td>
                      <td>
                        <div className="score-container">
                          <div className="score-bar" style={{ width: `${participant.score}%` }}></div>
                          <span>{participant.score}%</span>
                        </div>
                      </td>
                      <td>{participant.correct}</td>
                      <td>{participant.incorrect}</td>
                      <td>
                        <button 
                          className="view-details-btn"
                          onClick={() => handleViewParticipantDetails(participant.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'questions' && (
          <div className="session-questions">
            <div className="questions-filter">
              <select>
                <option>All Questions</option>
                <option>Easiest Questions</option>
                <option>Hardest Questions</option>
                <option>Fastest Response</option>
                <option>Slowest Response</option>
              </select>
            </div>
            
            <div className="question-analysis-list">
              {sampleSessionDetail.questions.map((question, index) => (
                <div className="question-analysis-card" key={question.id}>
                  <div className="question-analysis-header">
                    <h3>Question {index + 1}: {question.question}</h3>
                    <div className="question-stats">
                      <div className="stat-badge correct">
                        <i className="fas fa-check"></i> {question.correctPercentage}%
                      </div>
                      <div className="stat-badge time">
                        <i className="fas fa-clock"></i> {question.avgResponseTime}s
                      </div>
                    </div>
                  </div>
                  
                  <div className="question-analysis-content">
                    <div className="correct-answer">
                      <span>Correct Answer:</span> {question.correctAnswer}
                    </div>
                    
                    <div className="answer-distribution">
                      {question.distribution.map(option => (
                        <div className="answer-option" key={option.answer}>
                          <div className="answer-text">
                            <span className={option.isCorrect ? 'correct-text' : ''}>{option.answer}</span>
                            <span className="answer-count">{option.count} responses</span>
                          </div>
                          <div className="answer-bar-container">
                            <div 
                              className={`answer-bar ${option.isCorrect ? 'correct' : 'incorrect'}`}
                              style={{ width: `${(option.count / sampleSessionDetail.stats.totalParticipants) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
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
