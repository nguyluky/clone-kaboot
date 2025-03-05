// src/route/CauHoiRoute.js
import CauHoiController from '../controller/CauHoiController.js';
import express from 'express';

const router = express.Router();

router.get('/', CauHoiController.getAllCauHoi);
router.get('/:cau_hoi_id', CauHoiController.getCauHoiById);
router.get('/canva/:canva_id', CauHoiController.getCauHoiByCanvaId); // Thêm route theo canva_id
router.post('/', CauHoiController.createCauHoi);
router.put('/:cau_hoi_id', CauHoiController.updateCauHoi);
router.delete('/:cau_hoi_id', CauHoiController.deleteCauHoi);

export default router;
