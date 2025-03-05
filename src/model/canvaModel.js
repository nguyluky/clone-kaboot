
import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM canva');
  return rows;
};

export const findById = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM canva WHERE canva_id = ?', [canvaId]);
  return rows[0] || null;
};

export const createCanva = async (newCava) => {
  const { tieu_de, ngay_tao } = newCava;
  const [result] = await pool.query('INSERT INTO canva (tieu_de, ngay_tao) VALUES (?, ?)', [
    tieu_de,
    ngay_tao,
  ]);
  return { canva_id: result.insertId, tieu_de, ngay_tao };
};

export const updateCanva = async (canvaId, newCanva) => {
  const { tieu_de, ngay_tao } = newCanva;
  const [result] = await pool.query(
    'UPDATE canva SET tieu_de = ?, ngay_tao = ? WHERE canva_id = ?',
    [tieu_de, ngay_tao, canvaId]
  );
  return result;
};

export const deleteCanva = async (canvaId) => {
  const [result] = await pool.query('DELETE FROM canva WHERE canva_id = ?', [canvaId]);
  return result;
};
