import React from 'react';
import { useNavigate, useParams } from 'react-router';
import ParticipantDetail from '../../../../components/ParticipantDetail';
import './ParticipantReportDetail.css';

export default function ParticipantReportDetail() {
  const navigate = useNavigate();
  const { sessionId, participantId } = useParams();
  
  return (
    <div className="participant-report-detail-page">
      <div className="participant-report-header">
        <h1>Participant Performance</h1>
        <button className="back-button" onClick={() => navigate(`/admin/report/${sessionId}`)}>
          <i className="fas fa-arrow-left"></i> Back to Session Report
        </button>
      </div>
      
      <ParticipantDetail participantId={participantId} />
    </div>
  );
}
