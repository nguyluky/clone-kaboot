import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM player');
  return rows;
};

export const findById = async (uuid) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE uuid = ?', [uuid]);
  return rows[0] || null;
};

export const findBySessionId = async (sessionId) => {
  const [rows] = await pool.query('SELECT * FROM player WHERE session_id = ?', [sessionId]);
  return rows;
};

export const createPlayer = async (newPlayer) => {
  const  {
    uuid,
        session_id,
        name,
        email,
        std,
        point,
        thoi_gian_ket_thuc,
        thoi_gian_vao,
        bai_lam,
  } = newPlayer;
  const [result] = await pool.query(
    'INSERT INTO player (uuid, session_id, name, email, std, thoi_gian_ket_thuc, thoi_gian_vao, bai_lam, point) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      uuid,
      session_id,
      name,
      email,
      std,
      thoi_gian_ket_thuc,
      thoi_gian_vao,
      JSON.stringify(bai_lam),
      point,
    ]
  );

  return result;
};

export const updatePlayer = async (uuid, player) => {
  const {
    session_id,
    name,
    email,
    std,
    point,
    thoi_gian_lam_bai,
    thoi_gian_voa,
    bai_lam,
  } = player;
  const [result] = await pool.query(
    'UPDATE player SET session_id = ?, name = ?, email = ?, std = ?, point = ?, thoi_gian_lam_bai = ?, thoi_gian_voa = ?, bai_lam = ? WHERE uuid = ?',
    [
      session_id,
      name,
      email,
      std,
      point,
      thoi_gian_lam_bai,
      thoi_gian_voa,
      JSON.stringify(bai_lam),
      uuid,
    ]
  );
  return result;
};

export const deletePlayer = async (uuid) => {
  const [result] = await pool.query('DELETE FROM player WHERE uuid = ?', [uuid]);
  return result;
};
