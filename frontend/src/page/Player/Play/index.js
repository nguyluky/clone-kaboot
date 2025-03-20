import './Play.css';
import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify'
// import api from '../../../services/api';
import Loading from './Loading';
import CompletionMessage from './CompletionMessage';
import QuestionDisplay from './QuestionDisplay';

/**
 * 
 * @typedef {Object} AnswerType
 * @property {number} cau_hoi_id - ID của câu hỏi
 * @property {number} lua_chon_id - ID của lựa chọn
 * @property {number} thoi_gian_con_lai - Thời gian còn lại khi trả lời
 * @property {string|number} thoi_gian_nop - Thời gian nộp bài
 */


export default function Play() {
    const code = sessionStorage.getItem('code') || "??";
    const player = JSON.parse(sessionStorage.getItem('player') || '{}')

    const [loading, setLoading] = useState(true);
    /** @type {useStateReturnType<CauHoiWithLuaChonType[]>} */
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState();
    const [isSubmitted, setIsSubmitted] = useState(false);

    /** @type {useStateReturnType<AnswerType[]>} */
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (code == "??" || !player) {
            console.error('Code or player not found');
            // TODO:
            return;
        }
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        // try {
        //     const res = await api.sessionApi.getQuestions(code);
        //     setQuestions(res);
        //     setLoading(false);
        // } catch (err) {
        //     console.error('Error fetching questions:', err);
        // }
    };

    const submitAnswers = async () => {
        // try {
        //     const res = await api.sessionApi.submitAnswers(code, {
        //         player: player,
        //         answers: answers
        //     });
        //     setIsSubmitted(true);
        //     sessionStorage.clear();
        // } catch (err) {
        //     console.error('Error submitting answers:', err);
        //     // toast.error('Có lỗi xảy ra khi nộp bài, vui lòng thử lại sau');
        // }
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
            <CompletionMessage session_id={code}/> :
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