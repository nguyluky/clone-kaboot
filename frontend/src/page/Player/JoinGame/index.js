import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import './JoinGame.css';
import api_confg from '../../../config/api_config';
import { v4 as uuidv4 } from 'uuid';

export default function JoinGame() {
    const [search, setSearch] = useSearchParams();
    const [gameCode, setGameCode] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [std, setStd] = useState('');
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    const checkGameCode = async (code) => {
        setLoading(true);
        fetch(api_confg.session.getSessionByCodeJoin + (code ? code : gameCode), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            setLoading(false);
            if (res.status !== 200) {
                alert('Game not found');
                return;
            }
            const data = await res.json()
            setSessionId(data.session_id);
        }).catch(err => {
            alert('error');
            console.log(err);
        })
    }

    const addPlayer = async () => {
        setLoading(true);
        const uuid = uuidv4();
        sessionStorage.setItem('player', JSON.stringify({
            uuid,
            session_id: sessionId,
            name,
            email,
            std,
            thoi_gian_vao: new Date().toISOString(),
        }));
        sessionStorage.setItem('session_id', sessionId);
        nav('/play');
    }


    useEffect(() => {
        if (!search.get('code') ) return
        checkGameCode(search.get('code'));
    }, [gameCode])

    return (
        <div className="JoinGame">
            <div className='wrapper-join-game'>

                {!sessionId ? (
                    <form onSubmit={(e) => { e.preventDefault(); checkGameCode(); }}>
                        <h2>CYBERSOFT</h2>
                        <input type="text" value={gameCode} onChange={e => setGameCode(e.target.value)} placeholder='Code' />
                        <br />
                        <button type='submit'>ENTER</button>
                    </form>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); addPlayer(); }}>
                        <h2>CYBERSOFT</h2>
                        <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
                        <br />
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
                        <br />
                        <input type='text' value={std} onChange={e => setStd(e.target.value)} placeholder='Std' />
                        <br />
                        <button type='submit'>Start Game</button>
                    </form>
                )}
            </div>
            {
                loading && (
                    <div className='loading'>
                        <h2>đợi tí</h2>
                        <div className='lds-dual-ring'></div>
                    </div>
                )
            }
        </div>
    );
}