const { request, app, db, resetMocks, sampleData } = require('../testHelpers');

describe('Canvas API', () => {
    beforeEach(() => {
        resetMocks();
    });

    describe('GET /api/canvas', () => {
        it('should return all canvases', async () => {
            // Mock the database response
            db.query.mockResolvedValueOnce([[sampleData.canvas]]);
            db.query.mockResolvedValueOnce([[{ timesPlayed: 10, totalParticipants: 50 }]]);
            db.query.mockResolvedValueOnce([[{ avgScore: 75.5 }]]);
            db.query.mockResolvedValueOnce([[{ completionRate: 90 }]]);

            const response = await request(app).get('/api/canvas');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('id', sampleData.canvas.id);
            expect(response.body[0]).toHaveProperty('title', sampleData.canvas.title);
            expect(response.body[0].stats).toHaveProperty('difficultyRating');
            expect(db.query).toHaveBeenCalledTimes(4);
        });

        it('should handle database errors', async () => {
            // Mock a database error
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app).get('/api/canvas');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal server error');
        });
    });

    describe('GET /api/canvas/:id', () => {
        it('should return a specific canvas by ID', async () => {
            // Mock the database responses
            db.query.mockResolvedValueOnce([[sampleData.canvas]]);
            db.query.mockResolvedValueOnce([[{ timesPlayed: 10, totalParticipants: 50 }]]);
            db.query.mockResolvedValueOnce([[{ avgScore: 75.5 }]]);
            db.query.mockResolvedValueOnce([[{ completionRate: 90 }]]);

            const response = await request(app).get(`/api/canvas/${sampleData.canvas.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', sampleData.canvas.id);
            expect(response.body).toHaveProperty('title', sampleData.canvas.title);
        });

        it('should return 404 if canvas not found', async () => {
            // Mock empty result
            db.query.mockResolvedValueOnce([[]]);

            const response = await request(app).get('/api/canvas/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Canvas not found');
        });
    });

    describe('POST /api/canvas', () => {
        it('should create a new canvas', async () => {
            // Mock the insertId response
            db.query.mockResolvedValueOnce([{ insertId: 5 }]);

            const newCanvas = {
                title: "New Test Canvas",
                category: "Testing",
                description: "A new canvas for testing"
            };

            const response = await request(app)
                .post('/api/canvas')
                .send(newCanvas);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id', 5);
            expect(response.body).toHaveProperty('message', 'Canvas created successfully');
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if required fields are missing', async () => {
            const incompleteCanvas = {
                title: "Incomplete Canvas"
                // Missing category and description
            };

            const response = await request(app)
                .post('/api/canvas')
                .send(incompleteCanvas);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing required fields');
            expect(db.query).not.toHaveBeenCalled();
        });
    });

    describe('PUT /api/canvas/:id', () => {
        it('should update an existing canvas', async () => {
            // Mock the getCanvaById response
            db.query.mockResolvedValueOnce([[sampleData.canvas]]);
            db.query.mockResolvedValueOnce([[{ timesPlayed: 10, totalParticipants: 50 }]]);
            db.query.mockResolvedValueOnce([[{ avgScore: 75.5 }]]);
            db.query.mockResolvedValueOnce([[{ completionRate: 90 }]]);
            // Mock the update response
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const updateData = {
                title: "Updated Canvas Title",
                category: "Updated Category",
                description: "Updated description"
            };

            const response = await request(app)
                .put(`/api/canvas/${sampleData.canvas.id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Canvas updated successfully');
            expect(db.query).toHaveBeenCalledTimes(5);
        });
    });

    describe('DELETE /api/canvas/:id', () => {
        it('should delete a canvas', async () => {
            // Mock the getCanvaById response
            db.query.mockResolvedValueOnce([[sampleData.canvas]]);
            db.query.mockResolvedValueOnce([[{ timesPlayed: 10, totalParticipants: 50 }]]);
            db.query.mockResolvedValueOnce([[{ avgScore: 75.5 }]]);
            db.query.mockResolvedValueOnce([[{ completionRate: 90 }]]);
            // Mock the delete response
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const response = await request(app).delete(`/api/canvas/${sampleData.canvas.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Canvas deleted successfully');
            expect(db.query).toHaveBeenCalledTimes(5);
        });
    });
});
