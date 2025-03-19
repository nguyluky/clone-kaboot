import pool from '../config/database.js';
import BaseModel from './BaseModel.js';

/**
 * @typedef {import('mysql2').ResultSetHeader} ResultSetHeader
 * 
 * @typedef {Object} SessionType
 * @property {number}  session_id - ID của session
 * @property {string}  title - Tên của session
 * @property {string}  code_join - Mã tham gia của session
 * @property {number}  canva_id - ID của canva
 * @property {Date}    thoi_gian_tao - Thời gian bắt đầu
 * @property {boolean} is_public - Trạng thái của session
 * 
 */

/**
 * @extends {BaseModel<SessionType, 'session_id'>}
 */
class SessionModel extends BaseModel {
    constructor() {
        super('session', 'session_id');
    }

    getByCanvaId(canvaId) {
        return this.findAll({ canva_id: canvaId });
    }

    async getByCodeJoin(codeJoin) {
        return await this.findOne({ code_join: codeJoin });
    }

    async getPublicSessions() {
        return await this.findAll({ is_public: 1 });
    }

}

export default new SessionModel();
