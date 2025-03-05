
import {
  findAll,
  findById,
  findByCanvaId,
  createCauHoi,
  updateCauHoi,
  deleteCauHoi,
} from '../model/CauHoiModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class CauHoiController {
  async getAllCauHoi(req, res) {
    try {
      const cauHois = await findAll();
      res.status(HTTP_STATUS.OK).json(cauHois);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching questions' });
    }
  }

  async getCauHoiById(req, res) {
    try {
      const { cau_hoi_id } = req.params;
      const cauHoi = await findById(cau_hoi_id);
      if (!cauHoi) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
      }
      res.status(HTTP_STATUS.OK).json(cauHoi);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching question' });
    }
  }

  async getCauHoiByCanvaId(req, res) {
    try {
      const { canva_id } = req.params;
      const cauHois = await findByCanvaId(canva_id);
      if (cauHois.length === 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'No questions found for this canva' });
      }
      res.status(HTTP_STATUS.OK).json(cauHois);
    } catch (err) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error fetching questions by canva' });
    }
  }

  async createCauHoi(req, res) {
    try {
      const { canva_id, noi_dung, dinh_dang, thoi_gian } = req.body;
      const cauHoi = await createCauHoi({ canva_id, noi_dung, dinh_dang, thoi_gian });
      res.status(HTTP_STATUS.CREATED).json(cauHoi);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error creating question' });
    }
  }

  async updateCauHoi(req, res) {
    try {
      const { cau_hoi_id } = req.params;
      const { canva_id, noi_dung, dinh_dang, thoi_gian } = req.body;
      const result = await updateCauHoi(cau_hoi_id, { canva_id, noi_dung, dinh_dang, thoi_gian });
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Question updated successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async deleteCauHoi(req, res) {
    try {
      const { cau_hoi_id } = req.params;
      const result = await deleteCauHoi(cau_hoi_id);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Question not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Question deleted successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting question' });
    }
  }
}

export default new CauHoiController();
