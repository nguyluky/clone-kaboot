import PlayerModel from '../model/PlayerModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import { DocumentNotFoundError } from '../utils/error.js';

/** @type {import('../utils/help.js').PlayerControllerInterface} */
const PlayerController = {

  async getAllPlayers(req, res, next) {
    try {
      const players = await PlayerModel.getAll();
      res.status(HTTP_STATUS.OK).json(players);
    } catch (err) {
      next(err);
    }
  },


  async getPlayerById(req, res, next) {
    try {
      const { uuid } = req.params;
      const player = await PlayerModel.findById(uuid);
      if (!player) {
        throw new DocumentNotFoundError('Player not found');
      }
      res.status(HTTP_STATUS.OK).json(player);
    } catch (err) {
      next(err);
    }
  },

  async createPlayer(req, res, next) {
    try {
      const {
        uuid,
        session_id,
        name,
        email,
        sdt,
        thoi_gian_vao,
      } = req.body;

      console.log(req.body)

      const player = await PlayerModel.create({
        uuid,
        session_id,
        name,
        email,
        sdt,
        thoi_gian_ket_thuc: new Date(),
        thoi_gian_vao: new Date(thoi_gian_vao),
        point: 0 ,
        bai_lam: []
      });
      res.status(HTTP_STATUS.CREATED).json(player);
    } catch (err) {
      next(err);
      console.log(err)
    }
  },


  async updatePlayer(req, res, next) {
    try {
      const { uuid } = req.params;
      const { session_id, name, email, sdt, point, thoi_gian_vao, bai_lam } =
        req.body;
      const result = await PlayerModel.update(uuid, {
        session_id,
        name,
        email,
        sdt,
        point,
        thoi_gian_vao,
        bai_lam,
      });
      if (result.affectedRows === 0) {
        throw new DocumentNotFoundError('Player not found');
      }
      res.status(HTTP_STATUS.NO_CONTENT).json(result);
    } catch (err) {
      next(err);
    }
  },


  async deletePlayer(req, res, next) {
    try {
      const { uuid } = req.params;
      const result = await PlayerModel.delete(uuid);
      if (result.affectedRows === 0) {
        throw new DocumentNotFoundError('Player not found');
      }
      res.status(HTTP_STATUS.NO_CONTENT).json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default PlayerController;
