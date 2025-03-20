import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import './SessionStart.css';

const sampleCanvasData = {
  id: 1,
  title: 'Marketing Quiz',
  description: 'A comprehensive quiz covering basic marketing concepts, strategies, and case studies.',
  category: 'Business',
  questionCount: 3,
  totalTime: 135,
  createdBy: 'John Smith'
};

export default function SessionStart() {
  const { canvasId } = useParams();
  const navigate = useNavigate();
  
  const [canvas, setCanvas] = useState(sampleCanvasData);
  const [sessionOptions, setSessionOptions] = useState({
    randomizeQuestions: false,
    showAnswersAfterEach: true,
    pointsPerQuestion: 'standard',
    timeLimit: 'standard',
    nickname: true,
    podium: true
  });
  
  // In a real app, fetch canvas data based on canvasId
  useEffect(() => {
    // Fetch canvas details
    console.log(`Fetching canvas data for ID: ${canvasId}`);
  }, [canvasId]);
  
  const handleOptionChange = (option, value) => {
    setSessionOptions({
      ...sessionOptions,
      [option]: value
    });
  };
  
  const handleStartSession = () => {
    // In a real app, call API to create a new session
    const sessionId = 'ABC123'; // This would come from the API
    navigate(`/host/lobby/${sessionId}`);
  };
  
  const handleCancel = () => {
    navigate(`/admin/canva/${canvasId}`);
  };

  return (
    <div className="session-start-container">
      <div className="session-start-header">
        <h1>Start New Session</h1>
        <button className="back-button" onClick={handleCancel}>
          <i className="fas fa-arrow-left"></i> Back to Canvas
        </button>
      </div>
      
      <div className="session-start-content">
        <div className="canvas-preview-card">
          <div className="canvas-preview-header">
            <span className="canvas-category">{canvas.category}</span>
            <h2>{canvas.title}</h2>
          </div>
          <div className="canvas-preview-body">
            <p>{canvas.description}</p>
            <div className="canvas-preview-stats">
              <div className="preview-stat">
                <i className="fas fa-question-circle"></i>
                <span>{canvas.questionCount} Questions</span>
              </div>
              <div className="preview-stat">
                <i className="fas fa-clock"></i>
                <span>~{Math.ceil(canvas.totalTime / 60)} min</span>
              </div>
              <div className="preview-stat">
                <i className="fas fa-user"></i>
                <span>By {canvas.createdBy}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="session-options-card">
          <h3>Session Settings</h3>
          
          <div className="option-group">
            <h4>Questions</h4>
            <div className="option-item">
              <div className="option-label">
                <span>Randomize question order</span>
                <span className="option-help">
                  <i className="fas fa-info-circle"></i>
                  <span className="option-tooltip">Present questions in a random order to prevent cheating</span>
                </span>
              </div>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="randomize-questions" 
                  checked={sessionOptions.randomizeQuestions}
                  onChange={() => handleOptionChange('randomizeQuestions', !sessionOptions.randomizeQuestions)}
                />
                <label htmlFor="randomize-questions"></label>
              </div>
            </div>
            
            <div className="option-item">
              <div className="option-label">
                <span>Show answers after each question</span>
              </div>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="show-answers" 
                  checked={sessionOptions.showAnswersAfterEach}
                  onChange={() => handleOptionChange('showAnswersAfterEach', !sessionOptions.showAnswersAfterEach)}
                />
                <label htmlFor="show-answers"></label>
              </div>
            </div>
            
            <div className="option-item">
              <div className="option-label">
                <span>Points per question</span>
              </div>
              <div className="option-select">
                <select 
                  value={sessionOptions.pointsPerQuestion}
                  onChange={(e) => handleOptionChange('pointsPerQuestion', e.target.value)}
                >
                  <option value="standard">Standard (as set in quiz)</option>
                  <option value="fixed">Fixed (100 points each)</option>
                  <option value="double">Double points</option>
                </select>
              </div>
            </div>
            
            <div className="option-item">
              <div className="option-label">
                <span>Time limit</span>
              </div>
              <div className="option-select">
                <select 
                  value={sessionOptions.timeLimit}
                  onChange={(e) => handleOptionChange('timeLimit', e.target.value)}
                >
                  <option value="standard">Standard (as set in quiz)</option>
                  <option value="halfTime">Half time</option>
                  <option value="doubleTime">Double time</option>
                  <option value="noLimit">No time limit</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="option-group">
            <h4>Players</h4>
            <div className="option-item">
              <div className="option-label">
                <span>Require player nicknames</span>
              </div>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="nickname-required" 
                  checked={sessionOptions.nickname}
                  onChange={() => handleOptionChange('nickname', !sessionOptions.nickname)}
                />
                <label htmlFor="nickname-required"></label>
              </div>
            </div>
            
            <div className="option-item">
              <div className="option-label">
                <span>Show podium at the end</span>
              </div>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="show-podium" 
                  checked={sessionOptions.podium}
                  onChange={() => handleOptionChange('podium', !sessionOptions.podium)}
                />
                <label htmlFor="show-podium"></label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="session-actions">
          <button className="action-button secondary" onClick={handleCancel}>Cancel</button>
          <button className="action-button primary" onClick={handleStartSession}>
            <i className="fas fa-play"></i> Start Session
          </button>
        </div>
      </div>
    </div>
  );
}
