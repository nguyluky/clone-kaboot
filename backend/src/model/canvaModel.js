
import pool from '../config/database.js';
import BaseModel from './BaseModel.js';

/** 
 * @typedef {Object} CanvaType
 * @property {number} canva_id
 * @property {string} tieu_de - Tên của bảng câu hỏi, max length 100
 * @property {Date} ngay_tao - Ngày tạo bảng câu hỏi
 * @property {boolean} is_public - Có phải bảng câu hỏi công khai không, công khai thì được hiện ở trang chủ
*/

/**
 * @extends BaseModel<CanvaType, 'canva_id'>
 */
class CanvaModel extends BaseModel {
    constructor() {
        super('canva', 'canva_id');
    }
}

export default new CanvaModel();