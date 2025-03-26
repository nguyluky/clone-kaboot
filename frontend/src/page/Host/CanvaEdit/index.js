import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../services/apiService';
import './CanvaEdit.css';

// Question type configurations
const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 'multiple_choice',
    SINGLE_CHOICE: 'single_choice',
    TEXT: 'text'
};

// Default empty canvas structure
const createEmptyCanvas = () => ({
    title: 'Untitled Quiz',
    category: 'Education',
    description: '',
    questions: [createEmptyQuestion()]
});

// Function to create a blank question based on type
const createEmptyQuestion = (type = QUESTION_TYPES.MULTIPLE_CHOICE, id = 1) => {
    const baseQuestion = {
        id,
        type,
        question: '',
        timeLimit: 30,
        points: 100,
    };

    // Set options based on question type
    switch (type) {
        case QUESTION_TYPES.TEXT:
            return {
                ...baseQuestion,
                options: [{ id: 1, text: '', isCorrect: true }]
            };
        case QUESTION_TYPES.SINGLE_CHOICE:
            return {
                ...baseQuestion,
                options: [
                    { id: 1, text: '', isCorrect: false },
                    { id: 2, text: '', isCorrect: false },
                    { id: 3, text: '', isCorrect: false },
                    { id: 4, text: '', isCorrect: false }
                ]
            };
        case QUESTION_TYPES.MULTIPLE_CHOICE:
        default:
            return {
                ...baseQuestion,
                options: [
                    { id: 1, text: '', isCorrect: false },
                    { id: 2, text: '', isCorrect: false },
                    { id: 3, text: '', isCorrect: false },
                    { id: 4, text: '', isCorrect: false }
                ]
            };
    }
};

