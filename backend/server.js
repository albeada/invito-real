const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotta di prova
app.get('/', (req, res) => {
  res.json({ message: 'Il backend Node.js funziona correttamente!' });
});

// Rotta per ottenere tutti i professori
app.get('/api/prof', async (req, res) => {
  try {
    const rows = await db.selectFromTable('prof');
    res.json(rows);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

// Rotta per ottenere un professore per ID
app.get('/api/prof/:id', async (req, res) => {
  try {
    const rows = await db.selectFromTable('prof', { id: req.params.id });
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Professore non trovato' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

// Rotta per aggiungere un professore
app.post('/api/prof', async (req, res) => {
  try {
    const { cognome, nome, voto, stato } = req.body;
    const insertId = await db.insertIntoTable('prof', { cognome, nome, voto, stato });
    res.status(201).json({ id: insertId, cognome, nome, voto, stato });
  } catch (error) {
    console.error('Errore durante l\'inserimento:', error);
    res.status(500).json({ error: 'Errore nell\'inserimento dei dati' });
  }
});

// Rotta per aggiornare un professore
app.put('/api/prof/:id', async (req, res) => {
  try {
    const { cognome, nome, voto, stato } = req.body;
    const updated = await db.updateTable('prof', { cognome, nome, voto, stato }, { id: req.params.id });
    if (!updated) {
      return res.status(404).json({ error: 'Professore non trovato' });
    }
    res.json({ id: req.params.id, cognome, nome, voto, stato });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dei dati' });
  }
});

// Rotta per mostrare tutte le tabelle
app.get('/api/tables', async (req, res) => {
  try {
    const tables = await db.showTables();
    res.json(tables);
  } catch (error) {
    console.error('Errore durante il recupero delle tabelle:', error);
    res.status(500).json({ error: 'Errore nel recupero delle tabelle' });
  }
});

// Rotta per mostrare la struttura di una tabella
app.get('/api/tables/:tableName/describe', async (req, res) => {
  try {
    const structure = await db.describeTable(req.params.tableName);
    res.json(structure);
  } catch (error) {
    console.error('Errore durante la descrizione della tabella:', error);
    res.status(500).json({ error: 'Errore nella descrizione della tabella' });
  }
});

// Rotta per ottenere tutti i record di una tabella
app.get('/api/tables/:tableName', async (req, res) => {
  try {
    const rows = await db.selectFromTable(req.params.tableName);
    res.json(rows);
  } catch (error) {
    console.error('Errore durante la query:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

// Rotta per inserire in una tabella generica
app.post('/api/tables/:tableName', async (req, res) => {
  try {
    const insertId = await db.insertIntoTable(req.params.tableName, req.body);
    res.status(201).json({ id: insertId, ...req.body });
  } catch (error) {
    console.error('Errore durante l\'inserimento:', error);
    res.status(500).json({ error: 'Errore nell\'inserimento dei dati' });
  }
});

// Rotta per eliminare da una tabella generica
app.delete('/api/tables/:tableName/:id', async (req, res) => {
  try {
    const deletedRows = await db.deleteFromTable(req.params.tableName, { id: req.params.id });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Record non trovato' });
    }
    res.json({ message: 'Record eliminato' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione dei dati' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}/`);
});