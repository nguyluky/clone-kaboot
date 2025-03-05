// src/model/AccountModel.js
import pool from '../config/database.js';

export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM account');
  return rows;
};

export const findUserName = async (userName) => {
  const [rows] = await pool.query('SELECT * FROM account WHERE user_name = ?', [userName]);
  return rows[0] || null;
};

export const createAccount = async (newAccout) => {
  const { userName, password, email } = newAccout;
  const [result] = await pool.query(
    'INSERT INTO account (user_name, password, email) VALUES (?, ?, ?)',
    [userName, password, email]
  );
  return result[0];
};

export const updateAccount = async (email, { username, password }) => {
  const [result] = await pool.query(
    'UPDATE account SET user_name = ?, password = ? WHERE email = ?',
    [username, password, email]
  );
  return result;
};

export const deleteAccount = async (userName) => {
  const [result] = await pool.query('DELETE FROM account WHERE user_name = ?', [userName]);
  return result;
};
