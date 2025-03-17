import * as CauHoiModel from '../model/CauHoiModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import express from 'express';

class CauHoiController {
  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async getAllCauHoi(req, res, next) {
    try {
      const cauHois = await CauHoiModel.findAll();
      
      res.status(HTTP_STATUS.OK).json(cauHois);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async getCauHoiById(req, res, next) {
    try {
      const { cau_hoi_id } = req.params;
      const cauHoi = await CauHoiModel.findById(cau_hoi_id);
      if (!cauHoi) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
      }
      res.status(HTTP_STATUS.OK).json(cauHoi);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async getCauHoiByCanvaId(req, res, next) {
    try {
      const { canva_id } = req.params;
      const cauHois = await CauHoiModel.findByCanvaId(canva_id);
      if (cauHois.length === 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'No questions found for this canva' });
      }
      res.status(HTTP_STATUS.OK).json(cauHois);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async createCauHoi(req, res, next) {
    try {
      const { canva_id, noi_dung, dinh_dang, thoi_gian } = req.body;
      const cauHoi = await CauHoiModel.createCauHoi({ canva_id, noi_dung, dinh_dang, thoi_gian });
      res.status(HTTP_STATUS.CREATED).json(cauHoi);
    } catch (err) {
      next(err);
    }
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async updateCauHoi(req, res, next) {
    try {
      const { cau_hoi_id } = req.params;
      const { canva_id, noi_dung, dinh_dang, thoi_gian } = req.body;
      const result = await CauHoiModel.updateCauHoi(cau_hoi_id, { canva_id, noi_dung, dinh_dang, thoi_gian });
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Question updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async deleteCauHoi(req, res, next) {
    try {
      const { cau_hoi_id } = req.params;
      const result = await CauHoiModel.deleteCauHoi(cau_hoi_id);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Question deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async updateLuaChon(req, res, next) {
    try {
      const { lua_chon_id } = req.params;
      const result = await CauHoiModel.updateLuaChon(lua_chon_id, req.body);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Question updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async addLuaChon(req, res, next) {
    try {
      const { noi_dung, dung } = req.body;
      const result = await CauHoiModel.addLuaChon({ cau_hoi_id, noi_dung, dung });
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }
  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async deleteLuaChon(req, res, next) {
    try {
      const { lua_chon_id } = req.params;
      const result = await CauHoiModel.deleteLuaChon(lua_chon_id);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Choice not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Choice deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getLuaChonByCauHoiId(req, res, next) {
    // TODO: 
  }

  async getLuaChonById(req, res, next) {
    // TODO:
  }
}
export default new CauHoiController();
