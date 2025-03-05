import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM session');
  return rows;
};

export const findById = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE session_id = ?', [sessionId]);
  return rows[0] || null;
};

export const findByCanvaId = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE canva_id = ?', [canvaId]);
  return rows;
};

export const createSession = async () => {
  const newSession = {
    title,
    code_join,
    canva_id,
    thoi_gian_bat_dau,
    trang_thai,
  };
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
