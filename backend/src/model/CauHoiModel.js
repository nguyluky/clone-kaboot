// src/model/CauHoiModel.js
import pool from '../config/database.js';

/**
 * 
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
 */

/**
 * 
 * @returns {Promise<CauHoiType[]>} - Danh sách các câu hỏi
 */
export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM cau_hoi');
  return rows;
};


/**
 * 
 * @param {number} cauHoiId 
 * @returns {Promise<CauHoiType | null>} - Thông tin của câu hỏi
 */
export const findById = async (cauHoiId) => {
  const [rows] = await pool.query('SELECT * FROM cau_hoi WHERE cau_hoi_id = ?', [cauHoiId]);
  return rows[0] || null;
};

/**
 * 
 * @param {number} canvaId 
 * @returns {Promise<CauHoiType[]>} - Danh sách các câu hỏi trong bảng câu hỏi
 */
export const findByCanvaId = async (canvaId) => {
  const [rows] = await pool.query("SELECT * FROM cau_hoi WHERE canva_id = ?;", [canvaId]); 
  return rows;
};

/**
 * 
 * @param {Omit<CauHoiType, 'cau_hoi_id'>} newCauHoi 
 * @returns {Promise<ResultSetHeader>} - Kết quả của câu truy vấn
 */
export const createCauHoi = async (newCauHoi) => {
  const [result] = await pool.query(
    'INSERT INTO cau_hoi '
    + Object.keys(newCauHoi).map(() => `${pool.escapeId(Object.keys(newCauHoi))}`).join(', ') +
    ' VALUES (?, ?, ?, ?)',
    [...Object.values(newCauHoi)]
  );
  return result;
};

/**
 * 
 * @param {number} cauHoiId 
 * @param {Partial<CauHoiType>} data 
 * @returns {Promise<ResultSetHeader>} - Kết quả của câu truy vấn
 */
export const updateCauHoi = async (cauHoiId, data) => {
  const { canva_id, noi_dung, dinh_dang, thoi_gian } = data;
  const [result] = await pool.query(
    'UPDATE cau_hoi SET '
    + Object.keys(data).map(key => `${pool.escapeId(key)} = ?`).join(', ') +
    ' WHERE cau_hoi_id = ?',
    [...Object.values(), cauHoiId]
  );
  return result;
};

/**
 * 
 * @param {number} cauHoiId 
 * @returns {Promise<ResultSetHeader>} - Kết quả của câu truy vấn
 */
export const deleteCauHoi = async (cauHoiId) => {
  const [result] = await pool.query('DELETE FROM cau_hoi WHERE cau_hoi_id = ?', [cauHoiId]);
  return result;
};

/**
 * 
 * @param {number} lua_chon_id 
 * @param {Partial<LuaChonType>} lua_chon 
 * @returns {Promise<ResultSetHeader>} - Kết quả của câu truy vấn
 */
export const updateLuaChon = async (lua_chon_id, lua_chon) => {
  const { noi_dung, dung } = lua_chon;
  const [result] = await pool.query(
    'UPDATE `lua_chon` SET noi_dung = ?, dung = ? WHERE lua_chon_id = ?',
    [noi_dung, dung, lua_chon_id]
  );
  return result;
}

/**
 * 
 * @param {LuaChonType} lua_chon 
 * @returns {Promise<ResultSetHeader>} - Kết quả của câu truy vấn
 */
export const addLuaChon = async (lua_chon) => {
  const { cau_hoi_id, noi_dung, dung } = lua_chon;
  const [result] = await pool.query(
    'INSERT INTO `lua_chon` (cau_hoi_id, noi_dung, dung) VALUES (?, ?, ?)',
    [cau_hoi_id, noi_dung, dung]
  );
  return result;
}

/**
 * 
 * @param {number} lua_chon_id 
 * @returns {Promise<ResultSetHeader>} - Kết quả của câu truy vấn
 */
export const deleteLuaChon = async (lua_chon_id) => {
  const [result] = await pool.query('DELETE FROM `lua_chon` WHERE lua_chon_id = ?', [lua_chon_id]);
  return result;
}

/**
 * 
 * @param {number} lua_chon_id 
 * @returns {Promise<LuaChonType | null>} - Thông tin của lựa chọn
 */
export const findLuaChonById = async (lua_chon_id) => {
  const [rows] = await pool.query('SELECT * FROM lua_chon WHERE lua_chon_id = ?', [lua_chon_id]);
  return rows[0] || null;
}

/**
 * 
 * @returns {Promise<LuaChonType[]>} - Danh sách các lựa chọn
 */
export const getAllLuaChon = async () => {
  const [rows] = await pool.query('SELECT * FROM lua_chon');
  return rows;
}