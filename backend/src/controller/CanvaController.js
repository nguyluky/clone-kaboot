import CanvaModule from '../model/canvaModel.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import SessionModel from '../model/SessionModel.js';
import CauHoiModel from '../model/CauHoiModel.js';
import { DocumentNotFoundError } from '../utils/error.js';

/** @type {import('../utils/help.js').CanvaControllerInterface} */
const CanvaController = {
    getAll: async (req, res, next) => {

        try {
            let canvases = await CanvaModule.getAll();
            res.status(HTTP_STATUS.OK).json(canvases);
        } catch (err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
        try {
            const { canva_id } = req.params;
            const canva = await CanvaModule.findById(+canva_id);
            if (!canva) {
                throw new DocumentNotFoundError('Canva not found');
            }
            res.status(HTTP_STATUS.OK).json(canva);
        } catch (err) {
            next(err);
        }
    },
    createCanva: async (req, res, next) => {
        try {
            const { tieu_de } = req.body;
            const ngay_tao = new Date();
            const canva = await CanvaModule.create({ tieu_de, ngay_tao});
            res.status(HTTP_STATUS.CREATED).json(canva);
        } catch (err) {
            next(err);
        }
    },
    async updateCanva(req, res, next) {
        try {
            const { canva_id } = req.params;
            const { tieu_de } = req.body;
            const result = await CanvaModule.update(canva_id, { tieu_de });
            if (result.affectedRows === 0) {
                throw new DocumentNotFoundError('Canva not found');
            }
            res.status(HTTP_STATUS.NO_CONTENT).json(result);
        } catch (err) {
            next(err);
        }
    },
    async deleteCanva(req, res, next) {
        try {
            const { canva_id } = req.params;
            const result = await CanvaModule.delete(canva_id);
            if (result.affectedRows === 0) {
                throw new DocumentNotFoundError('Canva not found');
            }
            res.status(HTTP_STATUS.NO_CONTENT).json(result);
        } catch (err) {
            next(err);
        }
    },
    async getAllSessionByCanvaId(req, res, next) {
        try {
            const { canva_id } = req.params;
            const sessions = await SessionModel.getByCanvaId(canva_id);
            res.status(HTTP_STATUS.OK).json(sessions);
        } catch (err) {
            next(err);
        }
    },
    async getAllCauHoiByCanvaId(req, res, next) {
        try {
            const { canva_id } = req.params;
            const cauhois = await CauHoiModel.getByCanvaId(canva_id);
            res.status(HTTP_STATUS.OK).json(cauhois);
        } catch (err) {
            next(err);
        }
    }
}

export default CanvaController;
