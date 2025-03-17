// src/controller/CanvaController.js
import * as CanvaModule from '../model/canvaModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import auth from '../utils/auth.js';
import express from 'express'

class CanvaController {

    /**
     * 
     * @param {express.Response} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     */
    async getAllCanva(req, res, next) {

        try {
            let canvases = await CanvaModule.findAll();
            res.status(HTTP_STATUS.OK).json(canvases);
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
    async getCanvaById(req, res, next) {
        try {
            const { canva_id } = req.params;
            const canva = await CanvaModule.findById(canva_id);
            if (!canva) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Canva not found' });
            }
            res.status(HTTP_STATUS.OK).json(canva);
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
    async createCanva(req, res, next) {
        try {
            const { tieu_de } = req.body;
            const ngay_tao = new Date();
            const canva = await CanvaModule.createCanva({ tieu_de, ngay_tao , is_public: false});
            res.status(HTTP_STATUS.CREATED).json(canva);
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
    async updateCanva(req, res, next) {
        try {
            const { canva_id } = req.params;
            const { tieu_de, is_public} = req.body;
            const result = await CanvaModule.updateCanva(canva_id, { tieu_de, is_public});
            if (result.affectedRows === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Canva not found' });
            }
            res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Canva updated successfully' });
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
    async deleteCanva(req, res, next) {
        try {
            const { canva_id } = req.params;
            const result = await CanvaModule.deleteCanva(canva_id);
            if (result.affectedRows === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Canva not found' });
            }
            res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Canva deleted successfully' });
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
    async getAllSessionByCanvaId(req, res, next) {
        try {
            const { canva_id } = req.params;
            console.log(canva_id);
            const sessions = await CanvaModule.findAllSessionByCanvaId(canva_id);
            res.status(HTTP_STATUS.OK).json(sessions);
        } catch (err) {
            next(err);
        }
    }
}

export default new CanvaController();
