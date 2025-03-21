/**
 * @typedef {import('../utils/help.js').CauHoiControllerInterface} CauHoiControllerInterface
 */

import CauHoiModel from '../model/CauHoiModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import express from 'express';
import { DocumentNotFoundError } from '../utils/error.js';

/**
 * @type {CauHoiControllerInterface}
 */
const CauHoiController = {
    getAllCauHoi: async (req, res, next) => {
        try {
            const cauHois = await CauHoiModel.getAllWithLuaChon();
            res.status(HTTP_STATUS.OK).json(cauHois);
        } catch (err) {
            next(err);
        }
    },
    getCauHoiById: async (req, res, next) => {
        try {
            const { cau_hoi_id } = req.params;
            const cauHoi = await CauHoiModel.getWithLuaChon(cau_hoi_id);
            if (!cauHoi) {
                throw new DocumentNotFoundError('Question not found');
            }
            res.status(HTTP_STATUS.OK).json(cauHoi);
        } catch (err) {
            next(err);
        }
    },
    // getCauHoiByCanvaId: async (req, res, next) => {
    //   try {
    //     const { canva_id } = req.params;
    //     const cauHois = await CauHoiModel.getByCanvaId(canva_id);
    //     if (cauHois.length === 0) {
    //       return res
    //         .status(HTTP_STATUS.NOT_FOUND)
    //         .json({ message: 'No questions found for this canva' });
    //     }
    //     res.status(HTTP_STATUS.OK).json(cauHois);
    //   } catch (err) {
    //     next(err);
    //   }
    // },
    createCauHoi: async (req, res, next) => {
        try {
            const { canva_id, noi_dung, dinh_dang, thoi_gian } = req.body;
            const cauHoi = await CauHoiModel.create({ canva_id, noi_dung, dinh_dang, thoi_gian });
            res.status(HTTP_STATUS.CREATED).json(cauHoi);
        } catch (err) {
            next(err);
        }
    },
    updateCauHoi: async (req, res, next) => {
        try {
            const { cau_hoi_id } = req.params;
            const { canva_id, noi_dung, dinh_dang, thoi_gian, lua_chon} = req.body;
            const result = await CauHoiModel.updateCauHoiWithLuaChon(cau_hoi_id, {lua_chon, canva_id, noi_dung, dinh_dang, thoi_gian });
            res.status(HTTP_STATUS.NO_CONTENT).json(result);
        } catch (err) {
            next(err);
        }
    },
    deleteCauHoi: async (req, res, next) => {
        try {
            const { cau_hoi_id } = req.params;
            const result = await CauHoiModel.delete(cau_hoi_id);
            if (result.affectedRows === 0) {
                throw new DocumentNotFoundError('Question not found');
            }
            res.status(HTTP_STATUS.NO_CONTENT).json(result);
        } catch (err) {
            next(err);
        }
    },
    createLuaChon: async (req, res, next) => {
        try {
            const { cau_hoi_id } = req.params;
            const { noi_dung, dung } = req.body;
            const luaChon = await CauHoiModel.createLuaChon(cau_hoi_id, { noi_dung, dung });
            res.status(HTTP_STATUS.CREATED).json(luaChon);
        } catch (err) {
            next(err);
        }
    },
    deleteLuaChon: async (req, res, next) => {
        try {
            const { lua_chon_id } = req.params;
            const result = await CauHoiModel.deleteLuaChon(lua_chon_id);
            if (result.affectedRows === 0) {
                throw new DocumentNotFoundError('Choice not found');
            }
            res.status(HTTP_STATUS.NO_CONTENT).json(result);
        }
        catch (err) {
            next(err);
        }
    }
};
export default CauHoiController;
