// src/route/CanvaRoute.js
import CanvaController from '../controller/CanvaController.js';
import express from 'express';
import auth from '../utils/auth.js';
import { CANVA_ROUTES } from '../constants/routes.js';

const router = express.Router();

router.use(auth.middlewareAuth)

router.get(CANVA_ROUTES.BASE, CanvaController.getAll);
router.post(CANVA_ROUTES.BASE, CanvaController.createCanva);
router.put(CANVA_ROUTES.BY_ID, CanvaController.updateCanva);
router.delete(CANVA_ROUTES.BY_ID, CanvaController.deleteCanva);
router.get(CANVA_ROUTES.BY_ID, CanvaController.getById);
router.get(CANVA_ROUTES.SESSION, CanvaController.getAllSessionByCanvaId);
router.get(CANVA_ROUTES.SESSION, CanvaController.getAllCauHoiByCanvaId);

export default router;
