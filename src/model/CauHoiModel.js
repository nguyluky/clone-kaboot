// src/model/CauHoiModel.js
import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM cau_hoi');
  return rows;
};

export const findById = async (cauHoiId) => {
  const [rows] = await pool.query('SELECT * FROM cau_hoi WHERE cau_hoi_id = ?', [cauHoiId]);
  return rows[0] || null;
};

export const findByCanvaId = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM cau_hoi WHERE canva_id = ?', [canvaId]);
  return rows;
};

export const createCauHoi = async (newCauHoi) => {
  const { canva_id, noi_dung, dinh_dang, thoi_gian } = newCauHoi;
  const [result] = await pool.query(
    'INSERT INTO cau_hoi (canva_id, noi_dung, dinh_dang, thoi_gian) VALUES (?, ?, ?, ?)',
    [canva_id, noi_dung, dinh_dang, thoi_gian]
  );
  return result;
};

export const updateCauHoi = async (cauHoiId) => {
  const { canva_id, noi_dung, dinh_dang, thoi_gian } = data;
  const [result] = await pool.query(
    'UPDATE cau_hoi SET canva_id = ?, noi_dung = ?, dinh_dang = ?, thoi_gian = ? WHERE cau_hoi_id = ?',
    [canva_id, noi_dung, dinh_dang, thoi_gian, cauHoiId]
  );
  return result;
};

export const deleteCauHoi = async (cauHoiId) => {
  const [result] = await pool.query('DELETE FROM cau_hoi WHERE cau_hoi_id = ?', [cauHoiId]);
  return result;
};
