// src/route/PlayerRoute.js
import PlayerController from '../controller/PlayerController.js';
import express from 'express';
import auth from '../utils/auth.js';
import { PLAYER_ROUTES } from '../constants/routes.js';

const router = express.Router();

router.use(auth.middlewareAuth)

router.get(PLAYER_ROUTES.BASE, PlayerController.getAllPlayers);
router.get(PLAYER_ROUTES.BY_ID, PlayerController.getPlayerById);
router.post(PLAYER_ROUTES.BASE, PlayerController.createPlayer);
router.put(PLAYER_ROUTES.BY_ID, PlayerController.updatePlayer);
router.delete(PLAYER_ROUTES.BY_ID, PlayerController.deletePlayer);

export default router;
