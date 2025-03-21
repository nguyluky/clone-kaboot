const { request, app, db, resetMocks, sampleData } = require('../testHelpers');

describe('Question API', () => {
    beforeEach(() => {
        resetMocks();
    });

    describe('GET /api/questions/:id', () => {
        it('should return a specific question by ID', async () => {
            // Mock the database response
            db.query.mockResolvedValueOnce([[sampleData.question]]);
            db.query.mockResolvedValueOnce([sampleData.question.options]);

            const response = await request(app).get(`/api/questions/${sampleData.question.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', sampleData.question.id);
            expect(response.body).toHaveProperty('type', sampleData.question.type);
            expect(response.body).toHaveProperty('question', sampleData.question.question);
            expect(response.body).toHaveProperty('options');
            expect(Array.isArray(response.body.options)).toBe(true);
        });

        it('should return 404 if question not found', async () => {
            // Mock empty result
            db.query.mockResolvedValueOnce([[]]);

            const response = await request(app).get('/api/questions/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Question not found');
        });
    });

    describe('POST /api/questions', () => {
        it('should create a new question', async () => {
            // Mock canvas check
            db.query.mockResolvedValueOnce([[sampleData.canvas]]);
            db.query.mockResolvedValueOnce([[{ timesPlayed: 10, totalParticipants: 50 }]]);
            db.query.mockResolvedValueOnce([[{ avgScore: 75.5 }]]);
            db.query.mockResolvedValueOnce([[{ completionRate: 90 }]]);

            // Mock connection methods
            const mockConnection = db.getConnection();
            mockConnection.query.mockResolvedValueOnce([{ insertId: 5 }]);
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 3 }]);

            // Mock update canvas lastModified
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const newQuestion = {
                canva_id: 1,
                type: "multiple_choice",
                question: "New test question?",
                points: 10,
                timeLimit: 30,
                options: [
                    { text: "Option 1", isCorrect: true },
                    { text: "Option 2", isCorrect: false },
                    { text: "Option 3", isCorrect: false }
                ]
            };

            const response = await request(app)
                .post('/api/questions')
                .send(newQuestion);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id', 5);
            expect(response.body).toHaveProperty('message', 'Question created successfully');
            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.commit).toHaveBeenCalled();
        });

        it('should return 400 if required fields are missing', async () => {
            const incompleteQuestion = {
                // Missing required fields
                question: "Incomplete question"
            };

            const response = await request(app)
                .post('/api/questions')
                .send(incompleteQuestion);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing required fields');
        });
    });

    describe('PUT /api/questions/:id', () => {
        it('should update an existing question', async () => {
            // Mock getQuestionById response
            db.query.mockResolvedValueOnce([[sampleData.question]]);
            db.query.mockResolvedValueOnce([sampleData.question.options]);

            // Mock connection methods for transaction
            const mockConnection = db.getConnection();
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 3 }]);

            // Mock getCanva_id and update lastModified
            db.query.mockResolvedValueOnce([[{ canva_id: 1 }]]);
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const updateData = {
                question: "Updated question text?",
                points: 15,
                options: [
                    { text: "Updated Option 1", isCorrect: true },
                    { text: "Updated Option 2", isCorrect: false },
                    { text: "Updated Option 3", isCorrect: false }
                ]
            };

            const response = await request(app)
                .put(`/api/questions/${sampleData.question.id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Question updated successfully');
            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.commit).toHaveBeenCalled();
        });
    });

    describe('DELETE /api/questions/:id', () => {
        it('should delete a question', async () => {
            // Mock getQuestionById response
            db.query.mockResolvedValueOnce([[sampleData.question]]);
            db.query.mockResolvedValueOnce([sampleData.question.options]);

            // Mock getCanva_id and delete
            db.query.mockResolvedValueOnce([[{ canva_id: 1 }]]);
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            // Mock update lastModified
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const response = await request(app).delete(`/api/questions/${sampleData.question.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Question deleted successfully');
        });
    });
});
