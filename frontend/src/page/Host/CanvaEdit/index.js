import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './CanvaEdit.css';

export default function CanvaEdit() {
  const navigate = useNavigate();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [canvasData, setCanvasData] = useState({
    title: 'Untitled Quiz',
    category: 'Education',
    description: '',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: '',
        timeLimit: 30,
        points: 100,
        options: [
          { id: 'a', text: '', isCorrect: false },
          { id: 'b', text: '', isCorrect: false },
          { id: 'c', text: '', isCorrect: false },
          { id: 'd', text: '', isCorrect: false }
        ]
      }
    ]
  });

  const addQuestion = () => {
    const newQuestion = {
      id: canvasData.questions.length + 1,
      type: 'multiple-choice',
      question: '',
      timeLimit: 30,
      points: 100,
      options: [
        { id: 'a', text: '', isCorrect: false },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
        { id: 'd', text: '', isCorrect: false }
      ]
    };
    
    setCanvasData({
      ...canvasData,
      questions: [...canvasData.questions, newQuestion]
    });
    
    setActiveQuestionIndex(canvasData.questions.length);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...canvasData.questions];
    updatedQuestions.splice(index, 1);
    
    setCanvasData({
      ...canvasData,
      questions: updatedQuestions
    });
    
    if (activeQuestionIndex >= updatedQuestions.length) {
      setActiveQuestionIndex(Math.max(0, updatedQuestions.length - 1));
    }
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...canvasData.questions];
    updatedQuestions[index] = updatedQuestion;
    
    setCanvasData({
      ...canvasData,
      questions: updatedQuestions
    });
  };

  const handleCanvasInfoChange = (e) => {
    const { name, value } = e.target;
    setCanvasData({
      ...canvasData,
      [name]: value
    });
  };

  const handleQuestionChange = (questionIndex, e) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...canvasData.questions[questionIndex] };
    
    if (name === 'question') {
      updatedQuestion.question = value;
    } else if (name === 'timeLimit' || name === 'points') {
      updatedQuestion[name] = parseInt(value, 10);
    } else if (name === 'type') {
      updatedQuestion.type = value;
      
      // Reset options based on question type
      if (value === 'true-false') {
        updatedQuestion.options = [
          { id: 'a', text: 'True', isCorrect: false },
          { id: 'b', text: 'False', isCorrect: false }
        ];
      } else if (updatedQuestion.options.length < 4) {
        updatedQuestion.options = [
          { id: 'a', text: updatedQuestion.options[0]?.text || '', isCorrect: updatedQuestion.options[0]?.isCorrect || false },
          { id: 'b', text: updatedQuestion.options[1]?.text || '', isCorrect: updatedQuestion.options[1]?.isCorrect || false },
          { id: 'c', text: '', isCorrect: false },
          { id: 'd', text: '', isCorrect: false }
        ];
      }
    }
    
    updateQuestion(questionIndex, updatedQuestion);
  };

  const handleOptionChange = (questionIndex, optionId, value) => {
    const updatedQuestion = { ...canvasData.questions[questionIndex] };
    const optionIndex = updatedQuestion.options.findIndex(opt => opt.id === optionId);
    
    if (optionIndex !== -1) {
      updatedQuestion.options[optionIndex].text = value;
      updateQuestion(questionIndex, updatedQuestion);
    }
  };

  const handleCorrectAnswerChange = (questionIndex, optionId) => {
    const updatedQuestion = { ...canvasData.questions[questionIndex] };
    
    updatedQuestion.options.forEach(option => {
      option.isCorrect = option.id === optionId;
    });
    
    updateQuestion(questionIndex, updatedQuestion);
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log('Saving canvas:', canvasData);
    navigate('/admin');
  };

  const scrollToQuestion = (index) => {
    setActiveQuestionIndex(index);
    const questionElement = document.getElementById(`question-${index}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToQuestion = (direction) => {
    if (direction === 'prev' && activeQuestionIndex > 0) {
      scrollToQuestion(activeQuestionIndex - 1);
    } else if (direction === 'next' && activeQuestionIndex < canvasData.questions.length - 1) {
      scrollToQuestion(activeQuestionIndex + 1);
    }
  };

  return (
    <div className="canva-edit-container">
      <div className="canva-edit-header">
        <h1>Edit Canvas</h1>
        <div className="canva-edit-actions">
          <button className="action-button secondary" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button className="action-button primary" onClick={handleSave}>
            <i className="fas fa-save"></i> Save Canvas
          </button>
        </div>
      </div>
      
      <div className="canva-edit-content">
        <div className="canva-edit-sidebar">
          <div className="sidebar-section">
            <h3>Canvas Information</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={canvasData.title}
                onChange={handleCanvasInfoChange}
                placeholder="Enter canvas title"
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={canvasData.category}
                onChange={handleCanvasInfoChange}
              >
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Programming">Programming</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={canvasData.description}
                onChange={handleCanvasInfoChange}
                placeholder="Enter a description for your canvas"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="canva-edit-main">
          <div className="questions-summary">
            <h3>Questions ({canvasData.questions.length})</h3>
            <div className="questions-navigation">
              {canvasData.questions.map((_, index) => (
                <div 
                  key={index} 
                  className={`question-dot ${index === activeQuestionIndex ? 'active' : ''}`}
                  onClick={() => scrollToQuestion(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          
          {canvasData.questions.map((question, qIndex) => (
            <div 
              id={`question-${qIndex}`}
              key={question.id} 
              className={`question-editor ${qIndex === activeQuestionIndex ? 'active' : ''}`}
              onClick={() => setActiveQuestionIndex(qIndex)}
            >
              <div className="question-editor-header">
                <div className="question-number-container">
                  <h2>Question {qIndex + 1}</h2>
                  {canvasData.questions.length > 1 && (
                    <button 
                      className="remove-question-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(qIndex);
                      }}
                    >
                      <i className="fas fa-trash-alt"></i> Delete Question
                    </button>
                  )}
                </div>
                <div className="question-controls">
                  <div className="form-group inline">
                    <label>Type</label>
                    <select
                      name="type"
                      value={question.type}
                      onChange={(e) => handleQuestionChange(qIndex, e)}
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                    </select>
                  </div>
                  <div className="form-group inline">
                    <label>Time Limit</label>
                    <select
                      name="timeLimit"
                      value={question.timeLimit}
                      onChange={(e) => handleQuestionChange(qIndex, e)}
                    >
                      <option value="10">10 seconds</option>
                      <option value="20">20 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">60 seconds</option>
                      <option value="90">90 seconds</option>
                      <option value="120">120 seconds</option>
                    </select>
                  </div>
                  <div className="form-group inline">
                    <label>Points</label>
                    <select
                      name="points"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(qIndex, e)}
                    >
                      <option value="50">50 points</option>
                      <option value="100">100 points</option>
                      <option value="200">200 points</option>
                      <option value="500">500 points</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="question-editor-content">
                <div className="form-group">
                  <label>Question Text</label>
                  <textarea
                    name="question"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    placeholder="Enter your question here"
                    className="question-text-input"
                  ></textarea>
                </div>
                
                <div className="options-editor">
                  <label>Answer Options</label>
                  <p className="options-hint">Select the correct answer by clicking the radio button.</p>
                  
                  <div className="options-list">
                    {question.options.map(option => (
                      <div key={option.id} className="option-item">
                        <div className="option-selector">
                          <input
                            type="radio"
                            name={`correct-answer-${qIndex}`}
                            checked={option.isCorrect}
                            onChange={() => handleCorrectAnswerChange(qIndex, option.id)}
                            id={`option-${qIndex}-${option.id}`}
                          />
                          <label
                            htmlFor={`option-${qIndex}-${option.id}`}
                            className="option-letter"
                          >
                            {option.id.toUpperCase()}
                          </label>
                        </div>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(qIndex, option.id, e.target.value)}
                          placeholder={`Option ${option.id.toUpperCase()}`}
                          className="option-text-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="question-navigation">
                <button 
                  className="nav-button prev" 
                  onClick={() => navigateToQuestion('prev')}
                  disabled={qIndex === 0}
                >
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button 
                  className="nav-button next" 
                  onClick={() => navigateToQuestion('next')}
                  disabled={qIndex === canvasData.questions.length - 1}
                >
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
          
          <div className="add-question-container">
            <button className="add-question-btn-large" onClick={addQuestion}>
              <i className="fas fa-plus"></i> Add New Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
