
import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT C.`canva_id`, C.`tieu_de`, C.`ngay_tao`, (SELECT COUNT(*) FROM `cau_hoi` CH WHERE CH.`canva_id` = C.`canva_id`) AS `so_cau_hoi`, (SELECT COUNT(*) FROM `session` S WHERE S.`canva_id` = C.`canva_id`) AS `so_session` FROM canva C; ');
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
    'UPDATE canva SET tieu_de = ? WHERE canva_id = ?',
    [tieu_de, canvaId]
  );
  return result;
};

export const deleteCanva = async (canvaId) => {
  const [result] = await pool.query('DELETE FROM canva WHERE canva_id = ?', [canvaId]);
  return result;
};

export const findAllSessionByCanvaId = async (canvaId) => {
  const [rows] = await pool.query('SELECT * FROM session WHERE canva_id = ?', [canvaId]);
  return rows;
}
