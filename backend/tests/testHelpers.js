const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

// Reset database mocks between tests
const resetMocks = () => {
    jest.clearAllMocks();

    // Reset the main db.query mock
    if (db.query && typeof db.query.mockReset === 'function') {
        db.query.mockReset();
    }

    // Only try to reset connection mocks if getConnection is mocked and returns something
    if (db.getConnection && typeof db.getConnection === 'function') {
        const mockConnection = db.getConnection();

        // Check if mockConnection and its methods exist before trying to reset them
        if (mockConnection) {
            if (mockConnection.query && typeof mockConnection.query.mockReset === 'function') {
                mockConnection.query.mockReset();
            }

            if (mockConnection.beginTransaction && typeof mockConnection.beginTransaction.mockReset === 'function') {
                mockConnection.beginTransaction.mockReset();
            }

            if (mockConnection.commit && typeof mockConnection.commit.mockReset === 'function') {
                mockConnection.commit.mockReset();
            }

            if (mockConnection.rollback && typeof mockConnection.rollback.mockReset === 'function') {
                mockConnection.rollback.mockReset();
            }
        }
    }
};

// Generate sample data for tests
const sampleData = {
    canvas: {
        id: 1,
        title: "Test Canvas",
        category: "Testing",
        description: "A canvas for testing",
        lastModified: new Date().toISOString(),
        created: new Date().toISOString(),
        questions: 5,
        stats: {
            timesPlayed: 10,
            totalParticipants: 50,
            avgScore: 75.5,
            completionRate: 90,
            difficultyRating: "Medium"
        }
    },

    question: {
        id: 1,
        type: "multiple_choice",
        question: "What is unit testing?",
        points: 10,
        timeLimit: 30,
        canva_id: 1,
        options: [
            { id: 1, text: "Testing individual components", isCorrect: true },
            { id: 2, text: "Testing the entire application", isCorrect: false },
            { id: 3, text: "Testing user interfaces", isCorrect: false }
        ]
    },

    session: {
        id: 1,
        name: "Test Session",
        created: new Date().toISOString(),
        code_join: "TEST123",
        canva_id: 1,
        is_public: false,
        quiz: "Test Canvas"
    },

    player: {
        id: 1,
        name: "Test Player",
        sdt: "0123456789",
        email: "test@example.com",
        checkIn: new Date().toISOString(),
        checkOut: null,
        session_id: 1
    }
};

module.exports = {
    request,
    app,
    db,
    resetMocks,
    sampleData
};
