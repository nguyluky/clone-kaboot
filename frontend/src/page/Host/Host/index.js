import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import WaitingRoom from './WaitingRoom'
import PlayerScoreboard from './PlayerScoreboard'
import api from '../../../services/api.js'

import { ToastContainer, toast } from 'react-toastify';
import './Host.css'

export default function Host() {
    const { session_id } = useParams();
    const [session, setSession] = useState(null)

    const navigate = useNavigate()

    const fetchSession = async () => {
        try {
            const response = await api.session.getSessionById(session_id)
            setSession(response.data)
        } catch (err) {
            console.error('Error fetching session:', err);
            toast.error('Error fetching session');
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