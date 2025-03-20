// Sample data for the fake database

// Sessions data
const sessions = [
  { 
    id: 1, 
    name: 'Marketing Class 101', 
    quiz: 'Marketing Quiz', 
    date: '2023-08-15', 
    time: '10:30 AM',
    // participants: 24, 
    avgScore: 78,
    duration: '45 min',
    host: 'John Smith',
    questions: [
      {
        id: 1,
        question: 'What is the 4 Ps of Marketing?',
        correctAnswer: 'Price, Product, Promotion, Place',
        correctPercentage: 83,
        avgResponseTime: 12.4,
        distribution: [
          { answer: 'Price, Product, Promotion, Place', count: 20, isCorrect: true },
          { answer: 'People, Process, Product, Price', count: 3, isCorrect: false },
          { answer: 'Promotion, Place, People, Process', count: 1, isCorrect: false },
          { answer: 'Product, Price, Process, People', count: 0, isCorrect: false }
        ]
      },
      {
        id: 2,
        question: 'Which of these is NOT a marketing strategy?',
        correctAnswer: 'Financial Marketing',
        correctPercentage: 62,
        avgResponseTime: 18.7,
        distribution: [
          { answer: 'Outbound Marketing', count: 2, isCorrect: false },
          { answer: 'Inbound Marketing', count: 3, isCorrect: false },
          { answer: 'Content Marketing', count: 4, isCorrect: false },
          { answer: 'Financial Marketing', count: 15, isCorrect: true }
        ]
      },
      {
        id: 3,
        question: 'Digital marketing is more effective than traditional marketing in all scenarios.',
        correctAnswer: 'False',
        correctPercentage: 75,
        avgResponseTime: 8.1,
        distribution: [
          { answer: 'True', count: 6, isCorrect: false },
          { answer: 'False', count: 18, isCorrect: true }
        ]
      }
    ],
    stats: {
      avgScore: 78,
      avgTimePerQuestion: 13.1,
      totalParticipants: 24,
      completionRate: 100,
    },
    participants: [
      { id: 1, name: 'Alice Johnson', score: 92, correct: 11, incorrect: 1, rank: 1 },
      { id: 2, name: 'Bob Williams', score: 85, correct: 10, incorrect: 2, rank: 2 },
      { id: 3, name: 'Charlie Brown', score: 77, correct: 9, incorrect: 3, rank: 3 },
      { id: 4, name: 'David Miller', score: 70, correct: 8, incorrect: 4, rank: 4 },
      { id: 5, name: 'Eva Davis', score: 62, correct: 7, incorrect: 5, rank: 5 },
      { id: 6, name: 'Frank Wilson', score: 54, correct: 6, incorrect: 6, rank: 6 },
    ],
  },
  { 
    id: 2, 
    name: 'JavaScript Workshop', 
    quiz: 'JavaScript Fundamentals', 
    date: '2023-08-10', 
    time: '2:00 PM',
    participants: 32, 
    avgScore: 65,
    duration: '60 min',
    host: 'Sarah Chen',
    stats: {
      avgScore: 65,
      avgTimePerQuestion: 15.8,
      totalParticipants: 32,
      completionRate: 94,
    }
  },
  { 
    id: 3, 
    name: 'Geography Finals', 
    quiz: 'World Geography', 
    date: '2023-08-05', 
    time: '9:15 AM',
    participants: 45, 
    avgScore: 82,
    duration: '50 min',
    host: 'Michael Brown',
    stats: {
      avgScore: 82,
      avgTimePerQuestion: 11.2,
      totalParticipants: 45,
      completionRate: 98,
    }
  },
  { 
    id: 4, 
    name: 'Team Building Event', 
    quiz: 'Pop Culture 2023', 
    date: '2023-07-28', 
    time: '3:30 PM',
    participants: 18, 
    avgScore: 91,
    duration: '30 min',
    host: 'Emily Wilson',
    stats: {
      avgScore: 91,
      avgTimePerQuestion: 8.4,
      totalParticipants: 18,
      completionRate: 100,
    }
  },
  { 
    id: 5, 
    name: 'Science Class 10B', 
    quiz: 'Science Quiz', 
    date: '2023-07-20', 
    time: '11:00 AM',
    participants: 29, 
    avgScore: 73,
    duration: '40 min',
    host: 'David Parker',
    stats: {
      avgScore: 73,
      avgTimePerQuestion: 14.5,
      totalParticipants: 29,
      completionRate: 96,
    }
  },
];

