// src/route/SessionRoute.js
import SessionController from '../controller/SessionController.js';
import express from 'express';

const router = express.Router();

router.get('/', SessionController.getAllSessions);
router.get('/:session_id', SessionController.getSessionById);
router.get('/canva/:canva_id', SessionController.getSessionsByCanvaId); // Thêm route theo canva_id
router.get('/code/:code_join', SessionController.getSessionByCodeJoin); // Thêm route theo code_join
router.post('/', SessionController.createSession);
router.put('/:session_id', SessionController.updateSession);
router.delete('/:session_id', SessionController.deleteSession);
router.get('/:session_id/leaderboard', SessionController.getLeaderBoard);
// TODO: làm tiếp phần này 
router.get('/:session_id/cau_hoi', SessionController.getQuestion); // lấy câu hỏi ngẫu nhiên
router.post('/:session_id/tra_loi', SessionController.answerQuestion); // trả lời câu hỏi


export default router;
