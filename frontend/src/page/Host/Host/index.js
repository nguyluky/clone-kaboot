
import React, { forwardRef, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import apiconfig from '../../../config/api_config'
import './Host.css'

function WaitingRoom({ rootID }) {
    const nav = useNavigate();
    const { session_id } = useParams();
    return <div className='waiting-room'>
        <div className="host__container">
            <div className="host-qr-code">
                <img src={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + window.location.origin + '?code=' + rootID} alt="QR Code" />
            </div>
            <div className="host__container__info">
                <h1>Mã phòng</h1>
                <h2>{rootID}</h2>

                <button onClick={() => {
                    nav('/host/' + session_id + '/leaderboard')
                }}></button>
            </div>
        </div>
        {/* <div className='host__players__counts'>
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
                        </div>
                    </div>
                })
            }
        </div> */}
    </div>;
}

export function LeaderBoard() {
    const { session_id } = useParams();
    const nav = useNavigate();
    const [players, setPlayers] = useState([])
    const [cauhoi, setCauhoi] = useState([])

    const getSession = async () => {
        try {
            const resp = await fetch(apiconfig.session.getSessionById + session_id + '/cau_hoi', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }

            })
            if (resp.ok) {
                setCauhoi(await resp.json())
                return
            }
        } catch (err) {
            console.error('Error fetching questions:', err);
        }
    }

    const getPlayers = async () => {
        try {
            const res = await fetch(apiconfig.session.getSessionById + session_id + '/leaderboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (res.ok) {
                let data = await res.json();
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
        getPlayers();
        getSession();
    }, [])

    return <div className='leaderboard-wrapper'>
        <div className='leaderboard__header'>
            <h1>LeaderBoard</h1>
            <button onClick={() => nav('/')}>Exit</button>
        </div>

        <div>
            <div className='leaderboard'>
                <div div className='leaderboard__players'>
                    {
                        players.map((player, index) => {
                            return <div className='leaderboard__player' key={index}>
                                <h3 className='leaderboard__player__stt'>{index + 1}</h3>
                                {/* <div className='leaderboard__player__avt'>
                                    <img src={'https://avatar.iran.liara.run/username?username=' + player.name} alt='avt' />
                                </div> */}
                                <div className='leaderboard__player__info'>
                                    <h3>{player.name}</h3>
                                    <p>{player.email}</p>
                                </div>
                                <div className='leaderboard__player__score'>
                                    <p>{player.point}/{cauhoi.length}</p>
                                </div>
                                <div className='leaderboard__player__thoi_gian_nop'>
                                    <h3>{(new Date(player.thoi_gian_ket_thuc)).toLocaleTimeString("en-GB")}</h3>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>

        </div>
    </div>
}

export default function Host() {
    const { session_id } = useParams();
    const [players, setPlayers] = useState([])
    const [session, setSession] = useState(null)

    const setintervalRef = React.useRef(null)

    const nav = useNavigate()

    const getSession = async () => {
        try {

            const res = await fetch(apiconfig.session.getSessionById + session_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (res.ok) {
                const data = await res.json()
                setSession(data)
                return
            }

            nav('/404')
        }
        catch (err) {
            console.log(err)
            nav('/404')
        }
    }

    const getPlayers = async () => {
        try {

            const res = await fetch(apiconfig.session.getSessionById + session_id + '/leaderboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (res.ok) {
                const data = await res.json()
                setPlayers(data)
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getSession();
    }, [])

    useEffect(() => {
        if (setintervalRef.current) clearInterval(setintervalRef.current);

        setintervalRef.current = setInterval(() => {
            getPlayers();
            clearInterval(setintervalRef.current);
        }, 1000)

        return () => {
            if (setintervalRef.current) clearInterval(setintervalRef.current);
        }
    }, [session, session])

    const handleEndGame = () => {
        console.log('end game')
        fetch(apiconfig.session.updateSession + session_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: session.title,
                code_join: session.code_join,
                canva_id: session.canva_id,
                thoi_gian_bat_dau: session.thoi_gian_bat_dau,
                trang_thai: 'ket_thu',
            }),
        }).then(async (res) => {
            if (!res.ok) {
                return;
            }

            if (setintervalRef.current) clearInterval(setintervalRef.current);

            setSession(data => {
                return {
                    ...data,
                    trang_thai: 'ket_thuc',
                }
            })
        }).catch(err => {
            console.log(err);
        })
    }

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
                trang_thai: 'dang_choi',
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
                <WaitingRoom rootID={session?.code_join} players={players} onStartGame={handleStartGame} />
        </div>
    )
}