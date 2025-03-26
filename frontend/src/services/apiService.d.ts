/**
 * API Service for Clone Kaboot - TypeScript Version
 *
 * This service provides strongly typed methods to interact with the Clone Kaboot backend API.
 * It handles all the API calls and returns responses in a consistent format.
 */
export interface CanvasStats {
  timesPlayed: number;
  totalParticipants: number;
  avgScore: number;
  completionRate: number;
  difficultyRating: "Medium" | "Hard" | "EZ";
}
export interface Canvas {
  id: number;
  title: string;
  category: string;
  description: string;
  lastModified: String;
  created: String;
  questions: number;
  stats: CanvasStats;
}
export interface CanvasDetail extends Omit<Canvas, "questions"> {
  questions: Question[];
}
export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
}
export interface Question {
  id: number;
  type: "multiple_choice" | "single_choice" | "text";
  question: string;
  timeLimit: number;
  points: number;
  canva_id?: number;
  options: QuestionOption[];
}
export interface Session {
  id: number;
  name: string;
  created: String;
  code_join: string;
  is_public: boolean;
  quiz: string;
  participants: number;
  canva_id?: number;
}
export interface Player {
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
  String: String;
  totalQuestions: number;
  rank: number;
  checkIn: String;
  checkOut: String;
}
export interface PlayerDetail extends Player {
  answers: PlayerAnswer[];
}
export interface PlayerAnswer {
  questionId: number;
  questionText: string;
  correctAnswer: string;
  participantAnswer: string;
  isCorrect: boolean;
  responseTime: number;
  points: number;
}
export interface AnswerSubmission {
  player_id: number;
  question_id: number;
  option_id: number | null;
  responseTime: number;
}
export interface QuestionStats {
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
export interface SessionStats {
  avgScore: number;
  avgTimePerQuestion: number;
  totalParticipants: number;
  completionRate: number;
}
export interface SessionDetail {
  id: number;
  name: string;
  quiz: string;
  created: String;
  code_join: string;
  participants: Omit<Player, "answers">[];
  questions: QuestionStats[];
  stats: SessionStats;
}
export interface DashboardStats {
  quicks: number;
  participants: number;
  conducted: number;
  play_time: number;
  reports: number;
}
export interface SessionActivity {
  id: number;
  type: "session";
  title: string;
  String: String;
  participants: number;
  date: String;
}
export interface CanvasActivity {
  id: number;
  type: "canvas";
  title: string;
  String: String;
  action: "upStringd" | "created" | "delete";
  date: String;
}
export type Activity = SessionActivity | CanvasActivity;
export interface User {
  id: number;
  username: string;
  role: "admin" | "player";
  playerId?: number;
}
export interface ApiResponseBase {
  message?: string;
}
export interface CreateResponse extends ApiResponseBase {
  id: number;
}
export interface SessionCreateResponse extends CreateResponse {
  code: string;
}
export interface JoinSessionResponse {
  session_id: number;
  player_id: number;
  name: string;
  quiz: string;
  questions: Question[];
}
export interface BatchAnswerResponse extends ApiResponseBase {
  answersProcessed: number;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
}
export interface AuthService {
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
export interface CanvasApiService {
  getAllCanvas: () => Promise<Canvas[]>;
  getCanvasById: (id: number | string) => Promise<Canvas>;
  getCanvasDetail: (id: number | string) => Promise<CanvasDetail>;
  createCanvas: (canvasData: Partial<Canvas>) => Promise<CreateResponse>;
  upStringCanvas: (
    id: number,
    canvasData: Partial<Canvas>
  ) => Promise<ApiResponseBase>;
  deleteCanvas: (id: number) => Promise<ApiResponseBase>;
}
export interface QuestionApiService {
  getQuestionById: (id: number) => Promise<Question>;
  createQuestion: (questionData: Partial<Question>) => Promise<CreateResponse>;
  upStringQuestion: (
    id: number,
    questionData: Partial<Question>
  ) => Promise<ApiResponseBase>;
  deleteQuestion: (id: number) => Promise<ApiResponseBase>;
}
export interface SessionApiService {
  getAllSessions: () => Promise<Session[]>;
  getAllPublicSessions: () => Promise<Session[]>;
  getPublicSessionByCanvasId: (canvasId: number) => Promise<Session>;
  getSessionById: (id: number | string) => Promise<Session>;
  getSessionDetail: (id: number | string) => Promise<SessionDetail>;
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
export interface PlayerApiService {
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
export interface DashboardApiService {
  getStats: () => Promise<DashboardStats>;
  getActivities: (limit?: number) => Promise<Activity[]>;
  getQuizPopular: (limit?: number) => Promise<Canvas[]>;
}
export interface Api {
  canvas: CanvasApiService;
  question: QuestionApiService;
  session: SessionApiService;
  player: PlayerApiService;
  dashboard: DashboardApiService;
  auth: AuthService;
}
declare const api: Api;
export default api;
