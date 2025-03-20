/**
 * API Service Module
 * Provides axios-based HTTP client for interacting with backend API endpoints
 * Implements consistent error handling and authentication mechanisms
 * @module apiService
 */

import axios from 'axios';

/**
 * @template T
 * @typedef {import('axios').AxiosResponse<T>} AxiosResponse
 */

/**
 * Base axios instance configured for the application
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3030',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

/**
 * Request interceptor that adds authentication token to requests
 * Retrieves token from localStorage and adds it to the Authorization header
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor that standardizes response handling
 * - Extracts data from successful responses
 * - Formats errors with consistent message and status code
 * - Handles authorization errors (401) by clearing token
 */
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        const status = error.response?.status || 500;

        if (status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token');
        }

        return Promise.reject({ message, status });
    }
);

/**
 * Canvas API endpoint wrapper
 * Provides methods for managing canvas resources
 * @namespace
 */
export const canvaApi = {
    /**
     * Fetch all canvases
     * @returns {Promise<CanvaType[]>} Promise resolving to array of canvases
     */
    getAll: () => apiClient.get('/canva'),

    /**
     * Get canvas by ID
     * @param {number|string} id - Canvas ID
     * @returns {Promise<CanvaType>} Promise resolving to canvas data
     */
    getById: (id) => apiClient.get(`/canva/${id}`),

    /**
     * Create new canvas
     * @param {Omit<CanvaType, 'canva_id' | 'ngay_tao'>} data - Canvas data
     * @returns {Promise<ResultSetHeader>} Promise resolving to creation result
     */
    create: (data) => apiClient.post('/canva', data),

    /**
     * Update existing canvas
     * @param {number|string} id - Canvas ID
     * @param {Partial<CanvaType>} data - Canvas data to update
     * @returns {Promise<ResultSetHeader>} Promise resolving to update result
     */
    update: (id, data) => apiClient.put(`/canva/${id}`, data),

    /**
     * Delete canvas
     * @param {number|string} id - Canvas ID
     * @returns {Promise<ResultSetHeader>} Promise resolving to deletion result
     */
    delete: (id) => apiClient.delete(`/canva/${id}`),

    /**
     * Get all sessions for a canvas
     * @param {number|string} id - Canvas ID
     * @returns {Promise<SessionType[]>} Promise resolving to array of sessions
     */
    getSessions: (id) => apiClient.get(`/canva/${id}/session`),

    /**
     * Get all questions for a canvas
     * @param {number|string} id - Canvas ID
     * @returns {Promise<CauHoiType[]>} Promise resolving to array of questions
     */
    getQuestions: (id) => apiClient.get(`/canva/${id}/cauhoi`),
};

/**
 * Question API endpoint wrapper
 * Provides methods for managing questions
 * @namespace
 */
export const cauHoiApi = {
    /**
     * Fetch all questions
     * @returns {Promise<CauHoiWithLuaChonType[]>} Promise resolving to array of questions with choices
     */
    getAll: () => apiClient.get('/cau_hoi'),

    /**
     * Get question by ID
     * @param {number|string} id - Question ID
     * @returns {Promise<CauHoiWithLuaChonType>} Promise resolving to question with choices
     */
    getById: (id) => apiClient.get(`/cau_hoi/${id}`),

    /**
     * Create new question
     * @param {CauHoiType} data - Question data
     * @returns {Promise<ResultSetHeader>} Promise resolving to creation result
     */
    create: (data) => apiClient.post('/cau_hoi', data),

    /**
     * Update existing question
     * @param {number|string} id - Question ID
     * @param {Partial<CauHoiWithLuaChonType>} data - Question data to update
     * @returns {Promise<ResultSetHeader>} Promise resolving to update result
     */
    update: (id, data) => apiClient.put(`/cau_hoi/${id}`, data),

    /**
     * Delete question
     * @param {number|string} id - Question ID
     * @returns {Promise<ResultSetHeader>} Promise resolving to deletion result
     */
    delete: (id) => apiClient.delete(`/cau_hoi/${id}`),

    /**
     * 
     * @param {string | number} cau_hoi_id 
     * @param {Omit<LuaChonType, 'lua_chon_id' | 'cau_hoi_id'>} data 
     * @returns {Promise<ResultSetHeader>}
     */
    createChoice: (cau_hoi_id, data) => apiClient.post(`/cau_hoi/${cau_hoi_id}/lua_chon`, data),
    /**
     * 
     * @param {string|number} id 
     * @param {string|number} lua_chon_id 
     * @returns {Promise<ResultSetHeader>}
     */
    deleteChoice: (id, lua_chon_id) => apiClient.delete(`/cau_hoi/${id}/lua_chon/${lua_chon_id}`),
};

