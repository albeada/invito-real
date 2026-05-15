const db = require('./db');

/**
 * Esempio di utilizzo del modulo db.js per operazioni CRUD
 * Puoi eseguire questo file con: node db-example.js
 */

async function esempioUtilizzo() {
  try {
    console.log('=== Esempio utilizzo modulo db.js ===\n');

    // 1. Mostra tutte le tabelle
    console.log('1. Tabelle nel database:');
    const tables = await db.showTables();
    console.log(tables);
    console.log();

    // 2. Descrivi la struttura della tabella prof
    console.log('2. Struttura tabella prof:');
    const structure = await db.describeTable('prof');
    console.log(structure);
    console.log();

    // 3. Seleziona tutti i professori
    console.log('3. Tutti i professori:');
    const professori = await db.selectFromTable('prof');
    console.log(professori);
    console.log();

    // 4. Seleziona un professore specifico
    console.log('4. Professore con ID 1:');
    const professore = await db.selectFromTable('prof', { id: 1 });
    console.log(professore);
    console.log();

    // 5. Inserisci un nuovo professore
    console.log('5. Inserimento nuovo professore:');
    const nuovoId = await db.insertIntoTable('prof', {
      cognome: 'Verdi',
      nome: 'Anna',
      voto: 27,
      stato: 'attivo'
    });
    console.log(`Nuovo professore inserito con ID: ${nuovoId}`);
    console.log();

    // 6. Verifica l'inserimento
    console.log('6. Professori dopo inserimento:');
    const professoriDopo = await db.selectFromTable('prof');
    console.log(professoriDopo);
    console.log();

    // 7. Aggiorna un professore
    console.log('7. Aggiornamento professore ID 1:');
    const aggiornato = await db.updateTable('prof', { voto: 29 }, { id: 1 });
    console.log(`Aggiornamento riuscito: ${aggiornato}`);
    console.log();

    // 8. Verifica l'aggiornamento
    console.log('8. Professore ID 1 dopo aggiornamento:');
    const professoreAggiornato = await db.selectFromTable('prof', { id: 1 });
    console.log(professoreAggiornato);
    console.log();

    // 9. Elimina il professore appena inserito
    console.log('9. Eliminazione professore appena inserito:');
    const eliminato = await db.deleteFromTable('prof', { id: nuovoId });
    console.log(`Record eliminati: ${eliminato}`);
    console.log();

    // 10. Verifica l'eliminazione
    console.log('10. Professori dopo eliminazione:');
    const professoriFinali = await db.selectFromTable('prof');
    console.log(professoriFinali);

    console.log('\n=== Fine esempio ===');

  } catch (error) {
    console.error('Errore nell\'esempio:', error);
  }
}

// Esegui l'esempio solo se questo file viene chiamato direttamente
if (require.main === module) {
  esempioUtilizzo();
}

module.exports = esempioUtilizzo;