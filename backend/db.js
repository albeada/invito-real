const mysql = require('mysql2/promise');
require('dotenv').config();

// Configurazione del pool di connessioni al database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'invito',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Esegue una query SELECT su una tabella
 * @param {string} tableName - Nome della tabella
 * @param {Object} conditions - Condizioni WHERE (opzionale)
 * @param {Array} columns - Colonne da selezionare (default: *)
 * @returns {Promise<Array>} Risultati della query
 */
async function selectFromTable(tableName, conditions = {}, columns = ['*']) {
  try {
    const connection = await pool.getConnection();

    let query = `SELECT ${columns.join(', ')} FROM ${tableName}`;
    let values = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values = Object.values(conditions);
    }

    const [rows] = await connection.query(query, values);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Errore nella query SELECT:', error);
    throw error;
  }
}

/**
 * Inserisce un nuovo record in una tabella
 * @param {string} tableName - Nome della tabella
 * @param {Object} data - Dati da inserire
 * @returns {Promise<number>} ID del record inserito
 */
async function insertIntoTable(tableName, data) {
  try {
    const connection = await pool.getConnection();

    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await connection.query(query, values);

    connection.release();
    return result.insertId;
  } catch (error) {
    console.error('Errore nella query INSERT:', error);
    throw error;
  }
}

/**
 * Aggiorna un record in una tabella
 * @param {string} tableName - Nome della tabella
 * @param {Object} data - Dati da aggiornare
 * @param {Object} conditions - Condizioni WHERE
 * @returns {Promise<boolean>} True se aggiornato con successo
 */
async function updateTable(tableName, data, conditions) {
  try {
    const connection = await pool.getConnection();

    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const values = [...Object.values(data), ...Object.values(conditions)];
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;

    const [result] = await connection.query(query, values);
    connection.release();
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Errore nella query UPDATE:', error);
    throw error;
  }
}

/**
 * Elimina record da una tabella
 * @param {string} tableName - Nome della tabella
 * @param {Object} conditions - Condizioni WHERE
 * @returns {Promise<number>} Numero di righe eliminate
 */
async function deleteFromTable(tableName, conditions) {
  try {
    const connection = await pool.getConnection();

    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    const values = Object.values(conditions);

    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const [result] = await connection.query(query, values);

    connection.release();
    return result.affectedRows;
  } catch (error) {
    console.error('Errore nella query DELETE:', error);
    throw error;
  }
}

/**
 * Mostra la struttura di una tabella
 * @param {string} tableName - Nome della tabella
 * @returns {Promise<Array>} Descrizione delle colonne
 */
async function describeTable(tableName) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`DESCRIBE ${tableName}`);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Errore nella query DESCRIBE:', error);
    throw error;
  }
}

/**
 * Mostra tutte le tabelle del database
 * @returns {Promise<Array>} Lista delle tabelle
 */
async function showTables() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SHOW TABLES');
    connection.release();
    return rows;
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
  pool // Esporta anche il pool per usi avanzati
};