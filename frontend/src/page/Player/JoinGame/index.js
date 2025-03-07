import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import './JoinGame.css';
import api_confg from '../../../config/api_config';
import { v4 as uuidv4 } from 'uuid';
import GameCodeInputForm from './GameCodeInputForm';
import PlayerInfoForm from './PlayerInfoForm';

export default function JoinGame() {
    const [searchParams] = useSearchParams();
    const [gameCode, setGameCode] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [playerEmail, setPlayerEmail] = useState('');
    const [playerStd, setPlayerStd] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const checkGameCode = async (code) => {
        setIsLoading(true);
        fetch(api_confg.session.getSessionByCodeJoin + (code ? code : gameCode), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            setIsLoading(false);
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
        setIsLoading(true);
        const uuid = uuidv4();
        sessionStorage.setItem('player', JSON.stringify({
            uuid,
            session_id: sessionId,
            name: playerName,
            email: playerEmail,
            std: playerStd,
            thoi_gian_vao: new Date().toISOString(),
        }));
        sessionStorage.setItem('session_id', sessionId);
        navigate('/play');
    }

    useEffect(() => {
        if (!searchParams.get('code')) return;
        checkGameCode(searchParams.get('code'));
    }, [gameCode]);

    return (
        <div className="join-game">
            <div className='join-game__wrapper'>
                {!sessionId ? (
                    <GameCodeInputForm gameCode={gameCode} setGameCode={setGameCode} checkGameCode={checkGameCode} />
                ) : (
                    <PlayerInfoForm name={playerName} setName={setPlayerName} email={playerEmail} setEmail={setPlayerEmail} std={playerStd} setStd={setPlayerStd} addPlayer={addPlayer} />
                )}
            </div>
            {
                isLoading && (
                    <div className='join-game__loading'>
                        <h2>đợi tí</h2>
                        <div className='lds-dual-ring'></div>
                    </div>
                )
            }
        </div>
    );
}