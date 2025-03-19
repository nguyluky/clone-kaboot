// src/route/SessionRoute.js
import SessionController from '../controller/SessionController.js';
import express from 'express';
import auth from '../utils/auth.js';
import { SESSION_ROUTES } from '../constants/routes.js';

const router = express.Router();

// router.get('/canva/:canva_id', auth.middlewareAuth, SessionController.getSessionsByCanvaId); // Thêm route theo canva_id
router.get(SESSION_ROUTES.BY_CODE_JOIN,   SessionController.getSessionByCodeJoin); // Thêm route theo code_join
router.get(SESSION_ROUTES.QUESTION,       SessionController.getQuestion);
router.post(SESSION_ROUTES.SUBMIT_ANSWER, SessionController.submitAnswers);
router.get(SESSION_ROUTES.PUBLIC,         SessionController.getAllPublicSessions);

// admin
router.get(SESSION_ROUTES.BASE, auth.middlewareAuth ,SessionController.getAllSessions);
router.get(SESSION_ROUTES.BY_ID, auth.middlewareAuth, SessionController.getSessionById);
router.put(SESSION_ROUTES.BY_ID, auth.middlewareAuth, SessionController.updateSession);
router.delete(SESSION_ROUTES.BY_ID,auth.middlewareAuth, SessionController.deleteSession);
router.post(SESSION_ROUTES.BASE, auth.middlewareAuth, SessionController.createSession);
router.get(SESSION_ROUTES.LEADERBOARD,auth.middlewareAuth, SessionController.getLeaderBoard);

export default router;
