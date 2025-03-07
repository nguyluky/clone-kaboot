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

function LeaderBoard({ session_id, user_id }) {
    const [players, setPlayers] = useState([]);
    const [userRank, setUserRank] = useState(null);

    useEffect(() => {
        fetch(apiconfig.session.getSessionById + session_id + '/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (res.status !== 200) {
                return;
            }
            const data = await res.json();
            setPlayers(data);
            const rank = data.findIndex(player => player.uuid === user_id) + 1;
            setUserRank(rank);
        }).catch(err => {
            console.log(err);
        });
    }, [session_id, user_id]);

    return (
        <div className='Play-leader-board' data-color-mode="light">
            <LeaderBoard_ players={players} userRank={userRank} />
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
function Question({ question, onAnswer }) {
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
                {answers?.map((answer, index) => (
                    <div key={index} className='answer' style={{
                        backgroundColor: colors[index]
                    }} onClick={() => onAnswer(answer)}>
                        <input type='radio' name='answer' value={answer} />
                        <MDEditor.Markdown source={answer.noi_dung} style={{ backgroundColor: "transparent", fontSize: "1.3rem", fontFamily: "Roboto", whiteSpace: 'pre-wrap', maxWidth: '100%' }} />
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
    /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
    const [sessionId, setSessionId] = useState(localStorage.getItem('session_id') || '');
    /**
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]
     */
    const [userId, setUserId] = useState(localStorage.getItem('uuid'));
    const [loading, setLoading] = useState(true);

    /**
     * @type {[{noi_dung: string, lua_chon: [], thoi_gian: number, da_tra_loi: boolean}[], React.Dispatch<React.SetStateAction<{noi_dung: string, lua_chon: [], thoi_gian: number, da_tra_loi: boolean}[]>>]}
     */
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(-1);

    const [score, setScore] = useState(0);
    const [countDown, setCountDown] = useState(-1);
    const [startTime, setStartTime] = useState(null);
    const [result, setResult] = useState(-1);

    const countDownRef = useRef(null);

    const nav = useNavigate();

    useEffect(() => {
        fetch(apiconfig.session.getSessionById + sessionId + '/cau_hoi?user_id=' + userId, {
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
            nextQuestion();
            setLoading(false);
            let currentQuestion = data.findIndex(e => !e.da_tra_loi);
            setCurrentQuestion(currentQuestion === -1 ? data.length : currentQuestion);
            setCountDown(data[currentQuestion]?.thoi_gian || -1);
        }).catch(err => {
            console.error('Error fetching questions:', err);
            nav('/');
        })


    }, [])

    useEffect(() => {
        if (currentQuestion === questions.length) {
            console.log('done')
            return;
        }

        if (countDownRef.current) clearInterval(countDownRef.current);

        countDownRef.current = setInterval(() => {
            setCountDown(c => {
                if (c === 0) {
                    handleAnswer(null)
                    return -1;
                }
                if (c <= 0) return -1;
                return c - 1;
            });
        }, 1000)
        return () => clearInterval(countDownRef.current);
    }, [currentQuestion])

    const nextQuestion = () => {
        let nextQuestionCurr = currentQuestion + 1;
    
        while (nextQuestionCurr <= questions.length && questions[nextQuestionCurr]?.da_tra_loi) {
            nextQuestionCurr++;
        }

        console.log(nextQuestionCurr)
        console.log(questions[nextQuestionCurr])
        setCurrentQuestion(nextQuestionCurr);
        setCountDown(questions[nextQuestionCurr]?.thoi_gian || -1);
        setStartTime(new Date().getTime());
    }

    const handleAnswer = (answer) => {
        if (answer) {
            fetch(apiconfig.session.getSessionById + sessionId + '/tra_loi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    lua_chon_id: answer.lua_chon_id,
                    thoi_gian_con_lai: Math.floor(new Date().getTime() - startTime) / 10,
                    thoi_gian_lop: new Date().getTime()
                })
            }).then(async res => {
                if (res.status === 200) {
                    const data = await res.json();
                    setScore(data.user.point);
                    setResult(data.dung ? 1 : 0);
                }
                else {
                    setResult(0);
                }
            }).catch(err => {
                console.error('Error submitting answer:', err);
                setResult(0);
            });
        } else {
            setResult(0);
        }

        setTimeout(() => {
            setResult(-1);
            nextQuestion();
        }, 1500);

    }

    return (

        currentQuestion === questions.length ?
            <LeaderBoard session_id={sessionId} user_id={userId} /> :
            <div className='Play' data-color-mode="light">
                <div className='play-footer'>
                    <div className='play-footer-left'>
                        <span>Score: {score}</span>
                        <span>Question: {Math.min(currentQuestion + 1, questions.length)}/{questions.length}</span>
                    </div>
                    <div className='play-footer-right'>
                        <span>Time: {countDown}s </span>
                    </div>
                </div>
                <div className='play-container'>
                    {
                        result !== -1 ?
                            <Result result={result} /> :
                            loading ?
                                <Ready /> :
                                <Question question={questions[currentQuestion]} onAnswer={handleAnswer} />
                    }
                </div>
            </div>
    )

}