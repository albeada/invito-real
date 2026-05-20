const mysql = require('mysql2/promise');
const { Pool: PgPool } = require('pg');
require('dotenv').config();

const isPostgres = Boolean(process.env.DATABASE_URL || process.env.DB_CLIENT === 'pg');
const client = isPostgres ? 'pg' : 'mysql';

let pool;
if (isPostgres) {
  pool = new PgPool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 10
  });
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'invito',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

function buildWhereClause(conditions) {
  const keys = Object.keys(conditions);
  if (keys.length === 0) return { clause: '', values: [] };

  if (client === 'mysql') {
    const clause = keys.map((key) => `${key} = ?`).join(' AND ');
    return { clause: ` WHERE ${clause}`, values: Object.values(conditions) };
  }

  const clause = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
  return { clause: ` WHERE ${clause}`, values: Object.values(conditions) };
}

function buildInsertPlaceholders(columns) {
  if (client === 'mysql') {
    return columns.map(() => '?').join(', ');
  }
  return columns.map((_, index) => `$${index + 1}`).join(', ');
}

function buildUpdateClause(columns) {
  if (client === 'mysql') {
    return columns.map((key) => `${key} = ?`).join(', ');
  }
  return columns.map((key, index) => `${key} = $${index + 1}`).join(', ');
}

async function selectFromTable(tableName, conditions = {}, columns = ['*']) {
  try {
    const connection = await (client === 'mysql' ? pool.getConnection() : pool.connect());
    let query = `SELECT ${columns.join(', ')} FROM ${tableName}`;
    const { clause, values } = buildWhereClause(conditions);
    query += clause;

    const result = await connection.query(query, values);
    connection.release();

    return client === 'mysql' ? result[0] : result.rows;
  } catch (error) {
    console.error('Errore nella query SELECT:', error);
    throw error;
  }
}

async function insertIntoTable(tableName, data) {
  try {
    const connection = await (client === 'mysql' ? pool.getConnection() : pool.connect());
    const columns = Object.keys(data);
    const placeholders = buildInsertPlaceholders(columns);
    const values = Object.values(data);

    let query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    if (client === 'pg') query += ' RETURNING id';

    const result = await connection.query(query, values);
    connection.release();

    if (client === 'mysql') {
      return result[0].insertId;
    }
    return result.rows[0]?.id;
  } catch (error) {
    console.error('Errore nella query INSERT:', error);
    throw error;
  }
}

async function updateTable(tableName, data, conditions) {
  try {
    const connection = await (client === 'mysql' ? pool.getConnection() : pool.connect());
    const setClause = buildUpdateClause(Object.keys(data));
    const updateValues = Object.values(data);
    const { clause, values: whereValues } = buildWhereClause(conditions);
    const values = [...updateValues, ...whereValues];

    const query = `UPDATE ${tableName} SET ${setClause}${clause}`;
    const result = await connection.query(query, values);
    connection.release();

    return client === 'mysql' ? result[0].affectedRows > 0 : result.rowCount > 0;
  } catch (error) {
    console.error('Errore nella query UPDATE:', error);
    throw error;
  }
}

async function deleteFromTable(tableName, conditions) {
  try {
    const connection = await (client === 'mysql' ? pool.getConnection() : pool.connect());
    const { clause, values } = buildWhereClause(conditions);
    const query = `DELETE FROM ${tableName}${clause}`;
    const result = await connection.query(query, values);
    connection.release();

    return client === 'mysql' ? result[0].affectedRows : result.rowCount;
  } catch (error) {
    console.error('Errore nella query DELETE:', error);
    throw error;
  }
}

async function describeTable(tableName) {
  try {
    const connection = await (client === 'mysql' ? pool.getConnection() : pool.connect());
    let result;

    if (client === 'mysql') {
      result = await connection.query(`DESCRIBE ${tableName}`);
      connection.release();
      return result[0];
    }

    result = await connection.query(`SELECT column_name AS Field, data_type AS Type, is_nullable AS Null, column_default AS Default FROM information_schema.columns WHERE table_name = $1 AND table_schema = 'public' ORDER BY ordinal_position`, [tableName]);
    connection.release();
    return result.rows;
  } catch (error) {
    console.error('Errore nella query DESCRIBE:', error);
    throw error;
  }
}

async function showTables() {
  try {
    const connection = await (client === 'mysql' ? pool.getConnection() : pool.connect());
    let result;

    if (client === 'mysql') {
      result = await connection.query('SHOW TABLES');
      connection.release();
      return result[0];
    }

    result = await connection.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename");
    connection.release();
    return result.rows;
  } catch (error) {
    console.error('Errore nella query SHOW TABLES:', error);
    throw error;
  }
}

module.exports = {
  selectFromTable,
  insertIntoTable,
  updateTable,
  deleteFromTable,
  describeTable,
  showTables,
  pool,
  client
};
