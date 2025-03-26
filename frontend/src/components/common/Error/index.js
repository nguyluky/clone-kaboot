import React from 'react';
import './Error.css';

/**
 * 
 * @param {{
 * title: string,
 * message: string,
 * onRetry?: () => void,
 * onBack?: () => void,
 * showHelpText?: boolean,
 * fullPage?: boolean
 * }} param0
 * @returns 
 */
const Error = ({
    title = 'Something went wrong',
    message = 'An error occurred. Please try again.',
    onRetry,
    onBack,
    showHelpText = true,
    fullPage = true
}) => {
    return (
        <div className={`error-container ${fullPage ? 'full-page' : ''}`}>
            <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="error-title">{title}</h2>
            <p className="error-message">{message}</p>
            <div className="error-actions">
                {onRetry && (
                    <button className="error-retry-button" onClick={onRetry}>
                        <i className="fas fa-sync-alt"></i> Try Again
                    </button>
                )}
                {onBack && (
                    <button className="error-back-button" onClick={onBack}>
                        <i className="fas fa-arrow-left"></i> Go Back
                    </button>
                )}
            </div>
            {showHelpText && <p className="error-help">If this problem persists, please contact support.</p>}
        </div>
    );
};

export default Error;
