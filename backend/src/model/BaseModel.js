
import pool from '../config/database.js';

/** @typedef {import('mysql2').QueryResult} QueryResult */
/** @typedef {import('mysql2').ResultSetHeader} ResultSetHeader */

/**
 * @template {{}} T
 * @template {keyof T} PK
 */
export default class BaseModel {

    /** 
     * @param {string} tableName
     * @param {PK} PK
     */
    constructor(tableName, PK) {
        this.tableName = tableName;
        this.PK = PK;
    }

    /**
     * 
     * @param {string} sql 
     * @param {any} [values]
     * @returns {Promise<[QueryResult, import('mysql2').FieldPacket[]]>}
     */
    async __query(sql, values) {
        return await pool.query(sql, values);
    }

    /**
     * 
     * @param {import('../utils/help.js').PartialBy<T, PK>} data 
     * @returns {Promise<ResultSetHeader>}
     */
    async create(data) {
        const [result] = await this.__query(`INSERT INTO ${this.tableName} SET ?`, data);
        return /** @type {ResultSetHeader} */ (result);
    }

    /**
     * 
     * @returns {Promise<T[]>}
     */
    async getAll() {
        const [rows] = await this.__query(`SELECT * FROM ${this.tableName}`);
        return /** @type {T[]} */ (rows);
    }

    /**
     * 
     * @param {*} id 
     * @returns {Promise<T | null>}
     */
    async findById(id) {
        const [rows] = await this.__query(`SELECT * FROM ${this.tableName} WHERE ${this.PK} = ?`, [id]);
        return rows[0] || null;
    }

    /**
     * 
     * @param {Object} where 
     * @returns {Promise<T[]>}
     */
    async findAll(where) {
        const [rows] = await this.__query(
            `SELECT * FROM ${this.tableName} WHERE `
            + Object.keys(where).map(e => `${pool.escapeId(e)} = ?`).join(' AND '),
            [...Object.values(where)]
        );
        return /** @type {T[]} */ (rows);
    }

    /**
     * 
     * @param {Object} where 
     * @returns {Promise<T | null>}
     */
    async findOne(where) {
        const [rows] = await this.__query(
            `SELECT * FROM ${this.tableName} WHERE `
            + Object.keys(where).map(e => `${pool.escapeId(e)} = ?`).join(' AND '),
            [...Object.values(where)]
        );
        return rows[0] || null;
    }

    /**
     * 
     * @param {*} id 
     * @param {Partial<T>} data
     * @returns {Promise<import('mysql2').ResultSetHeader>}
     */
    async update(id, data) {
        const [result] = await this.__query(
            `UPDATE ${this.tableName} SET `
            + Object.keys(data).map(e => `${pool.escapeId(e)} = ?`).join(', ') +
            ` WHERE ${this.PK} = ?`,
            [...Object.values(data), id]
        );
        return /** @type {import('mysql2').ResultSetHeader} */ (result);
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    async delete(id) {
        const [result] = await this.__query(`
            DELETE FROM ${this.tableName} WHERE ${this.PK} = ?
        `, [id]);
        return /** @type {import('mysql2').ResultSetHeader} */ (result);
    }

    
}
