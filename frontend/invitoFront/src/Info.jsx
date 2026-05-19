import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import palle from './assets/palle.jpeg';
import Mappa from './Mappa.jsx';

function Info() {
  const [rifiutaText, setRifiutaText] = useState('Rifiuta');
  const [invitati, setInvitati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const loadInvitati = async () => {
      setLoading(true);
      setFetchError('');

      try {
        const response = await fetch('http://localhost:3001/api/invitati');
        if (!response.ok) {
          throw new Error('Impossibile caricare gli invitati');
        }
        const data = await response.json();
        const confirmed = data.filter((item) => item.stato === 'accettato');
        setInvitati(confirmed);
      } catch (error) {
        setFetchError(error.message || 'Errore di rete');
      } finally {
        setLoading(false);
      }
    };

    loadInvitati();
  }, []);

  return (
    <main className="page page-info">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Invito speciale</p>
          <h2>Sei stato ufficialmente invitato alla nostra cena</h2>
          <p className="intro">
            Ti aspettiamo per una serata speciale tra buon cibo e ottima compagnia.
          </p>
          <div className="details">
            <p><strong>Luogo:</strong> Ristorante Zi Michele</p>
            <p><strong>Indirizzo:</strong> Via Acanfora 43, Pompei</p>
            <p><strong>Data:</strong> 12 Giugno 2026</p>
            <p><strong>Ora:</strong> 20:30</p>
          </div>
          <div className="actions">
            <Link to="/accetta">
              <button className="primary">Accetta</button>
            </Link>
            <button className="secondary" onClick={() => setRifiutaText('Ci offendiamo!')}>
              {rifiutaText}
            </button>
          </div>
        </div>
        <div className="hero-media">
          <img src={palle} alt="La vostra classe" className="hero-image" />
        </div>
      </section>

      <section className="guest-section">
        <div className="guest-header">
          <h3>Professori che hanno accettato</h3>
          <p className="guest-note">Lista degli invitati confermati per la cena.</p>
        </div>

        {loading ? (
          <p className="guest-status">Caricamento in corso...</p>
        ) : fetchError ? (
          <p className="guest-status error-message">{fetchError}</p>
        ) : invitati.length === 0 ? (
          <p className="guest-status">Ancora nessuno ha confermato l'invito.</p>
        ) : (
          <ul className="guest-list">
            {invitati.map((invitato) => (
              <li key={invitato.id} className="guest-card">
                <div>
                  <strong>{invitato.nome} {invitato.cognome}</strong>
                  <p>Voto: {invitato.voto}</p>
                </div>
                <span className="guest-badge">Accettato</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="map-section">
        <h3>Trova il ristorante</h3>
        <div className="map-wrapper">
          <Mappa />
        </div>
      </section>
    </main>
  );
}

export default Info;
