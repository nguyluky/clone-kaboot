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
  const [rows] = await pool.query("SELECT *, ( SELECT JSON_ARRAYAGG(JSON_OBJECT( 'lua_chon_id', LC.lua_chon_id, 'noi_dung', LC.noi_dung, 'dung', LC.dung)) FROM lua_chon LC WHERE cau_hoi_id = cau_hoi.cau_hoi_id) as lua_chon FROM cau_hoi WHERE canva_id = ?;", [canvaId]); 
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

export const updateCauHoi = async (cauHoiId, data) => {
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

export const updateLuaChon = async (lua_chon_id, lua_chon) => {
  const { noi_dung, dung } = lua_chon;
  const [result] = await pool.query(
    'UPDATE `lua_chon` SET noi_dung = ?, dung = ? WHERE lua_chon_id = ?',
    [noi_dung, dung, lua_chon_id]
  );
  return result;
}

export const addLuaChon = async (lua_chon) => {
  const { cau_hoi_id, noi_dung, dung } = lua_chon;
  const [result] = await pool.query(
    'INSERT INTO `lua_chon` (cau_hoi_id, noi_dung, dung) VALUES (?, ?, ?)',
    [cau_hoi_id, noi_dung, dung]
  );
  return result;
}

export const deleteLuaChon = async (lua_chon_id) => {
  const [result] = await pool.query('DELETE FROM `lua_chon` WHERE lua_chon_id = ?', [lua_chon_id]);
  return result;
}

export const findLuaChonById = async (lua_chon_id) => {
  const [rows] = await pool.query('SELECT * FROM lua_chon WHERE lua_chon_id = ?', [lua_chon_id]);
  return rows[0] || null;
}

export const getAllLuaChon = async () => {
  const [rows] = await pool.query('SELECT * FROM lua_chon');
  return rows;
}