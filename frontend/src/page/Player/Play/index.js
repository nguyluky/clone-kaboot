import './Play.css';
import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import apiconfig from '../../../config/api_config';
import { useNavigate } from 'react-router';
import { LeaderBoard as LeaderBoard_ } from '../../Host/Host';

function Ready() {
    return (
        <div>
            <h1>Ready</h1>
        </div>
    )
}

function LeaderBoard() {

    return (
        <div className='Play-leader-board' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} data-color-mode="light">
            <h1 style={{color: '#efefef', textAlign: 'center'}}>Chúc mừng bạn đã hoàn thành bài test.</h1>
        </div>
    );
}

/**
 * 
 * @param {{
 * question: string,
 * answers: []
 * }} param0 
 * @returns 
 */
function Question({ question, onAnswer, answer }) {
    const colors = [
        "#FFEB3B",
        "#FF9800",
        "#F44336",
        "#03DAC6",
        "#E91E63",
        "#FFFFFF",
        "#90CAF9"
    ]

    const answers = question?.lua_chon;
    return (
        <div className='question-wrapper' >
            <div className='question'>
                <MDEditor.Markdown source={question?.noi_dung} style={{ backgroundColor: "transparent", fontSize: "1.3rem", fontFamily: "Roboto", whiteSpace: 'pre-wrap', maxWidth: '100%' }} />
            </div>
            <div className='answers'>
                {answers?.map((a, index) => (
                    <div key={index} className={'answer' + (a.lua_chon_id == answer?.lua_chon_id ? ' sele' : '')} style={{
                        backgroundColor: colors[index],
                    }} onClick={() => onAnswer(a)}>
                        <input type='radio' name='answer' value={a} />
                        <MDEditor.Markdown source={a.noi_dung} style={{ backgroundColor: "transparent", fontSize: "1.3rem", fontFamily: "Roboto", whiteSpace: 'pre-wrap', maxWidth: '100%' }} />
                    </div>
                ))}
            </div>
        </div>
    )
}

function Result({ result }) {
    return (
        <div className={`Result ${result === 1 ? 'correct' : 'incorrect'}`}>
            <div className='Result__content'>
                <h1>{result === 1 ? 'Correct' : 'Incorrect'}</h1>
            </div>
        </div>
    );
}

export default function Play() {
    const [sessionId, setSessionId] = useState(sessionStorage.getItem('session_id') || '');
    const [player, setPlayer] = useState(JSON.parse(sessionStorage.getItem('player') || '{}'));
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [bai_lam, setBaiLam] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [answersTem, setAnswersTem] = useState();
    const [isNopBai, setIsNopBai] = useState(false);

    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(null);

    const nav = useNavigate();

    const handleNopBai = () => {
        fetch(apiconfig.player.addPlayer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                ...player,
                thoi_gian_ket_thuc: new Date().toISOString(),
                bai_lam: bai_lam,
            })
        }).then(async res => {
            if (!res.ok) {
                console.error('Error fetching questions:', res);
                return;
            }
            setIsNopBai(true);
            const data = await res.json();
            setScore(data.diem);
            sessionStorage.clear();
        }).catch(err => {
            console.error('Error fetching questions:', err);
        })
    }

    useEffect(() => {
        fetch(apiconfig.session.getSessionById + sessionId + '/cau_hoi', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async res => {
            if (res.status !== 200) {
                nav('/')
                return;
            }
            let data = await res.json();
            setQuestions(data);
            setLoading(false);
            let currentQuestion = data.findIndex(e => !e.da_tra_loi);
            setCurrentQuestion(currentQuestion === -1 ? data.length : currentQuestion);
        }).catch(err => {
            console.error('Error fetching questions:', err);
            nav('/');
        })

    }, [])


    const saveAnswer = (answer) => {
        if (!answersTem && !answer) return;
        const a = answer ? answer : answersTem; 
        setBaiLam(e => {
            const cau_index = e.findIndex(e => e.cau_hoi_id === questions[currentQuestion]?.cau_hoi_id);
            
            if (cau_index === -1) {
                return [...e, {
                    cau_hoi_id: questions[currentQuestion]?.cau_hoi_id,
                    lua_chon_id: a?.lua_chon_id,
                    thoi_gian_con_lai: 0,
                    thoi_gian_nop: new Date().getTime()
                }]
            }
            e[cau_index].lua_chon_id = a?.lua_chon_id;
            e[cau_index].thoi_gian_con_lai = 0;
            e[cau_index].thoi_gian_nop = new Date().getTime();

            return [...e];

        });
    }

    const prevQuestion = () => {
        let prevQuestionCurr = currentQuestion - 1;
        if (prevQuestionCurr < 0) {
            prevQuestionCurr = questions.length - 1;
        }

        setAnswersTem(bai_lam.find(e => e.cau_hoi_id === questions[prevQuestionCurr]?.cau_hoi_id));
        setCurrentQuestion(prevQuestionCurr);
        setStartTime(new Date().getTime());
    }
        

    const nextQuestion = () => {
        let nextQuestionCurr = currentQuestion + 1;
        if (nextQuestionCurr >= questions.length) {
            nextQuestionCurr = 0;
        }

        setAnswersTem(bai_lam.find(e => e.cau_hoi_id === questions[nextQuestionCurr]?.cau_hoi_id));
        setCurrentQuestion(nextQuestionCurr);
        setStartTime(new Date().getTime());


    }

    const handleAnswer = (answer) => {
        setAnswersTem(answer);
        saveAnswer(answer);
    }

    console.log(bai_lam)

    return (
        isNopBai ?
            <LeaderBoard session_id={sessionId}/> :
            <div className='Play' data-color-mode="light">
                <div className='play-footer'>
                    <div className='play-footer-left'>
                        <span>Bài kiểm</span>
                    </div>
                    <div className='play-footer-right'>
                        <button onClick={handleNopBai}>Nộp bài</button>
                    </div>
                </div>
                <div className='play-container'>
                    {
                            loading ?
                                <Ready /> :
                                <Question question={questions[currentQuestion]} onAnswer={handleAnswer} answer={answersTem} />
                    }
                </div>
                <div className='play-navigation'>
                        <button onClick={prevQuestion}>quay lại</button>
                        <span>{Math.min(currentQuestion + 1, questions.length)}/{questions.length}</span>
                        <button onClick={nextQuestion}>tiếp</button>
                </div>
            </div>
    )

}