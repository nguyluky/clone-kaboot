import React from 'react';
import { useNavigate, useParams } from 'react-router';
import SessionDetail from '../../../../components/SessionDetail';
import './SessionReportDetail.css';

export default function SessionReportDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="session-report-detail-page">
            <div className="session-report-header">
                <h1>Session Report</h1>
                <button className="back-button" onClick={() => navigate('/admin/report')}>
                    <i className="fas fa-arrow-left"></i> Back to Reports
                </button>
            </div>

            <SessionDetail />
        </div>
    );
}
