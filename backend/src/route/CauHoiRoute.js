// src/route/CauHoiRoute.js
import CauHoiController from '../controller/CauHoiController.js';
import express from 'express';
import auth from '../utils/auth.js';
import { CAU_HOI_ROUTES } from '../constants/routes.js';

const router = express.Router();

router.use(auth.middlewareAuth)

// router.get('/canva/:canva_id', CauHoiController.getCauHoiByCanvaId); // Thêm route theo canva_id

router.get(CAU_HOI_ROUTES.BASE, CauHoiController.getAllCauHoi);
router.get(CAU_HOI_ROUTES.BY_ID, CauHoiController.getCauHoiById);
router.post(CAU_HOI_ROUTES.BASE, CauHoiController.createCauHoi);
router.put(CAU_HOI_ROUTES.BY_ID, CauHoiController.updateCauHoi);
router.delete(CAU_HOI_ROUTES.BY_ID, CauHoiController.deleteCauHoi);

export default router;
