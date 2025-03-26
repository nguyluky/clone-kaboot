import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import './JoinGame.css';
import PlayerInfoForm from './PlayerInfoForm';
import AnimatedNetwork from '../../../components/Background/AnimatedNetwork';
import logo from '../../../assets/images/logo.png';
import { toast } from 'react-toastify';
import api from '../../../services/apiService';

export default function JoinGame() {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [publicSessions, setPublicSessions] = useState([]);
    const [activeTab, setActiveTab] = useState('public'); // Changed default to 'public' instead of 'code'
    const [loadingPublicSessions, setLoadingPublicSessions] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);

    const navigate = useNavigate();

    // Add a player to a session either by code or by selecting a public session
    const addPlayer = async (name, email, sdt, code) => {
        if (!name.trim()) {
            toast.error("Please enter your name", { position: "top-center" });
            return;
        }

        setIsLoading(true);
        try {
            // If joining via selected public session
            const sessionCode = selectedSession ? selectedSession.code_join : code || searchParams.get('code');

            if (!sessionCode) {
                toast.error("Please enter a game code or select a public session", { position: "top-center" });
                setIsLoading(false);
                return;
            }

            // Call the API to join session
            const response = await api.session.joinSession(sessionCode, name, sdt, email);

            // Store player data in session storage
            sessionStorage.setItem('player', JSON.stringify({
                name,
                email,
                sdt,
                thoi_gian_vao: new Date().toISOString(),
            }));
            sessionStorage.setItem('code', sessionCode);

            // Store session data for the play page
            localStorage.setItem('kahoot_session', JSON.stringify({
                sessionData: response,
                playerId: response.player_id
            }));

            toast.success("Joined successfully!", { position: "top-center" });
            navigate('/play');
        } catch (error) {
            console.error('Error joining game:', error);
            toast.error("Failed to join game. Please check your code and try again.", { position: "top-center" });
            setIsLoading(false);
        }
    };

    // Fetch public sessions
    const fetchPublicSessions = async () => {
        setLoadingPublicSessions(true);
        try {
            const sessions = await api.session.getAllPublicSessions();
            setPublicSessions(sessions);
        } catch (err) {
            console.error('Error fetching public sessions:', err);
            toast.error('Failed to load public sessions', { position: "top-center" });
        } finally {
            setLoadingPublicSessions(false);
        }
    };

    // Handle selecting a public session
    const handleSelectSession = (session) => {
        setSelectedSession(session);
        setActiveTab('code'); // Switch to code tab to complete joining
        toast.info(`Selected: ${session.name}`, { position: "top-center" });
    };

    useEffect(() => {
        fetchPublicSessions();

        // If there's a code in URL params, focus on the code tab
        const codeParam = searchParams.get('code');
        if (codeParam) {
            setActiveTab('code');
        }
    }, [searchParams]);

    return (
        <div className="join-game">
            <img className='join-game__logo' src={logo} alt="Logo" />
            <AnimatedNetwork />

            <div className='join-game__wrapper'>
                <div className='join-game__title'>
                    <h2>CYBERSOFT QUIZ</h2>
                    <p>Join a quiz to test your knowledge!</p>
                </div>

                {/* Tab Navigation */}
                <div className="join-game__tabs">
                    <button
                        className={`tab-button ${activeTab === 'public' ? 'active' : ''}`}
                        onClick={() => setActiveTab('public')}
                    >
                        Browse Public Quizzes
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
                        onClick={() => setActiveTab('code')}
                    >
                        Join with Code
                    </button>
                </div>

                {/* Code Tab Content */}
                {activeTab === 'code' && (
                    <div className="join-game__code-tab">
                        {selectedSession && (
                            <div className="selected-session-info">
                                <h3>Selected Quiz: {selectedSession.name}</h3>
                                <button
                                    className="clear-selection-btn"
                                    onClick={() => setSelectedSession(null)}
                                >
                                    Change Quiz
                                </button>
                            </div>
                        )}
                        <PlayerInfoForm
                            addPlayer={addPlayer}
                            initialCode={selectedSession?.code_join || searchParams.get('code') || ''}
                            codeReadOnly={!!selectedSession}
                        />
                    </div>
                )}

                {/* Public Sessions Tab Content */}
                {activeTab === 'public' && (
                    <div className="join-game__public-tab">
                        <h3>Available Public Quizzes</h3>

                        {loadingPublicSessions ? (
                            <div className="loading-sessions">
                                <div className="lds-ripple"><div></div><div></div></div>
                                <p>Loading available quizzes...</p>
                            </div>
                        ) : publicSessions.length > 0 ? (
                            <div className="public-sessions-grid">
                                {publicSessions.map(session => (
                                    <div
                                        key={session.id}
                                        className="session-card"
                                        onClick={() => handleSelectSession(session)}
                                    >
                                        <div className="session-card-header">
                                            <h4>{session.name}</h4>
                                            <span className="participants-badge">
                                                {session.participants} players
                                            </span>
                                        </div>
                                        <div className="session-card-body">
                                            <p className="quiz-name">{session.quiz}</p>
                                            <p className="created-date">
                                                Created: {new Date(session.created).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="session-card-footer">
                                            <button className="join-session-btn">
                                                Join Quiz
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-sessions-message">
                                <p>No public quizzes available at the moment.</p>
                                <button
                                    className="refresh-button"
                                    onClick={fetchPublicSessions}
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className='join-game__loading'>
                    <h2>Joining Quiz...</h2>
                    <div className='lds-dual-ring'></div>
                </div>
            )}
        </div>
    );
}