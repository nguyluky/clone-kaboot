/**
 * API Service for Clone Kaboot - TypeScript Version
 *
 * This service provides strongly typed methods to interact with the Clone Kaboot backend API.
 * It handles all the API calls and returns responses in a consistent format.
 */

// Types and Interfaces
interface CanvasStats {
  timesPlayed: number;
  totalParticipants: number;
  avgScore: number;
  completionRate: number;
  difficultyRating: "Medium" | "Hard" | "EZ";
}

interface Canvas {
  id: number;
  title: string;
  category: string;
  description: string;
  lastModified: Date;
  created: Date;
  questions: number;
  stats: CanvasStats;
}

interface CanvasDetail extends Omit<Canvas, "questions"> {
  questions: Question[];
}

interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  type: "multiple_choice" | "single_choice" | "text";
  question: string;
  timeLimit: number;
  points: number;
  canva_id?: number;
  options: QuestionOption[];
}

interface Session {
  id: number;
  name: string;
  created: Date;
  code_join: string;
  is_public: boolean;
  quiz: string;
  participants: number;
  canva_id?: number;
}

interface Player {
  id: number;
  name: string;
  sdt: string;
  email: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number;
  sessionName: string;
  quizName: string;
  date: Date;
  totalQuestions: number;
  rank: number;
  checkIn: Date;
  checkOut: Date;
}

interface PlayerDetail extends Player {
  answers: PlayerAnswer[];
}

interface PlayerAnswer {
  questionId: number;
  questionText: string;
  correctAnswer: string;
  participantAnswer: string;
  isCorrect: boolean;
  responseTime: number;
  points: number;
}

interface AnswerSubmission {
  player_id: number;
  question_id: number;
  option_id: number | null;
  responseTime: number;
}

interface BatchAnswerSubmission {
  player_id: number;
  answers: Omit<AnswerSubmission, "player_id">[];
}

interface QuestionStats {
  id: number;
  question: string;
  correctPercentage: number;
  avgResponseTime: number;
  distribution: {
    answer: string;
    count: number;
    isCorrect: boolean;
  }[];
}

interface SessionStats {
  avgScore: number;
  avgTimePerQuestion: number;
  totalParticipants: number;
  completionRate: number;
}

interface SessionDetail {
  id: number;
  name: string;
  quiz: string;
  created: Date;
  code_join: string;
  participants: Omit<Player, "answers">[];
  questions: QuestionStats[];
  stats: SessionStats;
}

interface DashboardStats {
  quicks: number;
  participants: number;
  conducted: number;
  play_time: number;
  reports: number;
}

interface SessionActivity {
  id: number;
  type: "session";
  title: string;
  date: Date;
  participants: number;
}

interface CanvasActivity {
  id: number;
  type: "canvas";
  title: string;
  date: Date;
  action: "updated" | "created" | "delete";
}

type Activity = SessionActivity | CanvasActivity;

interface User {
  id: number;
  username: string;
  role: "admin" | "player";
  playerId?: number;
}

// API Response types
interface ApiResponseBase {
  message?: string;
}

interface CreateResponse extends ApiResponseBase {
  id: number;
}

interface SessionCreateResponse extends CreateResponse {
  code: string;
}

interface TokenResponse {
  valid: boolean;
  user?: User;
}

interface JoinSessionResponse {
  session_id: number;
  player_id: number;
  name: string;
  quiz: string;
  questions: Question[];
}

interface BatchAnswerResponse extends ApiResponseBase {
  answersProcessed: number;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

// Request option interface
interface ApiRequestOptions {
  method: string;
  headers: {
    "Content-Type": string;
    Authorization?: string;
  };
  body?: string;
}

// Configure base URL for API calls
const API_BASE_URL: string =
  process.env.REACT_APP_API_URL || "http://localhost:3030/api";

/**
 * Helper function to handle API requests
 * @param endpoint - API endpoint
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param data - Request body data (for POST, PUT)
 * @returns Promise with response data or error
 */
async function apiRequest<T = any>(
  endpoint: string,
  method: string = "GET",
  data: any = null
): Promise<T> {
  const url: string = `${API_BASE_URL}${endpoint}`;

  const options: ApiRequestOptions = {
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
        auth.removeToken();
      }
      throw new Error(responseData.message || "API request failed");
    }

