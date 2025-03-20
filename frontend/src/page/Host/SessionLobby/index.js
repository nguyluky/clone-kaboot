import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as QRCode from 'qrcode.react';
import './SessionLobby.css';

export default function SessionLobby() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [gamePin, setGamePin] = useState('123456');
  const [participantCount, setParticipantCount] = useState(0);
  
  // Simulate loading and connecting to a session
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // In a real app, you would use websockets to listen for new participants count
  useEffect(() => {
    const simulateNewParticipants = setInterval(() => {
      setParticipantCount(prevCount => {
        // Simulate random growth up to 30 participants
        if (prevCount < 30) {
          return prevCount + Math.floor(Math.random() * 2);
        }
        return prevCount;
      });
    }, 3000);
    
    return () => clearInterval(simulateNewParticipants);
  }, []);
  
  const handleStartGame = () => {
    // Navigate to the session host page
    navigate(`/host/${sessionId}`);
  };
  
  const handleCancelSession = () => {
    // In a real app, you would call an API to cancel the session
    navigate('/admin');
  };
  
  const getJoinLink = () => {
    return `https://kahoot-clone.com/join?pin=${gamePin}`;
  };
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(getJoinLink())
      .then(() => {
        alert('Join link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  // Tạo hiệu ứng confetti cho background
  const renderConfetti = () => {
    const confetti = [];
    const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];
    
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 10 + 5;
      const duration = Math.random() * 10 + 5;
      const delay = Math.random() * 10;
      
      const style = {
        left: `${left}%`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      };
      
      confetti.push(<div key={i} className="confetti" style={style}></div>);
    }
    
    return <div className="bg-confetti">{confetti}</div>;
  };
  
  if (isLoading) {
    return (
      <div className="session-loading">
        <div className="loading-spinner"></div>
        <h2>Setting up your session...</h2>
        <p>This will only take a moment</p>
      </div>
    );
  }

  return (
    <div className="session-lobby-container">
      {renderConfetti()}
      
      <div className="lobby-header">
        <div className="lobby-title">
          <h1>Ready to play</h1>
          <p>Share the game PIN or QR code with your players</p>
        </div>
        
        <div className="lobby-actions">
          <button className="action-button secondary" onClick={handleCancelSession}>
            Cancel Session
          </button>
          <button className="action-button primary" onClick={handleStartGame}>
            <i className="fas fa-play"></i> Start Game
            {participantCount > 0 && <span className="participant-badge">{participantCount}</span>}
          </button>
        </div>
      </div>
      
      <div className="lobby-content">
        <div className="join-section">
          <div className="qr-code-container">
            <h2>Scan to join</h2>
            <div className="qr-code">
              <QRCode.QRCodeCanvas
                value={getJoinLink()} 
                size={200}
                level="H"
                includeMargin={true}
                renderAs="svg"
                fgColor="#2c3e50"
                bgColor="#ffffff"
              />
            </div>
            <button className="link-button" onClick={copyLinkToClipboard}>
              <i className="fas fa-link"></i> Copy Join Link
            </button>
          </div>
          
          <div className="pin-container">
            <h2>Or join with game PIN</h2>
            <div className="game-pin-value">{gamePin}</div>
            <div className="join-instructions">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <div className="step-text">Go to <span className="highlight">joingame.com</span></div>
              </div>
              <div className="instruction-step">
                <div className="step-number">2</div>
                <div className="step-text">Enter the Game PIN</div>
              </div>
              <div className="instruction-step">
                <div className="step-number">3</div>
                <div className="step-text">Choose a nickname & join</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="participant-counter">
          <i className="fas fa-users"></i> {participantCount} {participantCount === 1 ? 'player' : 'players'} joined
        </div>
      </div>
    </div>
  );
}
