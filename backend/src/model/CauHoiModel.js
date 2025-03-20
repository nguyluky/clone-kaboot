// src/model/CauHoiModel.js
import pool from '../config/database.js';
import BaseModel from './BaseModel.js';

/** @extends {BaseModel<CauHoiType, 'cau_hoi_id'>} */
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