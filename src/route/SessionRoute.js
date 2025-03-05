// src/route/SessionRoute.js
import SessionController from '../controller/SessionController.js';
import express from 'express';

const router = express.Router();

router.get('/', SessionController.getAllSessions);
router.get('/:session_id', SessionController.getSessionById);
router.get('/canva/:canva_id', SessionController.getSessionsByCanvaId); // Thêm route theo canva_id
router.post('/', SessionController.createSession);
router.put('/:session_id', SessionController.updateSession);
router.delete('/:session_id', SessionController.deleteSession);

export default router;
