import React from 'react';
import './Loading.css';

const Loading = ({
    message = 'Loading...',
    subMessage = 'Please wait while we fetch the information',
    fullPage = true
}) => {
    return (
        <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
            <div className="loading-animation">
                <div className="loading-spinner"></div>
            </div>
            <h2 className="loading-title">{message}</h2>
            {subMessage && <p className="loading-text">{subMessage}</p>}
        </div>
    );
};

export default Loading;
