import React from 'react';
import { useNavigate } from 'react-router';
import CanvasDetail from '../../../../components/CanvasDetail';
import './CanvasDetails.css';

export default function CanvasDetails() {
  const navigate = useNavigate();
  
  const handleBackToQuizzes = () => {
    navigate('/admin/quizzes');
  };
  
  return (
    <div className="canvas-details-page">
      <div className="canvas-details-header">
        <h1>Canvas Details</h1>
        <button className="back-button" onClick={handleBackToQuizzes}>
          <i className="fas fa-arrow-left"></i> Back to Quizzes
        </button>
      </div>
      
      <CanvasDetail />
    </div>
  );
}
