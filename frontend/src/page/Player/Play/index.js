import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../services/apiService';
import Loading from '../../../components/common/Loading';
import './Play.css';

export default function Play() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sessionData, setSessionData] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [textAnswers, setTextAnswers] = useState({});
    // Store when each question was first viewed (for timing)
    const [questionStartTimes, setQuestionStartTimes] = useState({});
    const [uiState, setUiState] = useState({
        isLoading: true,
        isSubmitting: false,
        isCompleted: false,
        error: null
    });

    // Track if this is the first time viewing each question
    const viewedQuestions = useRef(new Set());

    // Retrieve session data from location state or local storage
    useEffect(() => {
        const getSessionData = () => {
            // Try to get from location state first
            if (location.state?.sessionData && location.state?.playerId) {
                return {
                    sessionData: location.state.sessionData,
                    playerId: location.state.playerId
                };
            }

            // Fallback to localStorage
            try {
                const storedData = localStorage.getItem('kahoot_session');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    return {
                        sessionData: parsedData.sessionData,
                        playerId: parsedData.playerId
                    };
                }
            } catch (error) {
                console.error("Error retrieving session data:", error);
            }

            return null;
        };

        const data = getSessionData();
        if (data) {
            setSessionData(data.sessionData);
            setPlayerId(data.playerId);
            setQuestions(data.sessionData.questions || []);
            setUiState(prev => ({ ...prev, isLoading: false }));
        } else {
            setUiState(prev => ({
                ...prev,
                isLoading: false,
                error: "Session data not found. Please join again."
            }));
        }
    }, [location]);

    // Initialize selected options based on answers
    useEffect(() => {
        const optionMap = {};
        const textMap = {};

        answers.forEach(answer => {
            if (answer.text_answer) {
                textMap[answer.question_id] = answer.text_answer;
            } else if (answer.option_id) {
                optionMap[answer.question_id] = answer.option_id;
            }
        });

        setSelectedOptions(optionMap);
        setTextAnswers(textMap);
    }, [answers]);

    // Track when a question is first viewed
    useEffect(() => {
        if (!questions[currentQuestionIndex]) return;

        const questionId = questions[currentQuestionIndex].id;

        // If we haven't seen this question before, record the start time
        if (!viewedQuestions.current.has(questionId)) {
            viewedQuestions.current.add(questionId);
            setQuestionStartTimes(prev => ({
                ...prev,
                [questionId]: Date.now()
            }));
        }
    }, [currentQuestionIndex, questions]);

    // Calculate response time for the current question
    const calculateResponseTime = (questionId) => {
        const startTime = questionStartTimes[questionId];
        if (!startTime) return 0; // Default to 0 if no start time recorded

        const responseTime = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
        return responseTime;
    };

    // Handle option selection for multiple/single choice questions
    const handleOptionSelect = (questionId, optionId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [questionId]: optionId
        }));

        const responseTime = calculateResponseTime(questionId);

        const answerData = {
            question_id: questionId,
            option_id: optionId,
            responseTime: responseTime
        };

        saveAnswer(answerData);
    };

    // Handle text input for text questions
    const handleTextChange = (questionId, text) => {
        setTextAnswers(prev => ({
            ...prev,
            [questionId]: text
        }));

        // Don't save text answers immediately, only on navigation or submit
    };

    // Save text answer when leaving question
    const saveTextAnswer = (questionId) => {
        const text = textAnswers[questionId];
        if (text && text.trim()) {
            const responseTime = calculateResponseTime(questionId);

            const answerData = {
                question_id: questionId,
                text_answer: text,
                responseTime: responseTime
            };
            saveAnswer(answerData);
        }
    };

    // Navigate to a specific question
    const goToQuestion = (index) => {
        // Save current answer if it's a text question
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion?.type === 'text') {
            saveTextAnswer(currentQuestion.id);
        }

        // Set new question index
        setCurrentQuestionIndex(index);
    };

    // Move to the previous question
    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            goToQuestion(currentQuestionIndex - 1);
        }
    };

    // Move to the next question
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            goToQuestion(currentQuestionIndex + 1);
        }
    };

    // Save an answer to the answers array
    const saveAnswer = (answerData) => {
        setAnswers(prev => {
            // Check if we already have an answer for this question
            const existingIndex = prev.findIndex(a => a.question_id === answerData.question_id);

            if (existingIndex >= 0) {
                // Update existing answer
                const updated = [...prev];
                updated[existingIndex] = answerData;
                return updated;
            } else {
                // Add new answer
                return [...prev, answerData];
            }
        });
    };

    // Submit all answers to the server
    const submitAllAnswers = async () => {
        // Make sure any current text answer is saved
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion?.type === 'text') {
            saveTextAnswer(currentQuestion.id);
        }

        setUiState(prev => ({ ...prev, isSubmitting: true }));

        try {
            // Submit all answers to the server
            const result = await api.player.submitAllAnswers(
                playerId,
                answers
            );

            // Mark completion
            setUiState(prev => ({
                ...prev,
                isSubmitting: false,
                isCompleted: true
            }));

            // Clean up storage
            localStorage.removeItem('kahoot_session');

            // Show success message
            toast.success("Quiz completed successfully!", { position: "top-center" });

            // Store results for the results page
            localStorage.setItem('quiz_results', JSON.stringify({
                score: result.score,
                correctAnswers: result.correctAnswers,
                incorrectAnswers: result.incorrectAnswers,
                total: answers.length,
                quizTitle: sessionData.quiz
            }));

            // Navigate to results page
            navigate('/results', {
                state: {
                    results: result,
                    quizTitle: sessionData.quiz
                }
            });

        } catch (error) {
            console.error("Error submitting answers:", error);
            setUiState(prev => ({
                ...prev,
                isSubmitting: false,
                error: "Failed to submit answers. Please try again."
            }));
            toast.error("Failed to submit answers", { position: "top-center" });
        }
    };

    // Render loading state
    if (uiState.isLoading) {
        return (
            <div className="play-container">
                <div className="play-loading">
                    <Loading />
                    <h2>Loading quiz...</h2>
                </div>
            </div>
        );
    }

    // Render error state
    if (uiState.error) {
        return (
            <div className="play-container">
                <div className="play-error">
                    <div className="error-icon">❌</div>
                    <h2>Error</h2>
                    <p>{uiState.error}</p>
                    <button
                        className="play-button"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Render completion state
    if (uiState.isCompleted) {
        return (
            <div className="play-container">
                <div className="play-completion">
                    <div className="completion-icon">🎉</div>
                    <h2>Quiz Completed!</h2>
                    <p>Your answers have been submitted.</p>
                    <p>Redirecting to results...</p>
                </div>
            </div>
        );
    }

    // Get current question
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="play-container">
            {/* Quiz Header */}
            <div className="play-header">
                <div className="quiz-info">
                    <h1>{sessionData?.quiz || 'Quiz'}</h1>
                    <div className="question-counter">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                </div>

                {/* Question Navigation */}
                <div className="question-navigation-dots">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`nav-dot ${index === currentQuestionIndex ? 'active' : ''} ${answers.some(a => a.question_id === questions[index]?.id) ? 'answered' : ''}`}
                            onClick={() => goToQuestion(index)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Question Content */}
            <div className="question-container">
                <div className="question-text">
                    <h2>{currentQuestion?.question || 'Question'}</h2>
                </div>

                {/* Answer Options */}
                <div className={`answer-options ${currentQuestion?.type || ''}`}>
                    {currentQuestion?.type === 'text' ? (
                        <div className="text-answer">
                            <input
                                type="text"
                                value={textAnswers[currentQuestion.id] || ''}
                                onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                                placeholder="Type your answer here..."
                                className="text-input"
                            />
                        </div>
                    ) : (
                        currentQuestion?.options.map(option => (
                            <div
                                key={option.id}
                                className={`option-card ${selectedOptions[currentQuestion.id] === option.id ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                            >
                                <div className="option-content">
                                    <span className="option-text">{option.text}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="play-controls">
                <button
                    className="nav-button prev"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous Question
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        className="play-button submit-btn"
                        onClick={submitAllAnswers}
                        disabled={uiState.isSubmitting}
                    >
                        {uiState.isSubmitting ? 'Submitting...' : 'Finish Quiz'}
                    </button>
                ) : (
                    <button
                        className="nav-button next"
                        onClick={goToNextQuestion}
                    >
                        Next Question
                    </button>
                )}
            </div>

            {/* Quiz Progress */}
            <div className="quiz-progress">
                <div className="progress-info">
                    <span>{answers.length} of {questions.length} questions answered</span>

                    {answers.length === questions.length && (
                        <button
                            className="submit-all-btn"
                            onClick={submitAllAnswers}
                            disabled={uiState.isSubmitting}
                        >
                            Submit All Answers
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}