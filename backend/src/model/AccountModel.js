
/**
 * 
 * @typedef {import('mysql2').ResultSetHeader} ResultSetHeader
 * 
 * @typedef {} AccountType
 * @property {string} user_name - The username of the account, max length 100
 * @property {string} password - The password of the account, max length 255
 * @property {string} email - The email of the account, max length 300
 */

import pool from '../config/database.js';

/**
 * 
 * @returns {Promise<AccountType[]>} - A list of all accounts
 */
export const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM account');
  return rows;
};


/**
 * 
 * @param {string} userName 
 * @returns {Promise<AccountType | null>} - The account with the given username, or null if not found
 */
export const findUserName = async (userName) => {
  const [rows] = await pool.query('SELECT * FROM account WHERE user_name = ?', [userName]);
  return rows[0] || null;
};

/**
 * 
 * @param {AccountType} newAccout 
 * @returns {Promise<ResultSetHeader>} - The newly created account
 */
export const createAccount = async (newAccout) => {
  const { userName, password, email } = newAccout;
  const [result] = await pool.query(
    'INSERT INTO account (user_name, password, email) VALUES (?, ?, ?)',
    [userName, password, email]
  );
  return result[0];
};

/**
 * 
 * @param {string} email 
 * @param {Partial<Omit<AccountType, 'email'>>} data
 * @returns {Promise<ResultSetHeader>} - The updated account
 */
export const updateAccount = async (email, data) => {
  const [result] = await pool.query(
    'UPDATE account SET '

    + Object.keys(data).map(key => `${pool.escapeId(key)} = ?`).join(', ') +
     
    ' WHERE email = ?',
    [...Object.values(data), email]
  );
  return result;
};

/**
 * 
 * @param {string} userName 
 * @returns {Promise<ResultSetHeader>} - The deleted account
 */
export const deleteAccount = async (userName) => {
  const [result] = await pool.query('DELETE FROM account WHERE user_name = ?', [userName]);
  return result;
};