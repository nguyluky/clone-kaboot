
import React from 'react';
import { Routes, Route } from "react-router";
import JoinGame from './page/Player/JoinGame';
import './App.css';
import Play from './page/Player/Play';
import ListAllCanva from './page/Host/ListAllCanva';
import Login from './page/Login';
import Admin from './page/Host/Admin';
import CanvaEdit from './page/Host/CanvaEdit';
import Host from './page/Host/Host';
import ListAllSession from './page/Host/ListAllSession';
import PlayerScoreboard from './page/Host/Host/PlayerScoreboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<JoinGame />}/>
      <Route path='/play' element={<Play/>}/>

      <Route path='/admin' element={<Admin />}>
        <Route path='' element={<ListAllCanva />}/>
        <Route path='canva/:id' element={<CanvaEdit/>}/>
        <Route path='session/:canva_id' element={<ListAllSession/>}/>
      </Route>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<h1>Register</h1>}/>
      <Route path='/host/:session_id' element={<Host/>}/>
      <Route path='/host/:session_id/leaderboard' element={<PlayerScoreboard/>}/>
      <Route path='*' element={<h1>Not Found</h1>}/>
    </Routes>
  );
}

export default App;
