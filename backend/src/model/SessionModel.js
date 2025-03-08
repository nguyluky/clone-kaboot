import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM session');
  return rows;
};

export const findById = async (sessionId) => {
  const [rows] = await pool.query('SELECT *, (SELECT SUM(cau_hoi.thoi_gian) + SUM(2) FROM cau_hoi WHERE cau_hoi.canva_id = session.canva_id) as thoi_gian_lam_bai FROM session WHERE session_id = ?;', [sessionId]);
  return rows[0] || null;
};

export const findByCanvaId = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE canva_id = ?', [canvaId]);
  return rows;
};

export const createSession = async (data) => {
  const {
    title,
    code_join,
    canva_id,
    thoi_gian_bat_dau,
    trang_thai,
  } = data;
  const [result] = await pool.query(
    'INSERT INTO session (title, code_join, canva_id, thoi_gian_bat_dau, trang_thai) VALUES (?, ?, ?, ?, ?)',
    [title, code_join, canva_id, thoi_gian_bat_dau, trang_thai]
  );
  return result;
};

export const updateSession = async (sessionId, newSession) => {
  const { title, code_join, canva_id, thoi_gian_bat_dau, trang_thai } = newSession;
  const [result] = await pool.query(
    'UPDATE session SET title = ?, code_join = ?, canva_id = ?, thoi_gian_bat_dau = ?, trang_thai = ? WHERE session_id = ?',
    [title, code_join, canva_id, thoi_gian_bat_dau, trang_thai, sessionId]
  );
  return result;
};

export const deleteSession = async (sessionId) => {
  const [result] = await pool.query('DELETE FROM session WHERE session_id = ?', [sessionId]);
  return result;
};

export const getPlayerBySessionId = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE session_id = ?', [sessionId]);
  return rows;
}

export const getLeaderBoard = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE session_id = ? ORDER BY point DESC', [sessionId]);
  return rows;
}

export const getSessionByCodeJoin = async (codeJoin) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE code_join = ?', [codeJoin]);
  return rows[0] || null;
}