    return responseData as T;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

// Authentication service interface
interface AuthService {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  isAuthenticated: () => boolean;
  verifyToken: () => Promise<boolean>;
  getUserInfo: () => Promise<User>;
  isAdmin: () => boolean;
  isPlayer: () => boolean;
  getPlayerId: () => number | null;
}

// Authentication functions
const auth: AuthService = {
  // Get the auth token from storage
  getToken: (): string | null => localStorage.getItem("auth_token"),

  // Set the auth token in storage
  setToken: (token: string): void => {
    localStorage.setItem("auth_token", token);
  },

  // Remove the auth token from storage
  removeToken: (): void => {
    localStorage.removeItem("auth_token");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth_token");
  },

  // Verify the token with the server
  verifyToken: async (): Promise<boolean> => {
    const token = localStorage.getItem("auth_token");
    if (!token) return false;

    try {
      const response = await apiRequest<TokenResponse>(
        "/auth/check-token",
        "POST",
        { token }
      );
      return response.valid;
    } catch (error) {
      auth.removeToken();
      return false;
    }
  },

  // Get user info from the token
  getUserInfo: async (): Promise<User> => {
    try {
      const response = await apiRequest<TokenResponse>("/auth/verify");
      if (!response.user) {
        throw new Error("User information not available");
      }
      return response.user;
    } catch (error) {
      auth.removeToken();
      throw error;
    }
  },

  // Check if user is an admin
  isAdmin: (): boolean => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return false;

      // Decode the JWT payload more safely
      const payload = token.split(".")[1];
      if (!payload) return false;

      try {
        const decoded = JSON.parse(atob(payload));
        return decoded.role === "admin";
      } catch (parseError) {
        console.error("Error parsing token payload:", parseError);
        return false;
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  },

  // Check if user is a player - similar safer approach
  isPlayer: (): boolean => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return false;

      // Decode the JWT payload more safely
      const payload = token.split(".")[1];
      if (!payload) return false;

      try {
        const decoded = JSON.parse(atob(payload));
        return decoded.role === "player";
      } catch (parseError) {
        console.error("Error parsing token payload:", parseError);
        return false;
      }
    } catch (error) {
      console.error("Error checking player status:", error);
      return false;
    }
  },

  // Get player ID from token if user is a player - with safer parsing
  getPlayerId: (): number | null => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return null;

      // Decode the JWT payload more safely
      const payload = token.split(".")[1];
      if (!payload) return null;

      try {
        const decoded = JSON.parse(atob(payload));
        return decoded.role === "player" ? decoded.playerId : null;
      } catch (parseError) {
        console.error("Error parsing token payload:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Error getting player ID:", error);
      return null;
    }
  },
};

// Canvas API service interface
interface CanvasApiService {
  getAllCanvas: () => Promise<Canvas[]>;
  getCanvasById: (id: number) => Promise<Canvas>;
  getCanvasDetail: (id: number) => Promise<CanvasDetail>;
  createCanvas: (canvasData: Partial<Canvas>) => Promise<CreateResponse>;
  updateCanvas: (
    id: number,
    canvasData: Partial<Canvas>
  ) => Promise<ApiResponseBase>;
  deleteCanvas: (id: number) => Promise<ApiResponseBase>;
}

// Canvas API implementation
const canvasApi: CanvasApiService = {
  // Get all canvases
  getAllCanvas: () => apiRequest<Canvas[]>("/canvas"),

  // Get canvas by ID
  getCanvasById: (id: number) => apiRequest<Canvas>(`/canvas/${id}`),

  // Get detailed canvas (includes questions)
  getCanvasDetail: (id: number) =>
    apiRequest<CanvasDetail>(`/canvas/${id}/detail`),

  // Create new canvas
  createCanvas: (canvasData: Partial<Canvas>) =>
    apiRequest<CreateResponse>("/canvas", "POST", canvasData),

  // Update canvas
  updateCanvas: (id: number, canvasData: Partial<Canvas>) =>
    apiRequest<ApiResponseBase>(`/canvas/${id}`, "PUT", canvasData),

  // Delete canvas
  deleteCanvas: (id: number) =>
    apiRequest<ApiResponseBase>(`/canvas/${id}`, "DELETE"),
};

// Question API service interface
interface QuestionApiService {
  getQuestionById: (id: number) => Promise<Question>;
  createQuestion: (questionData: Partial<Question>) => Promise<CreateResponse>;
  updateQuestion: (
    id: number,
    questionData: Partial<Question>
  ) => Promise<ApiResponseBase>;
  deleteQuestion: (id: number) => Promise<ApiResponseBase>;
}

// Question API implementation
const questionApi: QuestionApiService = {
  // Get question by ID
  getQuestionById: (id: number) => apiRequest<Question>(`/questions/${id}`),

  // Create new question
  createQuestion: (questionData: Partial<Question>) =>
    apiRequest<CreateResponse>("/questions", "POST", questionData),

  // Update question
  updateQuestion: (id: number, questionData: Partial<Question>) =>
    apiRequest<ApiResponseBase>(`/questions/${id}`, "PUT", questionData),

  // Delete question
  deleteQuestion: (id: number) =>
    apiRequest<ApiResponseBase>(`/questions/${id}`, "DELETE"),
};

