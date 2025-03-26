const { request, app, db, resetMocks, sampleData } = require('../testHelpers');

describe('Player API', () => {
    beforeEach(() => {
        resetMocks();
    });

    describe('POST /api/players/register', () => {
        it('should register a new player', async () => {
            // Mock session check
            db.query.mockResolvedValueOnce([[sampleData.session]]);
            // Mock player insertion
            db.query.mockResolvedValueOnce([{ insertId: 10 }]);

            const playerData = {
                name: "New Test Player",
                sdt: "0987654321",
                email: "newplayer@example.com",
                session_id: 1
            };

            const response = await request(app)
                .post('/api/players/register')
                .send(playerData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id', 10);
            expect(response.body).toHaveProperty('message', 'Player registered successfully');
        });

        it('should return 400 if required fields are missing', async () => {
            const incompletePlayer = {
                // Missing name
                session_id: 1
            };

            const response = await request(app)
                .post('/api/players/register')
                .send(incompletePlayer);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing required fields');
        });
    });

    describe('GET /api/players/:id', () => {
        it('should return player details', async () => {
            // Mock getPlayerById
            db.query.mockResolvedValueOnce([[sampleData.player]]);

            // Mock session info
            db.query.mockResolvedValueOnce([[{
                id: 1,
                sessionName: "Test Session",
                canvaId: 1,
                quizName: "Test Canvas",
                date: new Date().toISOString(),
                totalQuestions: 5
            }]]);

            // Mock answers
            db.query.mockResolvedValueOnce([[{
                questionId: 1,
                questionText: "What is unit testing?",
                responseTime: 15,
                points: 10,
                participantAnswer: "Testing individual components",
                correctAnswer: "Testing individual components",
                isCorrect: true
            }]]);

            // Mock rank
            db.query.mockResolvedValueOnce([[{ rank: 1 }]]);

            const response = await request(app).get(`/api/players/${sampleData.player.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', sampleData.player.id);
            expect(response.body).toHaveProperty('name', sampleData.player.name);
            expect(response.body).toHaveProperty('answers');
            expect(Array.isArray(response.body.answers)).toBe(true);
        });

        it('should return 404 if player not found', async () => {
            // Mock empty result
            db.query.mockResolvedValueOnce([[]]);

            const response = await request(app).get('/api/players/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Player not found');
        });
    });

    describe('POST /api/players/answer', () => {
        it('should submit a player answer', async () => {
            // Mock answer insertion
            db.query.mockResolvedValueOnce([{ insertId: 25 }]);

            const answerData = {
                player_id: 1,
                question_id: 1,
                option_id: 1,
                responseTime: 15
            };

            const response = await request(app)
                .post('/api/players/answer')
                .send(answerData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id', 25);
            expect(response.body).toHaveProperty('message', 'Answer submitted successfully');
        });

        it('should return 400 if required fields are missing', async () => {
            const incompleteAnswer = {
                player_id: 1,
                // Missing question_id
                option_id: 1
            };

            const response = await request(app)
                .post('/api/players/answer')
                .send(incompleteAnswer);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing required fields');
        });
    });

    describe('POST /api/players/:id/checkout', () => {
        it('should checkout a player', async () => {
            // Mock getPlayerById
            db.query.mockResolvedValueOnce([[sampleData.player]]);
            // Mock checkout update
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const response = await request(app)
                .post(`/api/players/${sampleData.player.id}/checkout`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Player checked out successfully');
        });

        it('should return 404 if player not found', async () => {
            // Mock empty result
            db.query.mockResolvedValueOnce([[]]);

            const response = await request(app)
                .post('/api/players/999/checkout');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Player not found');
        });
    });
});
