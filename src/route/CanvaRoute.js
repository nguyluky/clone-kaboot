// src/route/CanvaRoute.js
import CanvaController from '../controller/CanvaController.js';
import express from 'express';

const router = express.Router();

router.get('/', CanvaController.getAllCanva);
router.get('/:canva_id', CanvaController.getCanvaById);
router.post('/', CanvaController.createCanva);
router.put('/:canva_id', CanvaController.updateCanva);
router.delete('/:canva_id', CanvaController.deleteCanva);

export default router;
