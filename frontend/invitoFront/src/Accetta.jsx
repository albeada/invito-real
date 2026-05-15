function Accetta() {
  return (
    <div>
      
      <h2>Accetta l'invito tramite l'inserimento dei propri dati (giuriamo di non venderli)</h2>
      <input type="text" id="nome" placeholder="Nome" />
      <input type="text" id="cognome" placeholder="Cognome" />
      <input type="number" id="voto" placeholder="Voto" />
      <button onClick={() => alert('Invito accettato!')}>Invia</button>
      
    </div>
  );
}

export default Accetta;