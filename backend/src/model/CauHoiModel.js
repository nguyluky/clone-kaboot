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
SELECT \n\
    `cau_hoi`.*,  \n\
    (\n\
        SELECT JSON_ARRAYAGG(\n\
            JSON_OBJECT(\n\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\n\
                'noi_dung', `lua_chon`.`noi_dung`,\n\
                'dung', `lua_chon`.`dung`\n\
            )\n\
        )\n\
        FROM `lua_chon` \n\
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\n\
    ) as lua_chon \n\
FROM `cau_hoi` \n\
WHERE `cau_hoi`.`canva_id` = ?;", [canvaId]);

        return /** @type {CauHoiWithLuaChonType[]} */(result);
    }

    async getWithLuaChonByCanvaId(canvaId) {
        const [result] = await this.__query("\
SELECT \n\
    `cau_hoi`.*,  \n\
    (\n\
        SELECT JSON_ARRAYAGG(\n\
            JSON_OBJECT(\n\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\n\
                'noi_dung', `lua_chon`.`noi_dung`,\n\
                'dung', `lua_chon`.`dung`\n\
            )\n\
        )\n\
        FROM `lua_chon` \n\
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\n\
    ) as lua_chon \n\
FROM `cau_hoi` \n\
WHERE `cau_hoi`.`canva_id` = ?;", [canvaId]);

        return /** @type {CauHoiWithLuaChonType[]} */(result);
    }

    
    /**
     * 
     * @param {*} cauHoiId
     */
    async getWithLuaChon(cauHoiId) {
        const [result] = await this.__query("\
SELECT \n\
    `cau_hoi`.*,  \n\
    (\n\
        SELECT JSON_ARRAYAGG(\n\
            JSON_OBJECT(\n\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\n\
                'noi_dung', `lua_chon`.`noi_dung`,\n\
                'dung', `lua_chon`.`dung`\n\
            )\n\
        )\n\
        FROM `lua_chon` \n\
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\n\
    ) as lua_chon \n\
FROM `cau_hoi` \n\
WHERE `cau_hoi`.`cau_hoi_id` = ?;", [cauHoiId]);

        return /** @type {CauHoiWithLuaChonType} */(result[0]);
    }

    async getAllWithLuaChon() {
        const [result] = await this.__query("\
SELECT \n\
    `cau_hoi`.*,  \n\
    (\n\
        SELECT JSON_ARRAYAGG(\n\
            JSON_OBJECT(\n\
                'lua_chon_id', `lua_chon`.`lua_chon_id`,\n\
                'noi_dung', `lua_chon`.`noi_dung`,\n\
                'dung', `lua_chon`.`dung`\n\
            )\n\
        )\n\
        FROM `lua_chon` \n\
        WHERE `lua_chon`.`cau_hoi_id` = `cau_hoi`.`cau_hoi_id`\n\
    ) as lua_chon \n\
FROM `cau_hoi`;");

        return /** @type {CauHoiWithLuaChonType[]} */(result[0]);

    }
    /**
     * 
     * @param {*} cauHoiId 
     * @param {Partial<CauHoiWithLuaChonType>} data 
     * @returns {Promise<ResultSetHeader>}
     */
    async updateCauHoiWithLuaChon(cauHoiId, data) {
        const transaction = await pool.getConnection();
        await transaction.beginTransaction();

        try {
            const { lua_chon, ...cauHoiData } = data;

            const result = await this.__query('UPDATE ?? SET ? WHERE ?? = ?', [this.tableName, cauHoiData, this.PK, cauHoiId]);

            await this.__query('DELETE FROM lua_chon WHERE lua_chon_id IN (' + (lua_chon || []).filter(lc => lc.lua_chon_id).map(lc => lc.lua_chon_id).join(',') + ')');

            const updateLuaChons = (lua_chon || []).map(async (lc) => {
                if (lc.lua_chon_id) {
                    return (await this.__query('UPDATE lua_chon SET ? WHERE lua_chon_id = ?', [lc, lc.lua_chon_id]))[0];
                } else {
                    return (await this.__query('INSERT INTO lua_chon SET ?', lc))[0];
                }
            });

            Promise.all(updateLuaChons);
            await transaction.commit();
            return /** @type {ResultSetHeader} */ (result[0]);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * 
     * @param {*} cauHoiId 
     * @param {import('../utils/help.js').PartialBy<Omit<LuaChonType, 'cau_hoi_id'>, 'lua_chon_id'>} luaChon 
     * @returns 
     */
    async createLuaChon(cauHoiId, luaChon) {
        const [result] = await this.__query('INSERT INTO lua_chon SET ?', { ...luaChon, cau_hoi_id: cauHoiId });
        return /** @type {ResultSetHeader} */ (result);
    }

    /**
     * 
     * @param {*} luaChonId 
     * @returns {Promise<ResultSetHeader>}
     */
    async deleteLuaChon(luaChonId) {
        const [result] = await this.__query('DELETE FROM lua_chon WHERE lua_chon_id = ?', [luaChonId]);
        return /** @type {ResultSetHeader} */ (result);
    }
}

export default new CauHoiModel();