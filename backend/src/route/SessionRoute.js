// src/route/SessionRoute.js
import SessionController from '../controller/SessionController.js';
import express from 'express';
import auth from '../utils/auth.js';

const router = express.Router();

// router.get('/canva/:canva_id', auth.middlewareAuth, SessionController.getSessionsByCanvaId); // Thêm route theo canva_id
router.get('/code/:code_join', SessionController.getSessionByCodeJoin); // Thêm route theo code_join
router.get('/code/:code_join/cau_hoi', SessionController.getQuestion);
router.get('/code/:code_join/nop_bai', SessionController.nopBai);
router.get('/public', SessionController.getAllPublicSessions);

// admin
router.get('/', auth.middlewareAuth ,SessionController.getAllSessions);
router.get('/:session_id', auth.middlewareAuth, SessionController.getSessionById);
router.post('/', SessionController.createSession);
router.put('/:session_id', SessionController.updateSession);
router.get('/:session_id/leaderboard', SessionController.getLeaderBoard);
router.delete('/:session_id', SessionController.deleteSession);

export default router;
