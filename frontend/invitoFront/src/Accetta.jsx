import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Accetta() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [dedica, setDedica] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setStatus('');
    setError('');

    if (!nome || !cognome || !dedica.trim()) {
      setError('Inserisci nome, cognome e dedica per proseguire.');
      return;
    }

    try {
      const apiUrl = 'https://invito-real.onrender.com';
      const response = await fetch(`${apiUrl}/api/invitati`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cognome, dedica })
      });

      if (!response.ok) {
        throw new Error('Errore nell\'invio dell\'invito');
      }

      await response.json();
      navigate('/', { replace: true });
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

          <label htmlFor="dedica">Aggiunta di una dedica</label>
          <input
            type="text"
            id="dedica"
            name="dedica"
            placeholder="Aggiungi una dedica"
            value={dedica}
            onChange={(e) => setDedica(e.target.value)}
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
