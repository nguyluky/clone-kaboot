import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import './JoinGame.css';
import { v4 as uuidv4 } from 'uuid';
import PlayerInfoForm from './PlayerInfoForm';
import AnimatedNetwork from '../../../components/Background/AnimatedNetwork';
import logo from '../../../assets/images/logo.png';
import {toast} from 'react-toastify'
// import api from '../../../services/api';

export default function JoinGame() {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [publicSession, setPublicSession] = useState([]);

    const navigate = useNavigate();

    const addPlayer = async (
        name, email, sdt, code
    ) => {
        console.log(name, email, sdt, code);
        setIsLoading(true);
        sessionStorage.setItem('player', JSON.stringify({
            name,
            email,
            sdt,
            thoi_gian_vao: new Date().toISOString(),
        }));
        sessionStorage.setItem('code', code ?? searchParams.get('code'));
        navigate('/play');
    }

    const fetchCanva = async () => {
        // try {
        //     const res = await api.sessionApi.getPublicSessions();
        //     setPublicSession(res);
        // } catch (err) {
        //     console.error('Error fetching canva:', err);
        //     toast.error('Không tìm thấy bài kiểm tra'); 
        // }
    }

    useEffect(() => {
        fetchCanva();
    }, []);

    return (

        <div className="join-game">
            <img className='join-game__logo' src={logo}></img>
            <AnimatedNetwork />
            <div className='join-game__wrapper'>
                <div className='join-game__title'>
                    <h2>CYBERSOFT </h2>
                    <p>Chào mường bạn đến bài kiểm tra</p>
                </div>
                <PlayerInfoForm addPlayer={addPlayer} canvas={publicSession}/>
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