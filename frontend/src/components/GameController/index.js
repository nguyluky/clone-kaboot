import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './GameController.css';

// Sample quiz data for demonstration
const sampleQuiz = {
  id: 1,
  title: 'Marketing Quiz',
  questions: [
    {
      id: 1,
      question: 'What is the 4 Ps of Marketing?',
      timeLimit: 60,
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
      question: 'Which of these is NOT a marketing strategy?',
      timeLimit: 45,
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
      question: 'Digital marketing is more effective than traditional marketing in all scenarios.',
      timeLimit: 30,
      options: [
        { id: 'a', text: 'True' },
        { id: 'b', text: 'False' }
      ],
      correctAnswer: 'b'
    }
  ]
};

export default function GameController({ sessionId }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState('intro'); // intro, question, results, leaderboard, completed
  const [timer, setTimer] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState({});
  
  const currentQuestion = sampleQuiz.questions[currentQuestionIndex];
  
  // Setup timer when question starts
  useEffect(() => {
    let interval;
    
    if (gameState === 'question' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setGameState('results');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameState, timer]);
  
  // Simulate player answers coming in
  useEffect(() => {
    if (gameState === 'question') {
      const simulatePlayerAnswers = () => {
        setPlayerAnswers({
          'a': Math.floor(Math.random() * 10),
          'b': Math.floor(Math.random() * 8),
          'c': Math.floor(Math.random() * 5),
          'd': Math.floor(Math.random() * 7)
        });
      };
      
      const interval = setInterval(simulatePlayerAnswers, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState]);
  
  const startGame = () => {
    setGameState('question');
    setTimer(currentQuestion.timeLimit);
  };
  
  const showNextQuestion = () => {
    if (currentQuestionIndex < sampleQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setGameState('question');
      setTimer(sampleQuiz.questions[currentQuestionIndex + 1].timeLimit);
      setPlayerAnswers({});
    } else {
      setGameState('completed');
    }
  };
  
  const showLeaderboard = () => {
    navigate(`/host/${sessionId}/leaderboard`);
  };
  
  const endGame = () => {
    navigate('/admin');
  };
  
  const calculateTotalAnswers = () => {
    return Object.values(playerAnswers).reduce((sum, count) => sum + count, 0);
  };
  
  return (
    <div className="game-controller">
      <div className="controller-header">
        <h1>{sampleQuiz.title}</h1>
        <div className="game-status">
          <span>Question {currentQuestionIndex + 1} of {sampleQuiz.questions.length}</span>
          <span>Players: 24</span>
        </div>
      </div>
      
      {gameState === 'intro' && (
        <div className="game-intro">
          <div className="intro-content">
            <h2>Ready to Start?</h2>
            <p>Make sure all players have joined the game.</p>
            <button className="controller-button primary" onClick={startGame}>
              <i className="fas fa-play"></i> Start Game
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'question' && (
        <div className="question-display">
          <div className="question-timer">{timer}</div>
          
          <div className="question-content">
            <h2>{currentQuestion.question}</h2>
            <div className="options-grid">
              {currentQuestion.options.map(option => (
                <div className="option-box" key={option.id}>
                  <div className="option-letter">{option.id.toUpperCase()}</div>
                  <div className="option-text">{option.text}</div>
                  <div className="option-players">{playerAnswers[option.id] || 0}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="question-stats">
            <div className="question-players">
              <i className="fas fa-users"></i>
              <span>{calculateTotalAnswers()} / 24 answered</span>
            </div>
            <button 
              className="controller-button secondary" 
              onClick={() => setGameState('results')}
            >
              End Question
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'results' && (
        <div className="results-display">
          <h2>Results</h2>
          
          <div className="options-grid">
            {currentQuestion.options.map(option => (
              <div 
                className={`option-box ${option.id === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`} 
                key={option.id}
              >
                <div className="option-letter">{option.id.toUpperCase()}</div>
                <div className="option-text">{option.text}</div>
                <div className="option-players">{playerAnswers[option.id] || 0}</div>
                {option.id === currentQuestion.correctAnswer && (
                  <div className="correct-marker">
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="results-actions">
            <button className="controller-button secondary" onClick={showLeaderboard}>
              <i className="fas fa-trophy"></i> Show Leaderboard
            </button>
            {currentQuestionIndex < sampleQuiz.questions.length - 1 ? (
              <button className="controller-button primary" onClick={showNextQuestion}>
                <i className="fas fa-arrow-right"></i> Next Question
              </button>
            ) : (
              <button className="controller-button primary" onClick={() => setGameState('completed')}>
                <i className="fas fa-flag-checkered"></i> End Game
              </button>
            )}
          </div>
        </div>
      )}
      
      {gameState === 'completed' && (
        <div className="game-completed">
          <div className="completed-content">
            <h2>Game Completed!</h2>
            <p>All questions have been answered.</p>
            <div className="completed-actions">
              <button className="controller-button secondary" onClick={showLeaderboard}>
                <i className="fas fa-trophy"></i> Show Final Leaderboard
              </button>
              <button className="controller-button primary" onClick={endGame}>
                <i className="fas fa-home"></i> Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
