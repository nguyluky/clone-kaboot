/**
 * API Service for Clone Kaboot - TypeScript Version
 *
 * This service provides strongly typed methods to interact with the Clone Kaboot backend API.
 * It handles all the API calls and returns responses in a consistent format.
 */

import { toast } from "react-toastify";

// Configure base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL + '/api' || "http://localhost:3030/api";
/**
 * Helper function to handle API requests
 * @param {String} endpoint - API endpoint
 * @param {"GET" | "POST" | "PUT" | "DELETE"}method - HTTP method (GET, POST, PUT, DELETE)
 * @param {any} [data] - Request body data (for POST, PUT)
 * @returns Promise with response data or error
 */
async function apiRequest(endpoint, method = "GET", data = undefined) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };
    // Add token to headers if available
    const token = auth.getToken();
    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }
    if (data) {
        options.body = JSON.stringify(data);
    }
    try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        if (!response.ok) {
            // If unauthorized, clear token
            if (response.status === 401 || response.status === 403) {
                // toast.error("Session expired. Please login again.");
                window.location.href = '/'
                auth.removeToken();
            }
            throw new Error(responseData.message || "API request failed");
        }
        return responseData;
    }
    catch (error) {
        console.error(`API Error (${method} ${endpoint}):`, error);
        throw error;
    }
}
// Authentication functions
const auth = {
    // Get the auth token from storage
    getToken: () => localStorage.getItem("auth_token"),
    // Set the auth token in storage
    setToken: (token) => {
        localStorage.setItem("auth_token", token);
    },
    // Remove the auth token from storage
    removeToken: () => {
        localStorage.removeItem("auth_token");
    },
    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem("auth_token");
    },
    // Verify the token with the server
    verifyToken: async () => {
        const token = localStorage.getItem("auth_token");
        if (!token)
            return false;
        try {
            const response = await apiRequest("/auth/check-token", "POST", { token: token });
            return response.valid;
        }
        catch (error) {
            auth.removeToken();
            return false;
        }
    },
    // Get user info from the token
    getUserInfo: async () => {
        try {
            const response = await apiRequest("/auth/verify");
            if (!response.user) {
                throw new Error("User information not available");
            }
            return response.user;
        }
        catch (error) {
            auth.removeToken();
            throw error;
        }
    },
    // Check if user is an admin
    isAdmin: () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token)
                return false;
            // Decode the JWT payload more safely
            const payload = token.split(".")[1];
            if (!payload)
                return false;
            try {
                const decoded = JSON.parse(atob(payload));
                return decoded.role === "admin";
            }
            catch (parseError) {
                console.error("Error parsing token payload:", parseError);
                return false;
            }
        }
        catch (error) {
            console.error("Error checking admin status:", error);
            return false;
        }
    },
    // Check if user is a player - similar safer approach
    isPlayer: () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token)
                return false;
            // Decode the JWT payload more safely
            const payload = token.split(".")[1];
            if (!payload)
                return false;
            try {
                const decoded = JSON.parse(atob(payload));
                return decoded.role === "player";
            }
            catch (parseError) {
                console.error("Error parsing token payload:", parseError);
                return false;
            }
        }
        catch (error) {
            console.error("Error checking player status:", error);
            return false;
        }
    },
    // Get player ID from token if user is a player - with safer parsing
    getPlayerId: () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token)
                return null;
            // Decode the JWT payload more safely
            const payload = token.split(".")[1];
            if (!payload)
                return null;
            try {
                const decoded = JSON.parse(atob(payload));
                return decoded.role === "player" ? decoded.playerId : null;
            }
            catch (parseError) {
                console.error("Error parsing token payload:", parseError);
                return null;
            }
        }
        catch (error) {
            console.error("Error getting player ID:", error);
            return null;
        }
    },
};
// Canvas API implementation
const canvasApi = {
    // Get all canvases
    getAllCanvas: () => apiRequest("/canvas"),
    // Get canvas by ID
    getCanvasById: (id) => apiRequest(`/canvas/${id}`),
    // Get detailed canvas (includes questions)
    getCanvasDetail: (id) => apiRequest(`/canvas/${id}/detail`),
    // Create new canvas
    createCanvas: (canvasData) => apiRequest("/canvas", "POST", canvasData),
    // Update canvas
    updateCanvas: (id, canvasData) => apiRequest(`/canvas/${id}`, "PUT", canvasData),
    // Delete canvas
    deleteCanvas: (id) => apiRequest(`/canvas/${id}`, "DELETE"),
};
// Question API implementation
const questionApi = {
    // Get question by ID
    getQuestionById: (id) => apiRequest(`/questions/${id}`),
    // Create new question
    createQuestion: (questionData) => apiRequest("/questions", "POST", questionData),
    // Update question
    updateQuestion: (id, questionData) => apiRequest(`/questions/${id}`, "PUT", questionData),
    // Delete question
    deleteQuestion: (id) => apiRequest(`/questions/${id}`, "DELETE"),
};
// Session API implementation
const sessionApi = {
    // Get all sessions
    getAllSessions: () => apiRequest("/sessions"),
    // Get all public sessions
    getAllPublicSessions: () => apiRequest("/sessions/public"),
    // Get public session for a specific canvas
    getPublicSessionByCanvasId: (canvasId) => apiRequest(`/sessions/public/canvas/${canvasId}`),
    // Get session by ID
    getSessionById: (id) => apiRequest(`/sessions/${id}`),
    // Get detailed session (includes participants & stats)
    getSessionDetail: (id) => apiRequest(`/sessions/${id}/detail`),
    // Create new session
    createSession: (sessionData) => apiRequest("/sessions", "POST", sessionData),
    // Join session with code and player information in one step
    joinSession: (code, playerName, playerPhone = "", playerEmail = "") => apiRequest("/sessions/join", "POST", {
        code,
        playerName,
        playerPhone,
        playerEmail,
    }),
};
// Player API implementation
const playerApi = {
    // Register a new player
    registerPlayer: (playerData) => apiRequest("/players/register", "POST", playerData),
    // Get player details
    getPlayerDetail: (id) => apiRequest(`/players/${id}`),
    // Submit a single answer
    submitAnswer: (answerData) => apiRequest("/players/answer", "POST", answerData),
    // Submit all answers at once
    submitAllAnswers: (playerId, answers) => apiRequest("/players/submit-all", "POST", {
        player_id: playerId,
        answers: answers,
    }),
    // Checkout (complete quiz)
    checkoutPlayer: (id) => apiRequest(`/players/${id}/checkout`, "POST"),
};
// Dashboard API implementation
const dashboardApi = {
    // Get dashboard statistics
    getStats: () => apiRequest("/dashboard/stats"),
    // Get recent activities
    getActivities: (limit = 20) => apiRequest(`/dashboard/activities?limit=${limit}`),
    // Get popular quizzes
    getQuizPopular: (limit = 5) => apiRequest(`/dashboard/quiz_popular?limit=${limit}`),
};
// Add a proper type guard for activity type checking
function isSessionActivity(activity) {
    return activity.type === "session";
}
function isCanvasActivity(activity) {
    return activity.type === "canvas";
}
// Export all API modules
const api = {
    canvas: canvasApi,
    question: questionApi,
    session: sessionApi,
    player: playerApi,
    dashboard: dashboardApi,
    auth, // Add auth to the exported API
};
export default api;