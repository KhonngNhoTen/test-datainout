import { Client, Pool } from 'pg';
require('dotenv').config();

export const clientPg = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: 'test-2',
  password: process.env.DB_PASSWORD,
  port: 5440,
});

export const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: 'test-2',
  password: process.env.DB_PASSWORD,
  port: 5440,
  max: 10, // số lượng connection tối đa
  idleTimeoutMillis: 30000, // thời gian nhàn rỗi trước khi đóng connection
});
