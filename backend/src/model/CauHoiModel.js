// src/model/CauHoiModel.js
/*
 * 17/03/25 [nguyluky] Note:
 * đừng quan tậm về cái này
 * chỉ là để vscode hiểu kiểu dữ liệu thôi
 * tôi không có nhớ nên phải khai bá cho đỡ sai
 */

import pool from '../config/database.js';
import BaseModel from './BaseModel.js';


/**
 * @typedef {import('mysql2').ResultSetHeader} ResultSetHeader
 * 
 * @typedef {Object} LuaChonType
 * @property {number} lua_chon_id - ID của lựa chọn
 * @property {number} cau_hoi_id - ID của câu hỏi
 * @property {string} noi_dung - Nội dung lựa chọn
 * @property {boolean} dung
 * 
 * @typedef {'htmldecode' | 'markdown'} CauHoi_DinhDangType
 * 
 * @typedef {Object} CauHoiType
 * @property {number} cau_hoi_id - ID của câu hỏi
 * @property {number} canva_id - ID của bảng câu hỏi
 * @property {string} noi_dung - Nội dung câu hỏi
 * @property {CauHoi_DinhDangType} dinh_dang - Định dạng câu hỏi
 * @property {number} thoi_gian - Thời gian trả lời câu hỏi, NOTE: khong dung
 * 
 * @typedef {CauHoiType & {lua_chon: LuaChonType[]}} CauHoiWithLuaChonType
 */

//===========================================================

/**
 * @extends {BaseModel<CauHoiType, 'cau_hoi_id'>}
 */
class CauHoiModel extends BaseModel {
    constructor() {
        super('cau_hoi', 'cau_hoi_id');
    }

    /**
     * 
     * @param {*} canvaId 
     * @returns {Promise<CauHoiWithLuaChonType[]>}
     */
    async getByCanvaId(canvaId) {
        const [result] = await this.__query("\
SELECT \
    `cau_hoi`.*,  \
    (\
        SELECT JSON_ARRAYAGG(\
            JSON_OBJECT(\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\
                'noi_dung', `lua_chon`.`noi_dung`,\
                'dung', `lua_chon`.`dung`\
            )\
        )\
        FROM `lua_chon` \
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\
    ) as lua_chon\
FROM `cau_hoi` \
WHERE `cau_hoi`.`canva_id` = ?;", [canvaId]);

        return /** @type {CauHoiWithLuaChonType[]} */(result);
    }

    async getWithLuaChonByCanvaId(canvaId) {
        const [result] = await this.__query("\
SELECT \
    `cau_hoi`.*,  \
    (\
        SELECT JSON_ARRAYAGG(\
            JSON_OBJECT(\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\
                'noi_dung', `lua_chon`.`noi_dung`,\
                'dung', `lua_chon`.`dung`\
            )\
        )\
        FROM `lua_chon` \
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\
    ) as lua_chon\
FROM `cau_hoi` \
WHERE `cau_hoi`.`canva_id` = ?;", [canvaId]);

        return /** @type {CauHoiWithLuaChonType[]} */(result);
    }

    
    /**
     * 
     * @param {*} cauHoiId
     */
    async getWithLuaChon(cauHoiId) {
        const [result] = await this.__query("\
SELECT \
    `cau_hoi`.*,  \
    (\
        SELECT JSON_ARRAYAGG(\
            JSON_OBJECT(\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\
                'noi_dung', `lua_chon`.`noi_dung`,\
                'dung', `lua_chon`.`dung`\
            )\
        )\
        FROM `lua_chon` \
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\
    ) as lua_chon\
FROM `cau_hoi` \
WHERE `cau_hoi`.`cau_hoi_id` = ?;", [cauHoiId]);

        return /** @type {CauHoiWithLuaChonType} */(result[0]);
    }

    async getAllWithLuaChon() {
        const [result] = await this.__query("\
SELECT \
    `cau_hoi`.*,  \
    (\
        SELECT JSON_ARRAYAGG(\
            JSON_OBJECT(\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\
                'noi_dung', `lua_chon`.`noi_dung`,\
                'dung', `lua_chon`.`dung`\
            )\
        )\
        FROM `lua_chon` \
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\
    ) as lua_chon\
FROM `cau_hoi`;");

        return /** @type {CauHoiWithLuaChonType[]} */(result[0]);

    }
    /**
     * 
     * @param {*} cauHoiId 
     * @param {CauHoiWithLuaChonType} data 
     */
    async updateCauHoiWithLuaChon(cauHoiId, data) {
        const transaction = await pool.getConnection();
        await transaction.beginTransaction();

        try {
            const { lua_chon, ...cauHoiData } = data;

            await this.__query('UPDATE ?? SET ? WHERE ?? = ?', [this.tableName, cauHoiData, this.PK, cauHoiId]);
            const updateLuaChons = lua_chon.map(async (lc) => {
                if (lc.lua_chon_id) {
                    await this.__query('UPDATE lua_chon SET ? WHERE lua_chon_id = ?', [lc, lc.lua_chon_id]);
                } else {
                    await this.__query('INSERT INTO lua_chon SET ?', lc);
                }
            });

            await Promise.all(updateLuaChons);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export default new CauHoiModel();