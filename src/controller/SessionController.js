
import {
  findAll,
  findById,
  findByCanvaId,
  createSession,
  updateSession,
  deleteSession,
} from '../model/SessionModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class SessionController {
  async getAllSessions(req, res) {
    try {
      const sessions = await findAll();
      res.status(HTTP_STATUS.OK).json(sessions);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching sessions' });
    }
  }

  async getSessionById(req, res) {
    try {
      const { session_id } = req.params;
      const session = await findById(session_id);
      if (!session) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
      }
      res.status(HTTP_STATUS.OK).json(session);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching session' });
    }
  }

  async getSessionsByCanvaId(req, res) {
    try {
      const { canva_id } = req.params;
      const sessions = await findByCanvaId(canva_id);
      if (sessions.length === 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'No sessions found for this canva' });
      }
      res.status(HTTP_STATUS.OK).json(sessions);
    } catch (err) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error fetching sessions by canva' });
    }
  }

  async createSession(req, res) {
    try {
      const { title, code_join, canva_id, thoi_gian_bat_dau, trang_thai } = req.body;
      const session = await createSession({
        title,
        code_join,
        canva_id,
        thoi_gian_bat_dau,
        trang_thai,
      });
      res.status(HTTP_STATUS.CREATED).json(session);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error creating session' });
    }
  }

  async updateSession(req, res) {
    try {
      const { session_id } = req.params;
      const { title, code_join, canva_id, thoi_gian_bat_dau, trang_thai } = req.body;
      const result = await updateSession(session_id, {
        title,
        code_join,
        canva_id,
        thoi_gian_bat_dau,
        trang_thai,
      });
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Session updated successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async deleteSession(req, res) {
    try {
      const { session_id } = req.params;
      const result = await deleteSession(session_id);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Session not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Session deleted successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting session' });
    }
  }
}

export default new SessionController();
