
// const base_url = 'http://localhost:3030';
const base_url = process.env.REACT_APP_API_URL;
const api_config = {
    api_url: base_url,
    accounts: {
        login: `${base_url}/accounts/login`,
        register: `${base_url}/accounts/register`,
        logout: `${base_url}/accounts/logout`,
        getAccountByUserName: `${base_url}/accounts/`,
        addAccount: `${base_url}/accounts`,
        upDateAccount: `${base_url}/accounts/email/`,
        deleteAccount: `${base_url}/accounts/user_name/`,
    },
    canva: {
        getAllCanva: `${base_url}/canva`,
        getCanvaById: `${base_url}/canva/`,
        addCanva: `${base_url}/canva`,
        updateCanva: `${base_url}/canva/`,
        deleteCanva: `${base_url}/canva/`,
        getCanvaBy: `${base_url}/canva/code/`,
    },
    cau_hoi: {
        createCauHoi: `${base_url}/cau_hoi`,
        getAllCauHoi: `${base_url}/cau_hoi`,
        getCauHoiById: `${base_url}/cau_hoi/`,
        addCauHoi: `${base_url}/cau_hoi`,
        updateCauHoi: `${base_url}/cau_hoi/`,
        deleteCauHoi: `${base_url}/cau_hoi/`,
        getCauHoiByCanvaId: `${base_url}/cau_hoi/canva/`,
        updateLuaChon: `${base_url}/cau_hoi/luachon/`,
        addLuaChon: `${base_url}/cau_hoi/luachon`,
    },
    session: {
        getAllSession: `${base_url}/session`,
        getSessionById: `${base_url}/session/`,
        getSessionByCodeJoin: `${base_url}/session/code/`,
        addSession: `${base_url}/session`,
        updateSession: `${base_url}/session/`,
        deleteSession: `${base_url}/session/`,
        
    },
    player: {
        getAllPlayer: `${base_url}/player`,
        getPlayerById: `${base_url}/player/`,
        addPlayer: `${base_url}/player`,
        updatePlayer: `${base_url}/player/`,
        deletePlayer: `${base_url}/player/`,
    },
}

export default api_config;