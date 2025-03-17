// src/route/CauHoiRoute.js
import CauHoiController from '../controller/CauHoiController.js';
import express from 'express';
import auth from '../utils/auth.js';

const router = express.Router();

router.use(auth.middlewareAuth)

// router.get('/canva/:canva_id', CauHoiController.getCauHoiByCanvaId); // Thêm route theo canva_id

router.get('/', CauHoiController.getAllCauHoi);
router.get('/:cau_hoi_id', CauHoiController.getCauHoiById);
router.post('/', CauHoiController.createCauHoi);
router.put('/:cau_hoi_id', CauHoiController.updateCauHoi);
router.delete('/:cau_hoi_id', CauHoiController.deleteCauHoi);


// TODO:
router.get('/:cau_hoi_id/luachon', CauHoiController.getLuaChonByCauHoiId);
router.post('/:cau_hoi_id/luachon', CauHoiController.addLuaChon);
router.get('/:cau_hoi_id/luachon/:lua_chon_id', CauHoiController.getLuaChonById);
router.put('/:cau_hoi_id/luachon/:lua_chon_id', CauHoiController.updateLuaChon);
router.delete('/:cau_hoi_id/luachon/:lua_chon_id', CauHoiController.deleteLuaChon);

export default router;
