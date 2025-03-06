
import api_config from '../../config/api_config';
import './Login.css'
import React, { useState } from 'react';
import { useNavigate } from "react-router";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(api_config.accounts.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                console.log(data);
                localStorage.setItem('token', data.token);
                navigate('/canvas');
            }
            else {
                alert('Login failed');
            }
        })

    }
    return (
        <div className='login'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}