// Main component
export default function CanvaEdit() {
    // Hooks
    const navigate = useNavigate();
    const { id } = useParams();

    // State management
    const [canvasData, setCanvasData] = useState(createEmptyCanvas());
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [uiState, setUiState] = useState({
        isLoading: false,
        isSaving: false,
        error: null
    });

    // Fetch canvas data for editing existing canvas
    useEffect(() => {
        if (!id) return;

        const fetchCanvasData = async () => {
            setUiState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const data = await api.canvas.getCanvasDetail(id);
                setCanvasData(data);
            } catch (error) {
                console.error("Failed to fetch canvas:", error);
                const errorMessage = "Failed to load canvas data. Please try again.";
                setUiState(prev => ({ ...prev, error: errorMessage }));
                toast.error(errorMessage);
            } finally {
                setUiState(prev => ({ ...prev, isLoading: false }));
            }
        };

        fetchCanvasData();
    }, [id]);

    // Question management functions
    const addQuestion = useCallback(() => {
        const newQuestionId = Math.max(0, ...canvasData.questions.map(q => q.id)) + 1;
        const newQuestion = createEmptyQuestion(QUESTION_TYPES.MULTIPLE_CHOICE, newQuestionId);

        setCanvasData(prevData => ({
            ...prevData,
            questions: [...prevData.questions, newQuestion]
        }));

        // Navigate to the new question
        setActiveQuestionIndex(canvasData.questions.length);

        // Schedule a scroll to the new question after render
        setTimeout(() => {
            scrollToQuestion(canvasData.questions.length);
        }, 50);
    }, [canvasData]);

    const removeQuestion = useCallback((index) => {
        if (canvasData.questions.length <= 1) {
            toast.warning("Quiz must have at least one question", { position: "top-center" });
            return;
        }

        setCanvasData(prevData => {
            const updatedQuestions = [...prevData.questions];
            updatedQuestions.splice(index, 1);

            return {
                ...prevData,
                questions: updatedQuestions
            };
        });

        // Adjust active index if needed
        if (activeQuestionIndex >= index) {
            setActiveQuestionIndex(prev => Math.max(0, prev - 1));
        }
    }, [canvasData.questions.length, activeQuestionIndex]);

    // Form handling functions
    const handleCanvasInfoChange = useCallback((e) => {
        const { name, value } = e.target;

        setCanvasData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }, []);

    const updateQuestionField = useCallback((questionIndex, field, value) => {
        setCanvasData(prevData => {
            const updatedQuestions = [...prevData.questions];
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                [field]: value
            };

            return {
                ...prevData,
                questions: updatedQuestions
            };
        });
    }, []);

    const handleQuestionChange = useCallback((questionIndex, e) => {
        const { name, value } = e.target;

        if (name === 'type') {
            // Create a new question with the selected type and copy over question text
            const currentQuestion = canvasData.questions[questionIndex];
            const questionText = currentQuestion.question;
            const newQuestion = createEmptyQuestion(value, currentQuestion.id);
            newQuestion.question = questionText;

            setCanvasData(prevData => {
                const updatedQuestions = [...prevData.questions];
                updatedQuestions[questionIndex] = newQuestion;

                return {
                    ...prevData,
                    questions: updatedQuestions
                };
            });
        } else if (name === 'question') {
            updateQuestionField(questionIndex, 'question', value);
        } else if (name === 'timeLimit' || name === 'points') {
            updateQuestionField(questionIndex, name, parseInt(value, 10));
        }
    }, [canvasData.questions, updateQuestionField]);

    const handleOptionChange = useCallback((questionIndex, optionId, value) => {
        setCanvasData(prevData => {
            const updatedQuestions = [...prevData.questions];
            const question = { ...updatedQuestions[questionIndex] };

            const optionIndex = question.options.findIndex(opt => opt.id === optionId);
            if (optionIndex === -1) return prevData;

            question.options = [...question.options];
            question.options[optionIndex] = {
                ...question.options[optionIndex],
                text: value
            };

            updatedQuestions[questionIndex] = question;

            return {
                ...prevData,
                questions: updatedQuestions
            };
        });
    }, []);

    const handleCorrectAnswerChange = useCallback((questionIndex, optionId) => {
        setCanvasData(prevData => {
            const updatedQuestions = [...prevData.questions];
            const question = { ...updatedQuestions[questionIndex] };

            // For single_choice, only one answer can be correct
            if (question.type === QUESTION_TYPES.SINGLE_CHOICE) {
                question.options = question.options.map(opt => ({
                    ...opt,
                    isCorrect: opt.id === optionId
                }));
            }
            // For multiple_choice, toggle the selected option
            else if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
                question.options = question.options.map(opt => ({
                    ...opt,
                    isCorrect: opt.id === optionId ? !opt.isCorrect : opt.isCorrect
                }));
            }
            // For text, there's only one option and it's always correct
            else if (question.type === QUESTION_TYPES.TEXT) {
                // No changes needed - text question has only one option and it's always correct
            }

            updatedQuestions[questionIndex] = question;
            return {
                ...prevData,
                questions: updatedQuestions
            };
        });
    }, []);

    // Navigation functions
    const scrollToQuestion = useCallback((index) => {
        setActiveQuestionIndex(index);

        const questionElement = document.getElementById(`question-${index}`);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const navigateToQuestion = useCallback((direction) => {
        if (direction === 'prev' && activeQuestionIndex > 0) {
            scrollToQuestion(activeQuestionIndex - 1);
        } else if (direction === 'next' && activeQuestionIndex < canvasData.questions.length - 1) {
            scrollToQuestion(activeQuestionIndex + 1);
        }
    }, [activeQuestionIndex, canvasData.questions.length, scrollToQuestion]);

    // Validation functions
    const validateCanvas = useCallback(() => {
        // Check title
        if (!canvasData.title.trim()) {
            toast.error("Please provide a title for your quiz");
            return false;
        }

        // Check questions
        if (canvasData.questions.length === 0) {
            toast.error("Please add at least one question");
            return false;
        }

        // Validate each question
        for (let i = 0; i < canvasData.questions.length; i++) {
            const question = canvasData.questions[i];

            // Check question text
            if (!question.question.trim()) {
                toast.error(`Question ${i + 1} has no text`);
                scrollToQuestion(i);
                return false;
            }

            // Validate based on question type
            if (question.type === QUESTION_TYPES.TEXT) {
                // Text questions need a correct answer
                if (!question.options[0]?.text.trim()) {
                    toast.error(`Question ${i + 1} has no correct answer specified`);
                    scrollToQuestion(i);
                    return false;
                }
            } else {
                // Choice questions need at least one correct option
                if (!question.options.some(o => o.isCorrect)) {
                    toast.error(`Question ${i + 1} has no correct answer selected`);
                    scrollToQuestion(i);
                    return false;
                }

                // Check if all options have text
                for (let j = 0; j < question.options.length; j++) {
                    const option = question.options[j];
                    if (option.isCorrect && !option.text.trim()) {
                        toast.error(`Question ${i + 1} has an empty correct answer option`);
                        scrollToQuestion(i);
                        return false;
                    }
                }
            }
        }

        return true;
    }, [canvasData, scrollToQuestion]);

    // Save function
    const handleSave = useCallback(async () => {
        // Validate form data
        if (!validateCanvas()) return;

        setUiState(prev => ({ ...prev, isSaving: true }));

        try {
            // Extract canvas metadata
            const canvasToSave = {
                title: canvasData.title,
                category: canvasData.category,
                description: canvasData.description
            };

            let savedCanvas;

            // Create or update canvas
            if (id) {
                await api.canvas.updateCanvas(id, canvasToSave);
                savedCanvas = { id };
                toast.success("Quiz updated successfully!");
            } else {
                savedCanvas = await api.canvas.createCanvas(canvasToSave);
                toast.success("Quiz created successfully!");
            }

            // Process questions
            const savePromises = canvasData.questions.map(question => {
                const questionToSave = {
                    ...question,
                    canva_id: savedCanvas.id
                };

                // Update or create question
                if (question.id && id) {
                    return api.question.updateQuestion(question.id, questionToSave);
                } else {
                    return api.question.createQuestion(questionToSave);
                }
            });

            // Wait for all questions to be saved
            await Promise.all(savePromises);

            // Navigate to appropriate page
            // navigate(id ? `/admin/canva/${id}` : '/admin/quizzes');

        } catch (error) {
            console.error("Failed to save canvas:", error);
            toast.error("Failed to save quiz. Please try again.");
        } finally {
            setUiState(prev => ({ ...prev, isSaving: false }));
        }
    }, [canvasData, id, validateCanvas, navigate]);

    // Loading state
    if (uiState.isLoading) {
        return (
            <div className="canva-edit-container">
                <div className="loading-indicator">
                    <h2>Loading quiz data...</h2>
                </div>
            </div>
        );
    }

    // Error state
    if (uiState.error) {
        return (
            <div className="canva-edit-container">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{uiState.error}</p>
                    <button onClick={() => navigate('/admin')} className="action-button secondary">
                        Back to Admin
                    </button>
                </div>
            </div>
        );
    }

    // Render the UI
    return (
        <div className="canva-edit-container">
            <div className="canva-edit-header">
                <h1>{id ? 'Edit' : 'Create'} Quiz</h1>
                <div className="canva-edit-actions">
                    <button className="action-button secondary" onClick={() => navigate(id ? `/admin/canva/${id}` : '/admin/quizzes')}>
                        Cancel
                    </button>
                    <button
                        className="action-button primary"
                        onClick={handleSave}
                        disabled={uiState.isSaving}
                    >
                        <i className="fas fa-save"></i> {uiState.isSaving ? 'Saving...' : 'Save Quiz'}
                    </button>
                </div>
            </div>

            <div className="canva-edit-content">
                {/* Quiz Information Sidebar */}
                <div className="canva-edit-sidebar">
                    <div className="sidebar-section">
                        <h3>Quiz Information</h3>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={canvasData.title}
                                onChange={handleCanvasInfoChange}
                                placeholder="Enter quiz title"
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
                                placeholder="Enter a description for your quiz"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Questions Editor */}
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
                                            <option value="multiple_choice">Multiple Choice</option>
                                            <option value="single_choice">Single Choice</option>
                                            <option value="text">Text Input</option>
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
                                    <label>
                                        {question.type === 'text' ? 'Correct Answer' : 'Answer Options'}
                                    </label>
                                    {question.type === 'text' ? (
                                        <div className="text-answer-editor">
                                            <p className="options-hint">Enter the correct answer text below. The answer is case-insensitive.</p>
                                            <input
                                                type="text"
                                                value={question.options[0]?.text || ''}
                                                onChange={(e) => handleOptionChange(qIndex, question.options[0].id, e.target.value)}
                                                placeholder="Enter correct answer"
                                                className="text-answer-input"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="options-hint">
                                                {question.type === 'single_choice'
                                                    ? 'Select the correct answer by clicking the radio button. Only one answer can be correct.'
                                                    : 'Select the correct answers by clicking the checkboxes. Multiple answers can be correct.'}
                                            </p>
                                            <div className="options-list">
                                                {question.options.map((option, index) => (
                                                    <div key={option.id} className="option-item">
                                                        <div className="option-selector">
                                                            {question.type === 'single_choice' ? (
                                                                <input
                                                                    type="radio"
                                                                    name={`correct-answer-${qIndex}`}
                                                                    checked={option.isCorrect}
                                                                    onChange={() => handleCorrectAnswerChange(qIndex, option.id)}
                                                                    id={`option-${qIndex}-${option.id}`}
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="checkbox"
                                                                    checked={option.isCorrect}
                                                                    onChange={() => handleCorrectAnswerChange(qIndex, option.id)}
                                                                    id={`option-${qIndex}-${option.id}`}
                                                                />
                                                            )}
                                                            <label
                                                                htmlFor={`option-${qIndex}-${option.id}`}
                                                                className="option-letter"
                                                            >
                                                                {['a', 'b', 'c', 'd', 'e'][index].toUpperCase()}
                                                            </label>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={option.text}
                                                            onChange={(e) => handleOptionChange(qIndex, option.id, e.target.value)}
                                                            className="option-text-input"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
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
