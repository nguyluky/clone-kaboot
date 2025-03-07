import './Play.css';
import React, { useState, useEffect } from 'react';
import apiconfig from '../../../config/api_config';
import { useNavigate } from 'react-router';
import Loading from './Loading';
import CompletionMessage from './CompletionMessage';
import QuestionDisplay from './QuestionDisplay';
import AnswerResult from './AnswerResult';

export default function Play() {
    const [sessionId] = useState(sessionStorage.getItem('session_id') || '');
    const [player] = useState(JSON.parse(sessionStorage.getItem('player') || '{}'));
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [selectedAnswer, setSelectedAnswer] = useState();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch(apiconfig.session.getSessionById + sessionId + '/cau_hoi', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res.status !== 200) {
                navigate('/');
                return;
            }
            const data = await res.json();
            setQuestions(data);
            setLoading(false);
            const currentQuestionIndex = data.findIndex(e => !e.da_tra_loi);
            setCurrentQuestionIndex(currentQuestionIndex === -1 ? data.length : currentQuestionIndex);
        } catch (err) {
            console.error('Error fetching questions:', err);
            navigate('/');
        }
    };

    const submitAnswers = async () => {
        try {
            const res = await fetch(apiconfig.player.addPlayer, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    ...player,
                    thoi_gian_ket_thuc: new Date().toISOString(),
                    bai_lam: answers,
                })
            });
            if (!res.ok) {
                console.error('Error submitting answers:', res);
                return;
            }
            setIsSubmitted(true);
            const data = await res.json();
            sessionStorage.clear();
        } catch (err) {
            console.error('Error submitting answers:', err);
        }
    };

    const saveAnswer = (answer) => {
        if (!selectedAnswer && !answer) return;
        const currentAnswer = answer ? answer : selectedAnswer;
        setAnswers(prevAnswers => {
            const questionIndex = prevAnswers.findIndex(e => e.cau_hoi_id === questions[currentQuestionIndex]?.cau_hoi_id);
            if (questionIndex === -1) {
                return [...prevAnswers, {
                    cau_hoi_id: questions[currentQuestionIndex]?.cau_hoi_id,
                    lua_chon_id: currentAnswer?.lua_chon_id,
                    thoi_gian_con_lai: 0,
                    thoi_gian_nop: new Date().getTime()
                }];
            }
            prevAnswers[questionIndex].lua_chon_id = currentAnswer?.lua_chon_id;
            prevAnswers[questionIndex].thoi_gian_con_lai = 0;
            prevAnswers[questionIndex].thoi_gian_nop = new Date().getTime();
            return [...prevAnswers];
        });
    };

    const goToPreviousQuestion = () => {
        let prevQuestionIndex = currentQuestionIndex - 1;
        if (prevQuestionIndex < 0) {
            prevQuestionIndex = questions.length - 1;
        }
        setSelectedAnswer(answers.find(e => e.cau_hoi_id === questions[prevQuestionIndex]?.cau_hoi_id));
        setCurrentQuestionIndex(prevQuestionIndex);
    };

    const goToNextQuestion = () => {
        let nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex >= questions.length) {
            nextQuestionIndex = 0;
        }
        setSelectedAnswer(answers.find(e => e.cau_hoi_id === questions[nextQuestionIndex]?.cau_hoi_id));
        setCurrentQuestionIndex(nextQuestionIndex);
    };

    const handleAnswerSelection = (answer) => {
        setSelectedAnswer(answer);
        saveAnswer(answer);
    };

    return (
        isSubmitted ?
            <CompletionMessage session_id={sessionId}/> :
            <div className='play' data-color-mode="light">
                <div className='play__footer'>
                    <div className='play__footer-left'>
                        <span>Bài kiểm</span>
                    </div>
                    <div className='play__footer-right'>
                        <button className='play__button' onClick={submitAnswers}>Nộp bài</button>
                    </div>
                </div>
                <div className='play__container'>
                    {
                        loading ?
                            <Loading /> :
                            <QuestionDisplay question={questions[currentQuestionIndex]} onAnswer={handleAnswerSelection} answer={selectedAnswer} />
                    }
                </div>
                <div className='play__navigation'>
                    <button className='play__button' onClick={goToPreviousQuestion}>quay lại</button>
                    <span>{Math.min(currentQuestionIndex + 1, questions.length)}/{questions.length}</span>
                    <button className='play__button' onClick={goToNextQuestion}>tiếp</button>
                </div>
            </div>
    );
}