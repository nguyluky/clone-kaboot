// src/controller/CanvaController.js
import { findAll, findById, createCanva, updateCanva, deleteCanva , findAllSessionByCanvaId} from '../model/canvaModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class CanvaController {
  async getAllCanva(req, res) {
    try {
      const canvases = await findAll();
      res.status(HTTP_STATUS.OK).json(canvases);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async getCanvaById(req, res) {
    try {
      const { canva_id } = req.params;
      const canva = await findById(canva_id);
      if (!canva) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Canva not found' });
      }
      res.status(HTTP_STATUS.OK).json(canva);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async createCanva(req, res) {
    try {
      const { tieu_de} = req.body;
      const ngay_tao = new Date();
      const canva = await createCanva({ tieu_de, ngay_tao });
      res.status(HTTP_STATUS.CREATED).json(canva);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async updateCanva(req, res) {
    try {
      const { canva_id } = req.params;
      const { tieu_de, ngay_tao } = req.body;
      const result = await updateCanva(canva_id, { tieu_de, ngay_tao });
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Canva not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Canva updated successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async deleteCanva(req, res) {
    try {
      const { canva_id } = req.params;
      const result = await deleteCanva(canva_id);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Canva not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Canva deleted successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async getAllSessionByCanvaId(req, res) {
    try {
      const { canva_id } = req.params;
      console.log(canva_id);
      const sessions = await findAllSessionByCanvaId(canva_id);
      res.status(HTTP_STATUS.OK).json(sessions);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }
}

export default new CanvaController();
