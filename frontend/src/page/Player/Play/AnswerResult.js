import React from 'react';

export default function AnswerResult({ result }) {
    return (
        <div className={`result ${result === 1 ? 'result--correct' : 'result--incorrect'}`}>
            <div className='result__content'>
                <h1>{result === 1 ? 'Correct' : 'Incorrect'}</h1>
            </div>
        </div>
    );
}
