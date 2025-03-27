import React from 'react';
import { Routes, Route } from "react-router";
import JoinGame from './page/Player/JoinGame';
import './App.css';
import Play from './page/Player/Play';
import Admin from './page/Host/Admin';
import CanvaEdit from './page/Host/CanvaEdit';
import Host from './page/Host/Host';
import CanvasList from './components/CanvasList';
import SessionList from './components/SessionList';
import CanvasDetails from './page/Host/Admin/CanvasDetails';
import Dashboard from './page/Host/Admin/Dashboard';
import SessionReportDetail from './page/Host/Admin/SessionReportDetail';
import ParticipantReportDetail from './page/Host/Admin/ParticipantReportDetail';
import SessionStart from './page/Host/SessionStart';
import SessionLobby from './page/Host/SessionLobby';
import Error from './components/common/Error';
import CompletionMessage from './page/Player/Play/CompletionMessage';

function App() {
    return (
        <Routes>
            <Route path='/' element={<JoinGame />} />
            <Route path='/play' element={<Play />} />

            <Route path='/admin' element={<Admin />}>
                <Route path='' element={<Dashboard />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='quizzes' element={<CanvasList />} />
                <Route path='canva/:id' element={<CanvasDetails />} />
                <Route path='report' element={<SessionList />} />
                <Route path='report/:id' element={<SessionReportDetail />} />
                <Route path='report/:sessionId/participant/:participantId' element={<ParticipantReportDetail />} />
                <Route path='*' element={Error({ title: 'Not Found', message: 'The page you are looking for does not exist', onBack: () => { } })} />
            </Route>
            <Route path='/canva/new' element={<CanvaEdit />} />
            <Route path='/canva/edit/:id' element={<CanvaEdit />} />
            <Route path='/session/start/:canvasId' element={<SessionStart />} />
            <Route path='/host/lobby/:sessionId' element={<SessionLobby />} />
            <Route path='/host/:session_id' element={<Host />} />
            <Route path='/results' element={<CompletionMessage />} />
            {/* <Route path='/host/:session_id/leaderboard' element={<PlayerScoreboard/>}/> */}
            <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
    );
}

export default App;
