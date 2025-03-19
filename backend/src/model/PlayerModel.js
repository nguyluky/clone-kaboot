import pool from '../config/database.js';
import { v4 as uuid } from 'uuid'
import BaseModel from './BaseModel.js';

/**
 * 
 * @typedef {import('mysql2').ResultSetHeader} ResultSetHeader
 * 
 * @typedef {Object} BaiLamType
 * @property {number} cau_hoi_id - ID của câu hỏi
 * @property {number} lua_chon_id - ID của lựa chọn
 * @property {number} thoi_gian_nop - Thời gian nộp bài .getTime()
 * @property {number} thoi_gian_con_lai - not used
 * 
 * @typedef {Object} PlayerType
 * @property {string} uuid - ID của player
 * @property {string} session_id - ID của session
 * @property {string} name - Tên của player
 * @property {string} email - Email của player
 * @property {string} sdt - Số điện thoại của player
 * @property {number} point - Điểm của player
 * @property {Date} thoi_gian_ket_thuc - Thời gian kết thúc
 * @property {Date} thoi_gian_vao - Thời gian vào
 * @property {BaiLamType[]} bai_lam - Bài làm của player
 */

/**
 * @extends {BaseModel<PlayerType, 'uuid'>}
 */
class PlayerModel extends BaseModel {
    constructor() {
        super('player', 'uuid');
    }

    getBySessionId(sessionId) {
        return this.findAll({ session_id: sessionId });
    }
}

export default new PlayerModel();