// file chỉ định nghĩ các kiểu dữ liệu trả về từ api
// không chứa logic xử lý dữ liệu

interface CavasStas {
  timesPlayed: number; // session
  totalParticipants: number;
  avgScore: number;
  completionRate: number;
  difficultyRating: "Medium" | "Hard" | "EZ";
}

export interface Question {
  id: number;
  type: "multiple-choice" | "yes-no" | "text";
  question: string;
  timeLimit: number;
  points: number;
  options: {
    id: number;
    text: string;
    isCorrect: boolean;
  };
}

export interface Cavas {
  id: number;
  title: string;
  category: string;
  description: string;
  latModified: Date;
  crated: Date;
  questions: number;
  stats: CavasStas;
}

export type CavasDetail = Cavas & {
  questions: Question[];
};

export interface DashboardStats {
  quicks: number;
  participants: number;
  conducted: number;
  play_time: number;
  reports: number;
}

interface SessionActiviti {
  id: number;
  type: "session";
  title: string;
  date: Date;
  participants: number;
}

interface CanvaActiviti {
  id: number;
  type: "canvas";
  title: string;
  date: Date;
  action: "updated" | "created" | "delete";
}

export type RecentActiviti = SessionActiviti | CanvaActiviti;

export interface ParticipantDetail {
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
  answers: {
    questionId: number;
    questionText: string;
    correctAnswer: string;
    participantAnswer: string;
    isCorrect: boolean;
    responseTime: number;
    points: number;
  }[];
}

export interface SessionDetail {
  id: number;
  name: string;
  quiz: string;
  created: Date;
  code_join: string;
  participants: Omit<ParticipantDetail, "answers">[];
  questions: {
    id: number;
    question: string;
    correctPercentage: number;
    avgResponseTime: number;
    distribution: {
      answer: string;
      count: number;
      isCorrect: false;
    }[];
  }[];
  stats: {
    avgScore: number;
    avgTimePerQuestion: number;
    totalParticipants: number;
    completionRate: number;
  };
}
