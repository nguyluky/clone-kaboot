
// Sample data for demonstration
const sampleCanvases = [
  { id: 1, title: 'Marketing Quiz', category: 'Business', questions: 12, lastModified: '2023-08-15' },
  { id: 2, title: 'JavaScript Fundamentals', category: 'Programming', questions: 20, lastModified: '2023-08-10' },
  { id: 3, title: 'World Geography', category: 'Education', questions: 15, lastModified: '2023-08-05' },
  { id: 4, title: 'Pop Culture 2023', category: 'Entertainment', questions: 18, lastModified: '2023-07-28' },
  { id: 5, title: 'Science Quiz', category: 'Education', questions: 25, lastModified: '2023-07-20' },
  { id: 6, title: 'History Timeline', category: 'Education', questions: 22, lastModified: '2023-07-15' },
];

// Sample recent activity data
const recentActivities = [
  { id: 1, type: 'session', title: 'Marketing Class 101', date: '2023-08-15', participants: 24 },
  { id: 2, type: 'canvas', title: 'JavaScript Fundamentals', date: '2023-08-12', action: 'created' },
  { id: 3, type: 'session', title: 'Geography Finals', date: '2023-08-10', participants: 45 },
  { id: 4, type: 'canvas', title: 'Marketing Quiz', date: '2023-08-08', action: 'updated' }
];

const popularQuizzes = [
    { id: 1, title: 'Marketing Quiz', participants: 78, avgScore: 72, plays: 12 },
    { id: 2, title: 'JavaScript Fundamentals', participants: 32, avgScore: 65, plays: 8 },
    { id: 3, title: 'World Geography', participants: 45, avgScore: 82, plays: 5 },
    { id: 4, title: 'Pop Culture 2023', participants: 56, avgScore: 68, plays: 10 }
];


// Sample data for demonstration
const sampleCanvas = {
  id: 1,
  title: 'Marketing Quiz',
  category: 'Business',
  description: 'A comprehensive quiz covering basic marketing concepts, strategies, and case studies.',
  createdBy: 'John Smith',
  lastModified: '2023-08-15',
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
  ],
  stats: {
    timesPlayed: 12,
    totalParticipants: 78,
    avgScore: 72,
    completionRate: 94,
    difficultyRating: 'Medium'
  }
};

const stats = {
    quicks: 23,
    participants: 345,
    conducted: 45,
    play_time: 12,
    reports: 5
};

// Sample data for demonstration
const sampleParticipantDetail = {
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
    // Adding a sample incorrect answer
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
};
function fakeApiCall(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // randomly reject the request
            if (Math.random() < 0.02) {
                reject('Request failed');
                return;
            }
            resolve(data);
        }, 1000);
    });
}

const sampleSessionDetail = {
  id: 1,
  name: 'Marketing Class 101',
  quiz: 'Marketing Quiz',
  date: '2023-08-15',
  time: '10:30 AM',
  duration: '45 min',
  host: 'John Smith',
  participants: [
    { id: 1, name: 'Alice Johnson', score: 92, correct: 11, incorrect: 1, rank: 1 },
    { id: 2, name: 'Bob Williams', score: 85, correct: 10, incorrect: 2, rank: 2 },
    { id: 3, name: 'Charlie Brown', score: 77, correct: 9, incorrect: 3, rank: 3 },
    { id: 4, name: 'David Miller', score: 70, correct: 8, incorrect: 4, rank: 4 },
    { id: 5, name: 'Eva Davis', score: 62, correct: 7, incorrect: 5, rank: 5 },
    { id: 6, name: 'Frank Wilson', score: 54, correct: 6, incorrect: 6, rank: 6 },
  ],
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
  }
};

const sampleSessions = [
  { 
    id: 1, 
    name: 'Marketing Class 101', 
    quiz: 'Marketing Quiz', 
    date: '2023-08-15', 
    time: '10:30 AM',
    participants: 24, 
    avgScore: 78,
    duration: '45 min'
  },
  { 
    id: 2, 
    name: 'JavaScript Workshop', 
    quiz: 'JavaScript Fundamentals', 
    date: '2023-08-10', 
    time: '2:00 PM',
    participants: 32, 
    avgScore: 65,
    duration: '60 min'
  },
  { 
    id: 3, 
    name: 'Geography Finals', 
    quiz: 'World Geography', 
    date: '2023-08-05', 
    time: '9:15 AM',
    participants: 45, 
    avgScore: 82,
    duration: '50 min'
  },
  { 
    id: 4, 
    name: 'Team Building Event', 
    quiz: 'Pop Culture 2023', 
    date: '2023-07-28', 
    time: '3:30 PM',
    participants: 18, 
    avgScore: 91,
    duration: '30 min'
  },
  { 
    id: 5, 
    name: 'Science Class 10B', 
    quiz: 'Science Quiz', 
    date: '2023-07-20', 
    time: '11:00 AM',
    participants: 29, 
    avgScore: 73,
    duration: '40 min'
  },
];

const api = {

    getCanvasList: () => fakeApiCall(sampleCanvases),
    getRecentActivities: () => fakeApiCall(recentActivities),
    getPopularQuizzes: () => fakeApiCall(popularQuizzes),
    getStats: () => fakeApiCall(stats),
    getCanvas: () => fakeApiCall(sampleCanvas),
    getParticipantDetail: () => fakeApiCall(sampleParticipantDetail),
    getSessionDetail: () => fakeApiCall(sampleSessionDetail),
    getSessions: () => fakeApiCall(sampleSessions),
}

export default api;