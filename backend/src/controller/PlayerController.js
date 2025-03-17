import * as PlayerModel from '../model/PlayerModel.js';
import express from 'express';
import HTTP_STATUS from '../constants/httpStatus.js';

class PlayerController {
  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async getAllPlayers(req, res, next) {
    try {
      const players = await PlayerModel.findAll();
      res.status(HTTP_STATUS.OK).json(players);
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
  async getPlayerById(req, res, next) {
    try {
      const { uuid } = req.params;
      const player = await PlayerModel.findById(uuid);
      if (!player) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Player not found' });
      }
      res.status(HTTP_STATUS.OK).json(player);
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
  async getPlayersBySessionId(req, res, next) {
    try {
      const { session_id } = req.params;
      const players = await PlayerModel.findBySessionId(session_id);
      if (players.length === 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'No players found for this session' });
      }
      res.status(HTTP_STATUS.OK).json(players);
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
  async createPlayer(req, res, next) {
    try {
      const {
        uuid,
        session_id,
        name,
        email,
        std,
        thoi_gian_vao,
      } = req.body;

      console.log(req.body)

      const player = await PlayerModel.createPlayer({
        uuid,
        session_id,
        name,
        email,
        std,
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
  }

  /**
   * 
   * @param {express.Response} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  async updatePlayer(req, res, next) {
    try {
      const { uuid } = req.params;
      const { session_id, name, email, std, point, thoi_gian_voa: thoi_gian_vao, bai_lam } =
        req.body;
      const result = await PlayerModel.updatePlayer(uuid, {
        session_id,
        name,
        email,
        std,
        point,
        thoi_gian_vao,
        bai_lam,
      });
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Player not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Player updated successfully' });
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
  async deletePlayer(req, res, next) {
    try {
      const { uuid } = req.params;
      const result = await PlayerModel.deletePlayer(uuid);
      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Player not found' });
      }
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Player deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default new PlayerController();
