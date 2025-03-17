// src/route/CanvaRoute.js
import CanvaController from '../controller/CanvaController.js';
import express from 'express';
import auth from '../utils/auth.js';

const router = express.Router();

router.use(auth.middlewareAuth)

router.get('/', CanvaController.getAllCanva);
router.post('/', CanvaController.createCanva);
router.get('/:canva_id', CanvaController.getCanvaById);
router.get('/:canva_id/session', CanvaController.getAllSessionByCanvaId);
router.put('/:canva_id', CanvaController.updateCanva);
router.delete('/:canva_id', CanvaController.deleteCanva);

export default router;
