const { request, app, db, resetMocks, sampleData } = require('../testHelpers');

describe('Session API', () => {
    beforeEach(() => {
        resetMocks();
    });

    describe('GET /api/sessions', () => {
        it('should return all sessions', async () => {
            // Mock the database response
            db.query.mockResolvedValueOnce([[sampleData.session]]);

            const response = await request(app).get('/api/sessions');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('id', sampleData.session.id);
            expect(response.body[0]).toHaveProperty('name', sampleData.session.name);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/sessions/public', () => {
        it('should return all public sessions', async () => {
            // Clone and modify sample data to be public
            const publicSession = { ...sampleData.session, is_public: true };

            // Mock the database response
            db.query.mockResolvedValueOnce([[publicSession]]);

            const response = await request(app).get('/api/sessions/public');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('is_public', true);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/sessions/:id', () => {
        it('should return a specific session by ID', async () => {
            // Mock the database response
            db.query.mockResolvedValueOnce([[sampleData.session]]);

            const response = await request(app).get(`/api/sessions/${sampleData.session.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', sampleData.session.id);
            expect(response.body).toHaveProperty('name', sampleData.session.name);
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should return 404 if session not found', async () => {
            // Mock empty result
            db.query.mockResolvedValueOnce([[]]);

            const response = await request(app).get('/api/sessions/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Session not found');
        });
    });

    describe('POST /api/sessions', () => {
        it('should create a new session', async () => {
            // Mock canvas check
            db.query.mockResolvedValueOnce([[sampleData.canvas]]);
            db.query.mockResolvedValueOnce([[{ timesPlayed: 10, totalParticipants: 50 }]]);
            db.query.mockResolvedValueOnce([[{ avgScore: 75.5 }]]);
            db.query.mockResolvedValueOnce([[{ completionRate: 90 }]]);
            // Mock public session check
            db.query.mockResolvedValueOnce([[]]);
            // Mock insert 
            db.query.mockResolvedValueOnce([{ insertId: 5 }]);

            const newSession = {
                name: "New Test Session",
                canva_id: 1,
                is_public: true
            };

            const response = await request(app)
                .post('/api/sessions')
                .send(newSession);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id', 5);
            expect(response.body).toHaveProperty('code');
            expect(response.body).toHaveProperty('message', 'Session created successfully');
        });

        it('should return 400 if canvas already has a public session', async () => {
            // Mock canvas check
            db.query.mockResolvedValueOnce([[sampleData.canvas]]);
            db.query.mockResolvedValueOnce([[{ timesPlayed: 10, totalParticipants: 50 }]]);
            db.query.mockResolvedValueOnce([[{ avgScore: 75.5 }]]);
            db.query.mockResolvedValueOnce([[{ completionRate: 90 }]]);
            // Mock public session check - exists
            db.query.mockResolvedValueOnce([[{ id: 3 }]]);

            const newSession = {
                name: "New Public Session",
                canva_id: 1,
                is_public: true
            };

            const response = await request(app)
                .post('/api/sessions')
                .send(newSession);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Canvas đã có phiên thi public');
        });
    });

    describe('POST /api/sessions/join', () => {
        it('should allow joining a session with valid code', async () => {
            // Mock the getSessionByCode response
            db.query.mockResolvedValueOnce([[sampleData.session]]);

            const response = await request(app)
                .post('/api/sessions/join')
                .send({ code: 'TEST123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('session_id', sampleData.session.id);
            expect(response.body).toHaveProperty('name', sampleData.session.name);
            expect(response.body).toHaveProperty('quiz', sampleData.session.quiz);
        });

        it('should return 404 if session code is invalid', async () => {
            // Mock empty result
            db.query.mockResolvedValueOnce([[]]);

            const response = await request(app)
                .post('/api/sessions/join')
                .send({ code: 'INVALID' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Invalid session code');
        });

        it('should allow joining a session with valid code and player information', async () => {
            // Mock the getSessionByCode response
            db.query.mockResolvedValueOnce([[sampleData.session]]);
            // Mock question response
            db.query.mockResolvedValueOnce([[{
                id: 1,
                type: "multiple_choice",
                question: "Test question?",
                points: 10,
                timeLimit: 30
            }]]);
            db.query.mockResolvedValueOnce([[
                { id: 1, text: "Option 1", isCorrect: true },
                { id: 2, text: "Option 2", isCorrect: false }
            ]]);
            // Mock player creation
            db.query.mockResolvedValueOnce([{ insertId: 42 }]);

            const response = await request(app)
                .post('/api/sessions/join')
                .send({
                    code: 'TEST123',
                    playerName: 'Test Player',
                    playerPhone: '0123456789',
                    playerEmail: 'test@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('session_id', sampleData.session.id);
            expect(response.body).toHaveProperty('player_id', 42);
            expect(response.body).toHaveProperty('name', sampleData.session.name);
            expect(response.body).toHaveProperty('quiz', sampleData.session.quiz);
            expect(response.body).toHaveProperty('questions');
            expect(Array.isArray(response.body.questions)).toBe(true);
        });

        it('should return 400 if player name is missing', async () => {
            const response = await request(app)
                .post('/api/sessions/join')
                .send({
                    code: 'TEST123',
                    // Missing playerName
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Player name is required');
        });
    });
});
