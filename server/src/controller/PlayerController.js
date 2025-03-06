
import {
  findAll,
  findById,
  findBySessionId,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from '../model/PlayerModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class PlayerController {
  async getAllPlayers(req, res) {
    try {
      const players = await findAll();
      res.status(HTTP_STATUS.OK).json(players);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching players' });
    }
  }

  async getPlayerById(req, res) {
    try {
      const { uuid } = req.params;
      const player = await findById(uuid);
      if (!player) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Player not found' });
      }
      res.status(HTTP_STATUS.OK).json(player);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching player' });
    }
  }

  async getPlayersBySessionId(req, res) {
    try {
      const { session_id } = req.params;
      const players = await findBySessionId(session_id);
      if (players.length === 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'No players found for this session' });
      }
      res.status(HTTP_STATUS.OK).json(players);
    } catch (err) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error fetching players by session' });
    }
  }

  async createPlayer(req, res) {
    try {
      const {
        uuid,
        session_id,
        name,
        email,
        std,
      } = req.body;
      const player = await createPlayer({
        uuid,
        session_id,
        name,
        email,
        std,
        point: 0,
        thoi_gian_lam_bai: null,
        thoi_gian_voa: new Date(),
        bai_lam: [],
      });
      res.status(HTTP_STATUS.CREATED).json(player);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async updatePlayer(req, res) {
    try {
      const { uuid } = req.params;
      const { session_id, name, email, std, point, thoi_gian_lam_bai, thoi_gian_voa, bai_lam } =
        req.body;
      const result = await updatePlayer(uuid, {
        session_id,
        name,
        email,
        std,
        point,
        thoi_gian_lam_bai,
        thoi_gian_voa,
        bai_lam,
      });
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Player not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Player updated successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async deletePlayer(req, res) {
    try {
      const { uuid } = req.params;
      const result = await deletePlayer(uuid);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Player not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Player deleted successfully' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting player' });
    }
  }
}

export default new PlayerController();
