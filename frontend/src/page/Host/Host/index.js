import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import apiconfig from '../../../config/api_config'
import WaitingRoom from './WaitingRoom'
import PlayerScoreboard from './PlayerScoreboard'
import './Host.css'

export default function Host() {
    const { session_id } = useParams();
    const [session, setSession] = useState(null)

    const navigate = useNavigate()

    const fetchSession = async () => {
        try {
            const response = await fetch(apiconfig.session.getSessionById + session_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response.ok) {
                const data = await response.json()
                setSession(data)
                return
            }

            navigate('/404')
        } catch (err) {
            console.log(err)
            navigate('/404')
        }
    }

    useEffect(() => {
        fetchSession()
    }, [])

    return (
        <div className="host-container">
            <WaitingRoom rootID={session?.code_join} />
        </div>
    )
}