// Session API service interface
interface SessionApiService {
  getAllSessions: () => Promise<Session[]>;
  getAllPublicSessions: () => Promise<Session[]>;
  getPublicSessionByCanvasId: (canvasId: number) => Promise<Session>;
  getSessionById: (id: number) => Promise<Session>;
  getSessionDetail: (id: number) => Promise<SessionDetail>;
  createSession: (sessionData: {
    name: string;
    canva_id: number;
    is_public?: boolean;
  }) => Promise<SessionCreateResponse>;
  joinSession: (
    code: string,
    playerName: string,
    playerPhone?: string,
    playerEmail?: string
  ) => Promise<JoinSessionResponse>;
}

// Session API implementation
const sessionApi: SessionApiService = {
  // Get all sessions
  getAllSessions: () => apiRequest<Session[]>("/sessions"),

  // Get all public sessions
  getAllPublicSessions: () => apiRequest<Session[]>("/sessions/public"),

  // Get public session for a specific canvas
  getPublicSessionByCanvasId: (canvasId: number) =>
    apiRequest<Session>(`/sessions/public/canvas/${canvasId}`),

  // Get session by ID
  getSessionById: (id: number) => apiRequest<Session>(`/sessions/${id}`),

  // Get detailed session (includes participants & stats)
  getSessionDetail: (id: number) =>
    apiRequest<SessionDetail>(`/sessions/${id}/detail`),

  // Create new session
  createSession: (sessionData: {
    name: string;
    canva_id: number;
    is_public?: boolean;
  }) => apiRequest<SessionCreateResponse>("/sessions", "POST", sessionData),

  // Join session with code and player information in one step
  joinSession: (
    code: string,
    playerName: string,
    playerPhone: string = "",
    playerEmail: string = ""
  ) =>
    apiRequest<JoinSessionResponse>("/sessions/join", "POST", {
      code,
      playerName,
      playerPhone,
      playerEmail,
    }),
};

// Player API service interface
interface PlayerApiService {
  registerPlayer: (playerData: {
    name: string;
    sdt: string;
    email: string;
    session_id: number;
  }) => Promise<CreateResponse>;
  getPlayerDetail: (id: number) => Promise<PlayerDetail>;
  submitAnswer: (answerData: AnswerSubmission) => Promise<CreateResponse>;
  submitAllAnswers: (
    playerId: number,
    answers: Omit<AnswerSubmission, "player_id">[]
  ) => Promise<BatchAnswerResponse>;
  checkoutPlayer: (id: number) => Promise<ApiResponseBase>;
}

// Player API implementation
const playerApi: PlayerApiService = {
  // Register a new player
  registerPlayer: (playerData: {
    name: string;
    sdt: string;
    email: string;
    session_id: number;
  }) => apiRequest<CreateResponse>("/players/register", "POST", playerData),

  // Get player details
  getPlayerDetail: (id: number) => apiRequest<PlayerDetail>(`/players/${id}`),

  // Submit a single answer
  submitAnswer: (answerData: AnswerSubmission) =>
    apiRequest<CreateResponse>("/players/answer", "POST", answerData),

  // Submit all answers at once
  submitAllAnswers: (
    playerId: number,
    answers: Omit<AnswerSubmission, "player_id">[]
  ) =>
    apiRequest<BatchAnswerResponse>("/players/submit-all", "POST", {
      player_id: playerId,
      answers: answers,
    }),

  // Checkout (complete quiz)
  checkoutPlayer: (id: number) =>
    apiRequest<ApiResponseBase>(`/players/${id}/checkout`, "POST"),
};

// Dashboard API service interface
interface DashboardApiService {
  getStats: () => Promise<DashboardStats>;
  getActivities: (limit?: number) => Promise<Activity[]>;
  getQuizPopular: (limit?: number) => Promise<Canvas[]>;
}

// Dashboard API implementation
const dashboardApi: DashboardApiService = {
  // Get dashboard statistics
  getStats: () => apiRequest<DashboardStats>("/dashboard/stats"),

  // Get recent activities
  getActivities: (limit: number = 20) =>
    apiRequest<Activity[]>(`/dashboard/activities?limit=${limit}`),

  // Get popular quizzes
  getQuizPopular: (limit: number = 5) =>
    apiRequest<Canvas[]>(`/dashboard/quiz_popular?limit=${limit}`),
};

// Main API interface
interface Api {
  canvas: CanvasApiService;
  question: QuestionApiService;
  session: SessionApiService;
  player: PlayerApiService;
  dashboard: DashboardApiService;
  auth: AuthService;
}

// Add a proper type guard for activity type checking
function isSessionActivity(activity: Activity): activity is SessionActivity {
  return activity.type === "session";
}

function isCanvasActivity(activity: Activity): activity is CanvasActivity {
  return activity.type === "canvas";
}

// Export all API modules
const api: Api = {
  canvas: canvasApi,
  question: questionApi,
  session: sessionApi,
  player: playerApi,
  dashboard: dashboardApi,
  auth, // Add auth to the exported API
};

export default api;
