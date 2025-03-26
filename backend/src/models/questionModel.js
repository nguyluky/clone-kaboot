const db = require('../config/db');

async function executeWithRetry(queryFn, retries = 0) {
    try {
        await queryFn();
    } catch (err) {
        if (err.code === 'ER_LOCK_DEADLOCK' && retries < MAX_RETRIES) {
            console.log(`Deadlock detected. Retrying (${retries + 1}/${MAX_RETRIES})...`);
            await executeWithRetry(queryFn, retries + 1);
        } else {
            throw err; // Rethrow if it's not a deadlock or max retries reached
        }
    }
}

class QuestionModel {
    async getQuestionsByCanvaId(canvaId) {
        try {
            const [questions] = await db.query(`
        SELECT id, type, question, point as points, timeLimit
        FROM Question
        WHERE canva_id = ?
      `, [canvaId]);

            for (const question of questions) {
                const [options] = await db.query(`
          SELECT id, text, isCorrect
          FROM Options
          WHERE question_id = ?
        `, [question.id]);

                question.options = options;
            }

            return questions;
        } catch (error) {
            console.error('Error getting questions by canvas id:', error);
            throw error;
        }
    }

    async getQuestionById(id) {
        try {
            const [questions] = await db.query(`
        SELECT id, type, question, point as points, timeLimit, canva_id
        FROM Question
        WHERE id = ?
      `, [id]);

            if (questions.length === 0) {
                return null;
            }

            const question = questions[0];

            const [options] = await db.query(`
        SELECT id, text, isCorrect
        FROM Options
        WHERE question_id = ?
      `, [id]);

            question.options = options;

            return question;
        } catch (error) {
            console.error('Error getting question by id:', error);
            throw error;
        }
    }

    async createQuestion(questionData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO Question (type, question, point, timeLimit, canva_id) VALUES (?, ?, ?, ?, ?)',
                [questionData.type, questionData.question, questionData.points, questionData.timeLimit, questionData.canva_id]
            );

            const questionId = result.insertId;

            if (questionData.options && questionData.options.length > 0) {
                const optionsValues = questionData.options.map(option =>
                    [option.text, option.isCorrect, questionId]
                );

                await connection.query(
                    'INSERT INTO Options (text, isCorrect, question_id) VALUES ?',
                    [optionsValues]
                );
            }

            await connection.commit();

            // Update canvas lastModified timestamp
            await db.query(
                'UPDATE Canva SET lastModified = ? WHERE id = ?',
                [new Date(), questionData.canva_id]
            );

            return questionId;
        } catch (error) {
            await connection.rollback();
            console.error('Error creating question:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateQuestion(id, questionData) {
        const connection = await db.getConnection();
        executeWithRetry(async () => {
            try {
                await connection.beginTransaction();

                await connection.query(
                    'UPDATE Question SET type = ?, question = ?, point = ?, timeLimit = ? WHERE id = ?',
                    [questionData.type, questionData.question, questionData.points, questionData.timeLimit, id]
                );

                if (questionData.options) {
                    // Delete existing options
                    await connection.query('DELETE FROM Options WHERE question_id = ?', [id]);

                    // Add new options
                    if (questionData.options.length > 0) {
                        const optionsValues = questionData.options.map(option =>
                            [option.text, option.isCorrect, id]
                        );

                        await connection.query(
                            'INSERT INTO Options (text, isCorrect, question_id) VALUES ?',
                            [optionsValues]
                        );
                    }
                }

                await connection.commit();

                // Get canvas_id to update lastModified
                const [questionRows] = await db.query('SELECT canva_id FROM Question WHERE id = ?', [id]);
                if (questionRows.length > 0) {
                    await db.query(
                        'UPDATE Canva SET lastModified = ? WHERE id = ?',
                        [new Date(), questionRows[0].canva_id]
                    );
                }

                return true;
            } catch (error) {
                await connection.rollback();
                console.error('Error updating question:', error);
                throw error;
            } finally {
                connection.release();
            }
        })
    }

    async deleteQuestion(id) {
        try {
            // Get canvas_id before deletion to update lastModified
            const [questionRows] = await db.query('SELECT canva_id FROM Question WHERE id = ?', [id]);

            await db.query('DELETE FROM Question WHERE id = ?', [id]);

            if (questionRows.length > 0) {
                await db.query(
                    'UPDATE Canva SET lastModified = ? WHERE id = ?',
                    [new Date(), questionRows[0].canva_id]
                );
            }

            return true;
        } catch (error) {
            console.error('Error deleting question:', error);
            throw error;
        }
    }
}

module.exports = new QuestionModel();
