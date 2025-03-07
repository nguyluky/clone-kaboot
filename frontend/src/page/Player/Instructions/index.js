
import React, { useEffect, useRef, useState } from 'react';
import './Instructions.css';
import { useNavigate } from 'react-router';
import api_config from '../../../config/api_config';

export default function Instructions() {
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [session_id, setSessionId] = useState(localStorage.getItem('session_id') || '');
    const [loading, setLoading] = useState(false);
    const [countDown, setCountDown] = useState(-1);
    const [sl, setSl] = useState(0);


    const countDownInterval = useRef(null);
    const getTimeInterval = useRef(null);


    const nav = useNavigate();

    const checkTime = async () => {
        fetch(api_config.session.getSessionById + session_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (res.status !== 200) {
                return;
            }
            const data = await res.json();
            console.log(data.thoi_gian_bat_dau);

            nav('/play');

        }).catch(err => {
            console.log(err);
        })
    }

    const getLeaderBoard = async () => {
        fetch(api_config.session.getSessionById + session_id + '/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (res.status !== 200) {
                return;
            }
            const data = await res.json();
            setSl(data.length);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        if (getTimeInterval.current) clearInterval(getTimeInterval.current);
        getTimeInterval.current = setInterval(() => {
            checkTime();
            getLeaderBoard();
        }, 1000)

        return () => {
            console.log('clear interval');
            clearInterval(getTimeInterval.current);
        }
    }, []);

    const changeName = async () => {
        // TODO:
    }

    return (
        <div className="instructions">
            {
                countDown > 0 ?? (
                    <div className='instructions-countdown'>
                        {countDown === 0 ? 'Starting...' : countDown / 1000}
                    </div>
                )
            }
            <div className='instructions-header'>
                <div className='instructions-header-left'>
                    PIN: 123456
                </div>
                <div className='instructions-header-right'>
                    <span>{sl}</span> Players
                </div>

            </div>
            <div className='instructions-container'>
                {countDown < 10 * 1000 && countDown > -1? (<h2>Game sẽ bắt sau {Math.round(countDown / 1000)}s</h2>) :
                    <>
                        <h2>Bạn đã vào phòng</h2>
                        <p>Đợi những người khác tham gia</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            console.log('Joining game', name);
                        }}
                        >
                            <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
                            <br />
                            <button type='submit'>Change Name</button>
                        </form>
                    </>
                }
            </div>
        </div>
    );
}