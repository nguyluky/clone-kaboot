import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './Dashboard.css';
import Loading from '../../../../components/common/Loading';
import Error from '../../../../components/common/Error';
import api from '../../../../services/apiService';
import { formatDateTime } from '../../../../help';

export default function Dashboard() {
    const navigate = useNavigate();
    /** @type {import('../../../../help').useStateReturnType<import('../../../../services/apiService').Activity[]>} */
    // @ts-ignore
    const [recentActivities, setRecentActivities] = React.useState([]);
    /** @type {import('../../../../help').useStateReturnType<import('../../../../services/apiService').Canvas[]>} */
    // @ts-ignore
    const [popularQuizzes, setPopularQuizzes] = React.useState([]);
    /** @type {import('../../../../help').useStateReturnType<import('../../../../services/apiService').DashboardStats>} */
    // @ts-ignore
    const [stats, setStats] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const loadData = () => {
        setIsLoading(true);
        setError(null);

        Promise.all([
            api.dashboard.getActivities(),
            api.dashboard.getQuizPopular(),
            api.dashboard.getStats()
        ]).then(([
            activities,
            popularQuizzes,
            stats
        ]) => {
            setRecentActivities(activities);
            setPopularQuizzes(popularQuizzes);
            setStats(stats);
        }).catch((error) => {
            setError(error.message || "Failed to load dashboard data. Please try again.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        loadData();
    }, []);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'session':
                return 'fas fa-play';
            case 'canvas':
                return 'fas fa-edit';
            default:
                return 'fas fa-bell';
        }
    };

    const getActivityDescription = (activity) => {
        if (activity.type === 'session') {
            return `Hosted session with ${activity.participants} participants`;
        } else if (activity.type === 'canvas') {
            return `Quiz ${activity.action}`;
        }
        return '';
    };

    if (isLoading) {
        return <Loading message="Loading dashboard" subMessage="Fetching your quizzes and activity data" />;
    }

    if (error) {
        return (
            <Error
                title="Dashboard data unavailable"
                message={error}
                onRetry={loadData}
                onBack={() => navigate('/')}
            />
        );
    }

    return (
        <div className="dashboard-container">
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>Welcome back!</h1>
                    <p>Manage your quizzes, view reports, and create engaging content all in one place.</p>
                </div>
                <div className="quick-actions">
                    <button className="action-button primary" onClick={() => navigate('/canva/new')}>
                        <i className="fas fa-plus"></i> Create New Quiz
                    </button>
                    <button className="action-button secondary" onClick={() => navigate('/admin/quizzes')}>
                        <i className="fas fa-list"></i> View All Quizzes
                    </button>
                    <button className="action-button secondary" onClick={() => navigate('/admin/report')}>
                        <i className="fas fa-chart-line"></i> View Reports
                    </button>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-palette"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.quicks}</h3>
                        <p>Total Quizzes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.participants}</h3>
                        <p>Total Participants</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.conducted}</h3>
                        <p>Sessions Conducted</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.play_time}</h3>
                        <p>Total Play Time</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.reports}</h3>
                        <p>Analytics Reports</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="activity-section">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                        <button className="view-all-btn">View All</button>
                    </div>

                    <div className="activity-list">
                        {recentActivities.map(activity => (
                            <div className="activity-item" key={activity.id}>
                                <div className="activity-icon">
                                    <i className={getActivityIcon(activity.type)}></i>
                                </div>
                                <div className="activity-details">
                                    <h4>{activity.title}</h4>
                                    <p>{getActivityDescription(activity)}</p>
                                </div>
                                <div className="activity-date">
                                    {formatDateTime('MMM DD, YYYY', new Date(String(activity.date)))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="popular-quizzes-section">
                    <div className="section-header">
                        <h2>Most Popular Quizzes</h2>
                        <button className="view-all-btn" onClick={() => navigate('/admin/quizzes')}>View All</button>
                    </div>

                    <div className="popular-quizzes-list">
                        {
                            popularQuizzes.map(quiz => (
                                <div className="popular-quiz-card" key={quiz.id}>
                                    <div className="popular-quiz-info">
                                        <h4>{quiz.title}</h4>
                                        <p>{quiz.stats.totalParticipants} participants • {quiz.stats.avgScore}% avg. score</p>
                                    </div>
                                    <div className="popular-quiz-plays">
                                        <span className="plays-count">{quiz.stats.timesPlayed}</span>
                                        <span className="plays-label">plays</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
