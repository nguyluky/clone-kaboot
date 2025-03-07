import React from 'react';

export default function GameCodeInputForm({ gameCode, setGameCode, checkGameCode }) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); checkGameCode(); }}>
            <h2>CYBERSOFT</h2>
            <input type="text" value={gameCode} onChange={e => setGameCode(e.target.value)} placeholder='Code' />
            <br />
            <button type='submit'>ENTER</button>
        </form>
    );
}