/**
 * Session API endpoint wrapper
 * Provides methods for managing quiz sessions
 * @namespace
 */
export const sessionApi = {
    /**
     * Fetch all sessions
     * @returns {Promise<SessionType[]>} Promise resolving to array of sessions
     */
    getAll: () => apiClient.get('/session'),

    /**
     * Get session by ID
     * @param {number|string} id - Session ID
     * @returns {Promise<SessionType>} Promise resolving to session data
     */
    getById: (id) => apiClient.get(`/session/${id}`),

    /**
     * Create new session
     * @param {Partial<SessionType>} data - Session data
     * @returns {Promise<ResultSetHeader>} Promise resolving to creation result
     */
    create: (data) => apiClient.post('/session', data),

    /**
     * Update existing session
     * @param {number|string} id - Session ID
     * @param {Partial<SessionType>} data - Session data to update
     * @returns {Promise<ResultSetHeader>} Promise resolving to update result
     */
    update: (id, data) => apiClient.put(`/session/${id}`, data),

    /**
     * Delete session
     * @param {number|string} id - Session ID
     * @returns {Promise<ResultSetHeader>} Promise resolving to deletion result
     */
    delete: (id) => apiClient.delete(`/session/${id}`),

    /**
     * Get leaderboard for a session
     * @param {number|string} id - Session ID
     * @returns {Promise<PlayerType[]>} Promise resolving to array of players ranked by score
     */
    getLeaderboard: (id) => apiClient.get(`/session/${id}/leaderboard`),

    /**
     * Get session by join code
     * @param {string} code - Session join code
     * @returns {Promise<SessionType>} Promise resolving to session data
     */
    getByCodeJoin: (code) => apiClient.get(`/session/code/${code}`),

    /**
     * Get questions for a session by join code
     * @param {string} code - Session join code
     * @returns {Promise<CauHoiWithLuaChonType[]>} Promise resolving to array of questions with choices
     */
    getQuestions: (code) => apiClient.get(`/session/code/${code}/question`),

    /**
     * Submit answers for a session
     * @param {string} code - Session join code
     * @param {Object} data - Answer submission data
     * @param {PlayerType} data.player - Player data
     * @param {Array} data.answers - Player's answers
     * @returns {Promise<ResultSetHeader>} Promise resolving to submission result
     */
    submitAnswers: (code, data) => apiClient.post(`/session/code/${code}/submit`, data),

    /**
     * Get all public sessions
     * @returns {Promise<SessionType[]>} Promise resolving to array of public sessions
     */
    getPublicSessions: () => apiClient.get('/session/public'),
};

/**
 * Player API endpoint wrapper
 * Provides methods for managing players
 * @namespace
 */
export const playerApi = {
    /**
     * Fetch all players
     * @returns {Promise<PlayerType[]>} Promise resolving to array of players
     */
    getAll: () => apiClient.get('/player'),

    /**
     * Get player by ID
     * @param {number|string} id - Player ID
     * @returns {Promise<PlayerType>} Promise resolving to player data
     */
    getById: (id) => apiClient.get(`/player/${id}`),

    /**
     * Create new player
     * @param {PlayerType} data - Player data
     * @returns {Promise<ResultSetHeader>} Promise resolving to creation result
     */
    create: (data) => apiClient.post('/player', data),

    /**
     * Update existing player
     * @param {number|string} id - Player ID
     * @param {Partial<PlayerType>} data - Player data to update
     * @returns {Promise<ResultSetHeader>} Promise resolving to update result
     */
    update: (id, data) => apiClient.put(`/player/${id}`, data),

    /**
     * Delete player
     * @param {number|string} id - Player ID
     * @returns {Promise<ResultSetHeader>} Promise resolving to deletion result
     */
    delete: (id) => apiClient.delete(`/player/${id}`),
};

/**
 * Authentication API endpoint wrapper
 * Provides methods for user authentication
 * @namespace
 */
export const authApi = {
    /**
     * Log out user by removing token
     * @returns {Promise<void>} Promise that resolves when logout is complete
     */
    logout: () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated, false otherwise
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

/**
 * @typedef {{
 * canvaApi: typeof canvaApi,
 * cauHoiApi: typeof cauHoiApi,
 * sessionApi: typeof sessionApi,
 * playerApi: typeof playerApi,
 * authApi: typeof authApi
 * }}
 */
const api = {
    canvaApi,
    cauHoiApi,
    sessionApi,
    playerApi,
    authApi,
};


export default api;