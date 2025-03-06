
import React, { forwardRef, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import apiconfig from '../../../config/api_config'
import './Host.css'

function WaitingRoom({rootID, players, onStartGame}) {
    return <div className='waiting-room'>
        <div className="host__container">
            <div className="host-qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HelloWorld" alt="QR Code" />
            </div>
            <div className="host__container__info">
                <h1>Mã phòng</h1>
                <h2>{rootID}</h2>
                <button onClick={onStartGame}>Bắt đầu</button>
            </div>
        </div>
        <div className='host__players__counts'>
            <h2>Người chơi: {players?.length}</h2>
        </div>
        <div className='host__players'>
            {
                players.map((player, index) => {
                    return <div className='host__player' key={index}>
                        <div className='host__player__avt'>
                            <img src={'https://avatar.iran.liara.run/username?username=' + player.name} alt='avt' />
                        </div>
                        <div className='host__player__info'>
                            <h3>{player.name}</h3>
                        </div>
                        <div className='host__player__action'>
                            {/* <button>Kick</button> */}
                        </div>
                    </div>
                })
            }
        </div>
    </div>;
}

export function LeaderBoard({players}) {
    const nav = useNavigate();

    return <div className='leaderboard-wrapper'>
        <div className='leaderboard__header'>
            <h1>LeaderBoard</h1>
            <button onClick={() => nav('/')}>Exit</button>
        </div>
     <div className='leaderboard'>
        <div div className='leaderboard__players'>
            {
                players.map((player, index) => {
                    return <div className='leaderboard__player' key={index}>
                        <h3 className='leaderboard__player__stt'>{index + 1}</h3>
                        <div className='leaderboard__player__avt'>
                            <img src={'https://avatar.iran.liara.run/username?username=' + player.name} alt='avt' />
                        </div>
                        <div className='leaderboard__player__info'>
                            <h3>{player.name}</h3>
                        </div>
                        <div className='leaderboard__player__score'>
                            <h3>{player.point}</h3>
                        </div>
                    </div>
                })
            }
        </div>

    </div>
        </div>
}

export default function Host() {
    const {session_id} = useParams();
    const [players, setPlayers] = useState([])
    const [session, setSession] = useState(null)
    
    const setintervalRef = React.useRef(null)


    const nav = useNavigate()

    useEffect(() => {
        fetch(apiconfig.session.getSessionById + session_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setSession(data)
                return
            }

            nav('/404')
        })

    }, [])

    useEffect(() => {
        if (setintervalRef.current) clearInterval(setintervalRef.current);


        setintervalRef.current =  setInterval(() => {
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
            setPlayers(data)
        }).catch(err => {
            console.log(err);
        })}, 1000)

        return () => {
            if (setintervalRef.current) clearInterval(setintervalRef.current);
        }
    }, [session])

    const handleStartGame = () => {
        console.log('start game')
        const n = new Date();
        // add 10 seconds
        n.setSeconds(n.getSeconds() + 10);
        fetch(apiconfig.session.updateSession + session_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: session.title,
                code_join: session.code_join,
                canva_id: session.canva_id,
                thoi_gian_bat_dau: n,
                trang_thai: 1,
            }),
        }).then(async (res) => {
            if (!res.ok) {
                return;
            }
            setSession(data => {
                return {
                    ...data,
                    thoi_gian_bat_dau: n,
                    trang_thai: 'dang_choi',
                }
            })
        }).catch(err => {
            console.log(err);
        })
    } 


    return (
        <div className="host">
            {session?.thoi_gian_bat_dau ? 
            <LeaderBoard players={players}/> : 
            <WaitingRoom rootID={session?.code_join} players={players} onStartGame={handleStartGame}/>
            }
            {/* <LeaderBoard players={players}/> */}
        </div>
    )
}