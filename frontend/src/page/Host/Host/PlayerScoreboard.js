import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import apiconfig from '../../../config/api_config'
import './Host.css'

function PlayerScoreboard() {
    const { session_id } = useParams();
    const navigate = useNavigate();
    const [players, setPlayers] = useState([])
    const [questions, setQuestions] = useState([])

    const fetchQuestions = async () => {
        try {
            const response = await fetch(apiconfig.session.getSessionById + session_id + '/cau_hoi', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response.ok) {
                setQuestions(await response.json())
                return
            }
        } catch (err) {
            console.error('Error fetching questions:', err);
        }
    }

    const fetchPlayers = async () => {
        try {
            const response = await fetch(apiconfig.session.getSessionById + session_id + '/leaderboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                let data = await response.json();
                data = data.sort((a, b) => {
                    return - new Date(b.thoi_gian_ket_thuc) + new Date(a.thoi_gian_ket_thuc)
                })
                setPlayers(data)
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchPlayers();
        fetchQuestions();
    }, [])

    return (
        <div className='scoreboard-wrapper'>
            <div className='scoreboard-header'>
                <h1>Leaderboard</h1>
                <button onClick={() => navigate('/')}>Exit</button>
            </div>
            <div>
                <div className='scoreboard'>
                    <div className='scoreboard-players'>
                        {
                            players.map((player, index) => {
                                return (
                                    <div className='scoreboard-player' key={index}>
                                        <h3 className='player-rank'>{index + 1}</h3>
                                        <div className='player-info'>
                                            <h3>{player.name}</h3>
                                            <p>{player.email}</p>
                                        </div>
                                        <div className='player-score'>
                                            <p>{player.point}/{questions.length}</p>
                                        </div>
                                        <div className='player-submission-time'>
                                            <h3>{(new Date(player.thoi_gian_ket_thuc)).toLocaleTimeString("en-GB")}</h3>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerScoreboard;
