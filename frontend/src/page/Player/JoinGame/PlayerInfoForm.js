import React , {useState} from 'react';
import { useSearchParams } from 'react-router';

export default function PlayerInfoForm({addPlayer , canvas}) {
    const [searchParams] = useSearchParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [std, setStd] = useState('');
    const [subject, setSubject] = useState('0');

    return (
        <>
        <form onSubmit={(e) => { e.preventDefault(); addPlayer(name, email, std, subject); }}>
            <input type='text' required value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
            <br />
            <input type='email' required pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
            <br />
            <input type='text' required pattern='[^a-z0-9A-Z_\x{00C0}-\x{00FF}\x{1EA0}-\x{1EFF}]' value={std} onChange={e => setStd(e.target.value)} placeholder='Std' />
            <br />
            {
                !searchParams.get('code') && 
            <select onChange={e => setSubject(e.target.value)} value={subject}>
                <option value='0' defaultChecked>Bạn muốn làm gì </option>
                {
                    canvas.map((item, index) => (
                        <option key={index} value={item.code_join}>{item.title}</option>
                    ))
                }
            </select>
            }
            <button type='submit'>Start Game</button>
        </form>
        </>
    );
}
