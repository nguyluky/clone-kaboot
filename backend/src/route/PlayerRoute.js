// src/route/PlayerRoute.js
import PlayerController from '../controller/PlayerController.js';
import express from 'express';
import auth from '../utils/auth.js';

const router = express.Router();

router.use(auth.middlewareAuth)

router.get('/', PlayerController.getAllPlayers);
router.get('/:uuid', PlayerController.getPlayerById);
// TODO: 17-3-25: chuyển endpoint này sang sesionRoute
// router.get('/session/:session_id', PlayerController.getPlayersBySessionId); // Thêm route theo session_id
router.post('/', PlayerController.createPlayer);
router.put('/:uuid', PlayerController.updatePlayer);
router.delete('/:uuid', PlayerController.deletePlayer);

export default router;
