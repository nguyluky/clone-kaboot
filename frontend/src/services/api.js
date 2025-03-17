import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);


const cau_hoi = {
    getAllCauHoi: () => api.get('/cau_hoi'),
    getCauHoiById: (question_id) => api.get(`/cau_hoi/${question_id}`),
    // getCauHoiByCanvaId: (canva_id) => api.get(`/cau_hoi/canva/${canva_id}`),
    createCauHoi: (question) => api.post('/cau_hoi', question),
    updateCauHoi: (question) => api.put(`/cau_hoi/${question.cau_hoi_id}`, question),
    deleteCauHoi: (question_id) => api.delete(`/cau_hoi/${question_id}`),

    updateLuachon: (choice) => api.put(`/cau_hoi/luachon/${choice.lua_chon_id}`, choice),
    addLuaChon: (choice) => api.post('/cau_hoi/luachon', choice),
    deleteLuaChon: (choice_id) => api.delete(`/cau_hoi/luachon/${choice_id}`)
}

const canva = {
    getAllCanva: () => api.get('/canva'),
    getPublicCanva: () => api.get('/canva?public=true'),
    getCanvaById: (canva_id) => api.get(`/canva/${canva_id}`),
    createCanva: (canva) => api.post('/canva', canva),
    updateCanva: (canva) => api.put(`/canva/${canva.canva_id}`, canva),
    deleteCanva: (canva_id) => api.delete(`/canva/${canva_id}`)
}

const session = {
    getAllSessions: () => api.get('/session'),
    getSessionById: (session_id) => api.get(`/session/${session_id}`),
    getSessionsByCanvaId: (canva_id) => api.get(`/session/canva/${canva_id}`),
    getSessionByCodeJoin: (code_join) => api.get(`/session/code/${code_join}`),
    createSession: (session) => api.post('/session', session),
    updateSession: (session) => api.put(`/session/${session.session_id}`, session),
    deleteSession: (session_id) => api.delete(`/session/${session_id}`),
    getLeaderBoard: (session_id) => api.get(`/session/${session_id}/leaderboard`),
    getCauHoi: (session_id) => api.get(`/session/${session_id}/cau_hoi`)
}

const player = {
    getAllPlayers: () => api.get('/player'),
    getPlayerById: (player_id) => api.get(`/player/${player_id}`),
    getPlayersBySessionId: (session_id) => api.get(`/player/session/${session_id}`),
    createPlayer: (player) => api.post('/player', player),
    updatePlayer: (player) => api.put(`/player/${player.player_id}`, player),
    deletePlayer: (player_id) => api.delete(`/player/${player_id}`)
}

const services = {
    api,
    cau_hoi,
    canva,
    session,
    player
};

export default services;