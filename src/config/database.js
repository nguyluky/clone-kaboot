import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '8000',
  database: process.env.DB_NAME || 'clone_kaboot',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
