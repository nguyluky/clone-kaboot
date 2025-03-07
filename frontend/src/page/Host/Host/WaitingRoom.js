import React from 'react'
import { useNavigate, useParams } from 'react-router'
import './Host.css'

function WaitingRoom({ rootID }) {
    const navigate = useNavigate();
    const { session_id } = useParams();
    return (
        <div className='waiting-room-container'>
            <div className="waiting-room-content">
                <div className="qr-code">
                    <img src={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + window.location.origin + '?code=' + rootID} alt="QR Code" />
                </div>
                <div className="room-info">
                    <h1>Room Code</h1>
                    <h2>{rootID}</h2>
                    <button onClick={() => {
                        navigate('/host/' + session_id + '/leaderboard')
                    }}>View Leaderboard</button>
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
