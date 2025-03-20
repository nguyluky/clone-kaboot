import React from 'react';
import { useParams } from 'react-router';
import GameController from '../../../components/GameController';
import './Host.css';

export default function Host() {
  const { session_id } = useParams();
  
  return (
    <div className="host-container">
      <div className="host-sidebar">
        <div className="host-session-info">
          <h3>Game PIN: <span className="game-pin">123456</span></h3>
          <p>24 players connected</p>
        </div>
        
        <div className="player-list">
          <h4>Players</h4>
          <div className="player-list-container">
            {/* This would be a list of connected players */}
            <div className="player-list-item">Player1</div>
            <div className="player-list-item">Gamer123</div>
            <div className="player-list-item">QuizWiz</div>
            <div className="player-list-item">BrainGenius</div>
            <div className="player-list-item">QuizMaster</div>
            {/* More players would be listed here */}
          </div>
        </div>
      </div>
      
      <div className="host-main">
        <GameController sessionId={session_id} />
      </div>
    </div>
  );
}