// Canvas (quiz) data
const canvases = [
  {
    id: 1,
    title: 'Marketing Quiz',
    category: 'Business',
    // questions: 12,
    lastModified: '2023-08-15',
    description: 'A comprehensive quiz covering basic marketing concepts, strategies, and case studies.',
    createdBy: 'John Smith',
    stats: {
      timesPlayed: 12,
      totalParticipants: 78,
      avgScore: 72,
      completionRate: 94,
      difficultyRating: 'Medium'
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the 4 Ps of Marketing?',
        timeLimit: 60,
        points: 100,
        options: [
          { id: 'a', text: 'Price, Product, Promotion, Place' },
          { id: 'b', text: 'People, Process, Product, Price' },
          { id: 'c', text: 'Promotion, Place, People, Process' },
          { id: 'd', text: 'Product, Price, Process, People' }
        ],
        correctAnswer: 'a'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which of these is NOT a marketing strategy?',
        timeLimit: 45,
        points: 75,
        options: [
          { id: 'a', text: 'Outbound Marketing' },
          { id: 'b', text: 'Inbound Marketing' },
          { id: 'c', text: 'Content Marketing' },
          { id: 'd', text: 'Financial Marketing' }
        ],
        correctAnswer: 'd'
      },
      {
        id: 3,
        type: 'true-false',
        question: 'Digital marketing is more effective than traditional marketing in all scenarios.',
        timeLimit: 30,
        points: 50,
        options: [
          { id: 'a', text: 'True' },
          { id: 'b', text: 'False' }
        ],
        correctAnswer: 'b'
      }
    ]
  },
  { 
    id: 2, 
    title: 'JavaScript Fundamentals', 
    category: 'Programming', 
    questions: 20, 
    lastModified: '2023-08-10',
    description: 'Core JavaScript concepts for beginners and intermediate developers.',
    createdBy: 'Sarah Chen',
    stats: {
      timesPlayed: 8,
      totalParticipants: 32,
      avgScore: 65,
      completionRate: 88,
      difficultyRating: 'Hard'
    }
  },
  { 
    id: 3, 
    title: 'World Geography', 
    category: 'Education', 
    questions: 15, 
    lastModified: '2023-08-05',
    description: 'Test your knowledge about countries, capitals, and geographical features.',
    createdBy: 'Michael Brown',
    stats: {
      timesPlayed: 5,
      totalParticipants: 45,
      avgScore: 82,
      completionRate: 98,
      difficultyRating: 'Medium'
    }
  },
  { 
    id: 4, 
    title: 'Pop Culture 2023', 
    category: 'Entertainment', 
    questions: 18, 
    lastModified: '2023-07-28',
    stats: {
      timesPlayed: 3,
      totalParticipants: 18,
      avgScore: 91,
      completionRate: 100,
      difficultyRating: 'Easy'
    }
  },
  { 
    id: 5, 
    title: 'Science Quiz', 
    category: 'Education', 
    questions: 25, 
    lastModified: '2023-07-20',
    stats: {
      timesPlayed: 6,
      totalParticipants: 29,
      avgScore: 73,
      completionRate: 92,
      difficultyRating: 'Medium'
    }
  },
  { 
    id: 6, 
    title: 'History Timeline', 
    category: 'Education', 
    questions: 22, 
    lastModified: '2023-07-15',
    stats: {
      timesPlayed: 4,
      totalParticipants: 22,
      avgScore: 68,
      completionRate: 90,
      difficultyRating: 'Hard'
    }
  },
];

// Participant details
const participants = [
  {
    id: 1,
    name: 'Alice Johnson',
    score: 92,
    rank: 1,
    correctAnswers: 11,
    incorrectAnswers: 1,
    averageResponseTime: 8.3,
    sessionName: 'Marketing Class 101',
    quizName: 'Marketing Quiz',
    date: '2023-08-15',
    totalQuestions: 12,
    answers: [
      {
        questionId: 1,
        questionText: 'What is the 4 Ps of Marketing?',
        correctAnswer: 'Price, Product, Promotion, Place',
        participantAnswer: 'Price, Product, Promotion, Place',
        isCorrect: true,
        responseTime: 7.2,
        points: 100
      },
      {
        questionId: 2,
        questionText: 'Which of these is NOT a marketing strategy?',
        correctAnswer: 'Financial Marketing',
        participantAnswer: 'Financial Marketing',
        isCorrect: true,
        responseTime: 12.5,
        points: 75
      },
      {
        questionId: 3,
        questionText: 'Digital marketing is more effective than traditional marketing in all scenarios.',
        correctAnswer: 'False',
        participantAnswer: 'False',
        isCorrect: true,
        responseTime: 5.3,
        points: 50
      },
      {
        questionId: 4,
        questionText: 'What is the primary goal of content marketing?',
        correctAnswer: 'Provide value to attract and engage a target audience',
        participantAnswer: 'Directly sell products through content',
        isCorrect: false,
        responseTime: 9.8,
        points: 0
      }
    ]
  },
  // Add more participant details as needed
];

// Dashboard statistics
const dashboardStats = {
  totalQuizzes: 6,
  totalParticipants: 128,
  totalSessions: 15,
  totalPlayTime: '24h',
  reportsCount: 8
};

// Recent activity data
const recentActivities = [
  { id: 1, type: 'session', name: 'Marketing Class 101', date: '2023-08-15', participants: 24 },
  { id: 2, type: 'canvas', name: 'JavaScript Fundamentals', date: '2023-08-12', action: 'created' },
  { id: 3, type: 'session', name: 'Geography Finals', date: '2023-08-10', participants: 45 },
  { id: 4, type: 'canvas', name: 'Marketing Quiz', date: '2023-08-08', action: 'updated' }
];

// Popular quizzes
const popularQuizzes = [
  { id: 1, title: 'Marketing Quiz', participants: 78, avgScore: 72, plays: 12 },
  { id: 2, title: 'JavaScript Fundamentals', participants: 32, avgScore: 65, plays: 8 },
  { id: 3, title: 'World Geography', participants: 45, avgScore: 82, plays: 5 }
];

// Helper function to simulate async API calls
const asyncResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Session API
export const sessionApi = {
  getAll: () => asyncResponse(sessions),
  getById: (id) => asyncResponse(sessions.find(session => session.id.toString() === id.toString())),
};

// Canvas API
export const canvasApi = {
  getAll: () => asyncResponse(canvases),
  getById: (id) => asyncResponse(canvases.find(canvas => canvas.id.toString() === id.toString())),
};

// Participant API
export const participantApi = {
  getById: (id) => asyncResponse(participants.find(participant => participant.id.toString() === id.toString())),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => asyncResponse(dashboardStats),
  getRecentActivity: () => asyncResponse(recentActivities),
  getPopularQuizzes: () => asyncResponse(popularQuizzes),
};
