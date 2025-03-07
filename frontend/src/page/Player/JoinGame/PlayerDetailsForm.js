import React from 'react';

export default function PlayerDetailsForm({ name, setName, email, setEmail, std, setStd, addPlayer }) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); addPlayer(); }}>
            <h2>CYBERSOFT</h2>
            <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
            <br />
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
            <br />
            <input type='text' value={std} onChange={e => setStd(e.target.value)} placeholder='Std' />
            <br />
            <button type='submit'>Start Game</button>
        </form>
    );
}
