import pool from '../config/database.js';
import { v4 as uuid } from 'uuid'

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
 * @property {string} std - Số điện thoại của player
 * @property {number} point - Điểm của player
 * @property {Date} thoi_gian_ket_thuc - Thời gian kết thúc
 * @property {Date} thoi_gian_vao - Thời gian vào
 * @property {BaiLamType} bai_lam - Bài làm của player
 */

/**
 * Lấy tất cả player
 * @returns {Promise<PlayerType[]>}
 */
export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM player');
  return rows;
};

/**
 * Tìm player theo uuid
 * @param {string} uuid 
 * @returns {Promise<PlayerType|null>}
 */
export const findById = async (uuid) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE uuid = ?', [uuid]);
  return rows[0] || null;
};

/**
 * Tìm player theo session_id
 * @param {string} sessionId 
 * @returns {Promise<PlayerType[]>}
 */
export const findBySessionId = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE session_id = ?', [sessionId]);
  return rows;
};

/**
 * Tạo player mới
 * @param {Omit<PlayerType, "uuid">} newPlayer 
 * @returns {Promise<Object>}
 */
export const createPlayer = async (newPlayer) => {
  console.log(newPlayer)
  newPlayer.uuid = uuid()
  if (newPlayer.bai_lam) newPlayer.bai_lam = JSON.stringify(newPlayer.bai_lam)
  const [result] = await pool.query(
    'INSERT INTO player ( '
    + Object.keys(newPlayer).map(e => `${pool.escapeId(e)}`).join(', ') +
    ' ) VALUES ( '
    + Object.keys(newPlayer).map(e => '?').join(',') +
    ')',
    Object.values(newPlayer)
  );

  return result;
};

/**
 * Cập nhật player
 * @param {string} uuid 
 * @param {Partial<PlayerType>} player 
 * @returns {Promise<ResultSetHeader>}
 */
export const updatePlayer = async (uuid, player) => {
  const copyPlayer = { ...player };

  if (copyPlayer.bai_lam) {
    copyPlayer.bai_lam = JSON.stringify(copyPlayer.bai_lam);
  }

  // remove undefind fiel
  Object.keys(copyPlayer).forEach(key => {
    if (copyPlayer[key] === undefined) {
      delete copyPlayer[key];
    }
  });

  const [result] = await pool.query(
    'UPDATE player SET '
    + Object.keys(copyPlayer).map(k => `${pool.escapeId(k)} = ?`).join(', ')
    + ' WHERE uuid = ?',
    [...Object.values(copyPlayer), uuid]
  );
  return result;
};

/**
 * Xóa player
 * @param {string} uuid 
 * @returns {Promise<ResultSetHeader>}
 */
export const deletePlayer = async (uuid) => {
  const [result] = await pool.query('DELETE FROM player WHERE uuid = ?', [uuid]);
  return result;
};
