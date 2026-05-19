import { useState } from 'react';

function Accetta() {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [voto, setVoto] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setStatus('');
    setError('');

    if (!nome || !cognome || voto === '') {
      setError('Inserisci nome, cognome e voto per proseguire.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/invitati', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cognome, voto: Number(voto) })
      });

      if (!response.ok) {
        throw new Error('Errore nell\'invio dell\'invito');
      }

      const data = await response.json();
      setStatus(`Invito registrato! Benvenuto, ${data.nome} ${data.cognome}.`);
      setNome('');
      setCognome('');
      setVoto('');
    } catch (err) {
      setError(err.message || 'Errore di rete. Riprova più tardi.');
    }
  };

  return (
    <main className="page page-form">
      <section className="form-card">
        <h2>Accetta l'invito</h2>
        <p>Inserisci i tuoi dati per confermare la tua presenza alla cena.</p>
        <div className="form-grid">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="cognome">Cognome</label>
          <input
            type="text"
            id="cognome"
            name="cognome"
            placeholder="Cognome"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
          />

          <label htmlFor="voto">Voto</label>
          <input
            type="number"
            id="voto"
            name="voto"
            placeholder="Voto"
            min="0"
            max="10"
            value={voto}
            onChange={(e) => setVoto(e.target.value)}
          />
        </div>
        <button className="primary" type="button" onClick={handleSubmit}>
          Invia
        </button>
        {status && <p className="success-message">{status}</p>}
        {error && <p className="error-message">{error}</p>}
      </section>
    </main>
  );
}

export default Accetta;
