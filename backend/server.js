const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

async function ensureProfColumns() {
  try {
    const description = await db.describeTable('prof');
    const columns = new Set(description.map((column) => column.Field));

    if (!columns.has('dedica')) {
      await db.pool.query('ALTER TABLE prof ADD COLUMN dedica VARCHAR(255) NOT NULL DEFAULT "" AFTER nome');
      console.log('Colonna "dedica" aggiunta alla tabella prof');
    }

    if (!columns.has('stato')) {
      await db.pool.query('ALTER TABLE prof ADD COLUMN stato VARCHAR(50) NOT NULL DEFAULT "attivo" AFTER dedica');
      console.log('Colonna "stato" aggiunta alla tabella prof');
    }

    if (!columns.has('voto')) {
      await db.pool.query('ALTER TABLE prof ADD COLUMN voto INT NOT NULL DEFAULT 0 AFTER stato');
      console.log('Colonna "voto" aggiunta alla tabella prof');
    }
  } catch (error) {
    console.error('Impossibile verificare o creare le colonne della tabella prof:', error);
  }
}

ensureProfColumns();

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
    const { cognome, nome, dedica, voto, stato } = req.body;
    const insertData = { cognome, nome, stato };
    if (dedica !== undefined) {
      insertData.dedica = dedica;
      insertData.voto = voto !== undefined ? voto : 0;
    } else if (voto !== undefined) {
      insertData.voto = voto;
    } else {
      insertData.voto = 0;
    }
    const insertId = await db.insertIntoTable('prof', insertData);
    res.status(201).json({ id: insertId, cognome, nome, dedica, voto, stato });
  } catch (error) {
    console.error('Errore durante l\'inserimento:', error);
    res.status(500).json({ error: 'Errore nell\'inserimento dei dati' });
  }
});

// Rotta per ottenere tutti gli invitati (alias di prof)
app.get('/api/invitati', async (req, res) => {
  try {
    const rows = await db.selectFromTable('prof');
    res.json(rows);
  } catch (error) {
    console.error('Errore durante il recupero degli invitati:', error);
    res.status(500).json({ error: 'Errore nel recupero degli invitati' });
  }
});

// Rotta per aggiungere un invitato accettando l'invito
app.post('/api/invitati', async (req, res) => {
  try {
    const { cognome, nome, dedica, voto } = req.body;
    const insertData = {
      cognome,
      nome,
      stato: 'accettato'
    };
    if (dedica !== undefined) {
      insertData.dedica = dedica;
      insertData.voto = 0;
    } else if (voto !== undefined) {
      insertData.voto = voto;
    } else {
      insertData.voto = 0;
    }

    const insertId = await db.insertIntoTable('prof', insertData);
    res.status(201).json({ id: insertId, cognome, nome, dedica, voto, stato: 'accettato' });
  } catch (error) {
    console.error('Errore durante l\'inserimento dell\'invitato:', error);
    res.status(500).json({ error: 'Errore nell\'inserimento dei dati' });
  }
});

// Rotta per aggiornare un professore
app.put('/api/prof/:id', async (req, res) => {
  try {
    const { cognome, nome, dedica, voto, stato } = req.body;
    const updateData = { cognome, nome, stato };
    if (dedica !== undefined) updateData.dedica = dedica;
    if (voto !== undefined) updateData.voto = voto;

    const updated = await db.updateTable('prof', updateData, { id: req.params.id });
    if (!updated) {
      return res.status(404).json({ error: 'Professore non trovato' });
    }
    res.json({ id: req.params.id, cognome, nome, dedica, voto, stato });
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
    const { tableName, id } = req.params;

    // If deleting from `prof` and the record is accepted, require admin token
    if (tableName === 'prof') {
      const rows = await db.selectFromTable('prof', { id });
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Record non trovato' });
      }
      const record = rows[0];
      if (record.stato === 'accettato') {
        const authHeader = req.get('authorization') || req.get('x-admin-token') || '';
        let token = '';
        if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7);
        else token = authHeader;

        if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
          return res.status(403).json({ error: 'Operazione consentita solo ad amministratori' });
        }
      }
    }

    const deletedRows = await db.deleteFromTable(tableName, { id });
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