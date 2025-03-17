
import pool from '../config/database.js';

/**
 * 
 * @typedef {import('mysql2').ResultSetHeader} ResultSetHeader
 * 
 * @typedef {Object} CanvaType
 * @property {number} canva_id
 * @property {string} tieu_de - Tên của bảng câu hỏi, max length 100
 * @property {Date} ngay_tao - Ngày tạo bảng câu hỏi
 * @property {bool} is_public - Có phải bảng câu hỏi công khai không
 */

/**
 * 
 * @returns {Promise<CanvaType[]>} - Danh sách các bảng câu hỏi
 */
export const findAll = async () => {
  const [rows] = await pool.query('SELECT C.*, (SELECT COUNT(*) FROM `cau_hoi` CH WHERE CH.`canva_id` = C.`canva_id`) AS `so_cau_hoi`, (SELECT COUNT(*) FROM `session` S WHERE S.`canva_id` = C.`canva_id`) AS `so_session` FROM canva C; ');
  return rows;
};

/**
 * 
 * @param {number} canvaId - ID của bảng câu hỏi
 * @returns {Promise<CanvaType | null>} - Thông tin của bảng câu hỏi
 */
export const findById = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM canva WHERE canva_id = ?', [canvaId]);
  return rows[0] || null;
};

/**
 * 
 * @param {Partial<CanvaType>} newCanva 
 * @returns {Promise<ResultSetHeader>} - Bảng câu hỏi mới được tạo
 */
export const createCanva = async (newCanva) => {
  const [result] = await pool.query('INSERT INTO canva ('
    + Object.keys(newCanva).map(e => pool.escapeId(e)).join(', ') +
    ') VALUES ('
    + Object.values(newCanva).map(e => pool.escape(e)).join(', ') +
    ')');
  return result;
};

/**
 * 
 * @param {number} canvaId 
 * @param {Partial<Omit<CanvaType, 'canva_id'>>} newCanva 
 * @returns 
 */
export const updateCanva = async (canvaId, newCanva) => {
  // remove undefined properties
  Object.keys(newCanva).forEach(key => newCanva[key] === undefined && delete newCanva[key]);
  const [result] = await pool.query(
    'UPDATE canva SET '
    + Object.keys(newCanva).map(key => `${pool.escapeId(key)} = ?`).join(', ') +
    ' WHERE canva_id = ?',
    [...Object.values(newCanva), canvaId]
  );
  return result;
};

/**
 * 
 * @param {number} canvaId 
 * @returns {Promise<ResultSetHeader>} - Kết quả xóa bảng câu hỏi
 */
export const deleteCanva = async (canvaId) => {
  const [result] = await pool.query('DELETE FROM canva WHERE canva_id = ?', [canvaId]);
  return result;
};

/**
 * 
 * @param {number} canvaId 
 * @returns 
 */
export const findAllSessionByCanvaId = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE canva_id = ?', [canvaId]);
  return rows;
}