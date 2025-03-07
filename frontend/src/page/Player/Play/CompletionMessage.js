import React from 'react';

export default function CompletionMessage() {
    return (
        <div className='play__leaderboard' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} data-color-mode="light">
            <h1 style={{color: '#efefef', textAlign: 'center'}}>Chúc mừng bạn đã hoàn thành bài test.</h1>
        </div>
    );
}
