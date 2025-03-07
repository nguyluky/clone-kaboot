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
    const [sessionId, setSessionId] = useState(sessionStorage.getItem('session_id') || '');
    /**
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]
     */
    const [player, setPlayer] = useState(JSON.parse(sessionStorage.getItem('player') || '{}'));
    const [loading, setLoading] = useState(true);

    /**
     * @type {[{noi_dung: string, lua_chon: [], thoi_gian: number, da_tra_loi: boolean}[], React.Dispatch<React.SetStateAction<{noi_dung: string, lua_chon: [], thoi_gian: number, da_tra_loi: boolean}[]>>]}
     */
    const [questions, setQuestions] = useState([]);
    const [bai_lam, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(-1);

    const [score, setScore] = useState(0);
    const [countDown, setCountDown] = useState(-1);
    const [startTime, setStartTime] = useState(null);
    const [result, setResult] = useState(-1);

    const countDownRef = useRef(null);

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
            if (res.status !== 200) {
                console.error('Error fetching questions:', res);
                return;
            }
            const data = await res.json();
            setScore(data.diem);
            setResult(1);
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
            handleNopBai();
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
        setAnswers([...bai_lam, {
            lua_chon_id: answer?.lua_chon_id,
            thoi_gian_con_lai: countDown,
            thoi_gian_lop: new Date().getTime()
        }]);

        nextQuestion();
    }

    return (
        currentQuestion === questions.length ?
            <LeaderBoard session_id={sessionId}/> :
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