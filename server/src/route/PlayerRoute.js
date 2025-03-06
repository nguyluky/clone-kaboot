// src/route/PlayerRoute.js
import PlayerController from '../controller/PlayerController.js';
import express from 'express';

const router = express.Router();

router.get('/', PlayerController.getAllPlayers);
router.get('/:uuid', PlayerController.getPlayerById);
router.get('/session/:session_id', PlayerController.getPlayersBySessionId); // Thêm route theo session_id
router.post('/', PlayerController.createPlayer);
router.put('/:uuid', PlayerController.updatePlayer);
router.delete('/:uuid', PlayerController.deletePlayer);

export default router;
