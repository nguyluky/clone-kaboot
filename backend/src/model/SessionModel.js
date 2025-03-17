import pool from '../config/database.js';

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
 * 
 * @returns {Promise<SessionType[]>}
 */
export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM session');
  return rows;
};

/**
 * 
 * @param {number} sessionId 
 * @returns {Promise<SessionType|null>}
 */
export const findById = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE session_id = ?;', [sessionId]);
  return rows[0] || null;
};


/**
 * 
 * @param {number} canvaId 
 * @returns {Promise<SessionType[]>}
 */
export const findByCanvaId = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE canva_id = ?', [canvaId]);
  return rows;
};

/**
 * 
 * @param {SessionType} data 
 * @returns 
 */
export const createSession = async (data) => {
  const [result] = await pool.query(
    'INSERT INTO session ('
    + Object.keys(data).map((e) => `${pool.escapeId(e)}`).join(', ') +
    ') VALUES (' 
    + Object.keys(data).map(() => '?').join(', ') +
    ')', [...Object.values(data)]
  );
  return result;
};

/**
 * 
 * @param {number} sessionId 
 * @param {Partial<SessionType>} newSession 
 * @returns {Promise<ResultSetHeader>}
 */
export const updateSession = async (sessionId, newSession) => {
  // remove remove undefind 
  Object.keys(newSession).forEach(key => newSession[key] === undefined && delete newSession[key]);
  const [result] = await pool.query(
    'UPDATE session SET '
    + Object.keys(newSession).map(key => `${pool.escapeId(key)} = ?`).join(', ') +
    ' WHERE session_id = ?',
    [...Object.values(newSession), sessionId]
  );
  return result;
};

/**
 * 
 * @param {number} sessionId 
 * @returns {Promise<ResultSetHeader>}
 */
export const deleteSession = async (sessionId) => {
  const [result] = await pool.query('DELETE FROM session WHERE session_id = ?', [sessionId]);
  return result;
};

/**
 * 
 * 
 * @param {number} sessionId 
 * @returns {Promise<import('./PlayerModel.js').PlayerType[]>}
 */
export const getPlayerBySessionId = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE session_id = ?', [sessionId]);
  return rows;
}

/**
 * 
 * @param {number} sessionId 
 * @returns {Promise<import('./PlayerModel.js').PlayerType[]>}
 */
export const getLeaderBoard = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE session_id = ? ORDER BY point DESC', [sessionId]);
  return rows;
}

/**
 * 
 * @param {string} codeJoin 
 * @returns {Promise<SessionType|null>}
 */
export const getSessionByCodeJoin = async (codeJoin) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE code_join = ?', [codeJoin]);
  return rows[0] || null;
}

export const getSessionPublic = async () => {
  const [rows] = await pool.query('SELECT * FROM session WHERE is_public = 1');
  return rows;
}