import { useState } from 'react';
import palle from './assets/palle.jpeg';
import accetta from './Accetta.jsx';
import { Link } from 'react-router-dom';

function Info() {
  const [rifiutaText, setRifiutaText] = useState('Rifiuta');

  return (
    <div>
      
      <h2>Sei stato ufficialmente invitato alla nostra festa</h2>
      <img src={palle} alt="La vostra classe" style={{ width: '200px', height: 'auto' }} />
      <p>Ristorante Zi Michele</p>
      <p>Via Acanfora, 43, 80045 Pompei</p>
      <p>12 Giugno 2026 alle 20:30</p>
        <Link to="/accetta">
          <button>
            Accetta
          </button>
        </Link>

          <button onClick={() => setRifiutaText('Ci offendiamo!')}>
            {rifiutaText}
          </button>

    </div>
  );
}

export default Info;