CREATE DATABASE IF NOT EXISTS invito;
USE invito;

CREATE TABLE IF NOT EXISTS prof (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cognome VARCHAR(100) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  dedica VARCHAR(255) NOT NULL DEFAULT '',
  stato VARCHAR(50) NOT NULL DEFAULT 'attivo',
  voto INT NOT NULL DEFAULT 0
);

INSERT INTO prof (cognome, nome, dedica, stato, voto) VALUES
  ('Rossi', 'Mario', 'Felice di partecipare!', 'attivo', 0),
  ('Bianchi', 'Luca', 'Non vedo l\'ora', 'attivo', 0),
  ('Verdi', 'Giulia', 'Sarà una bella serata', 'assente', 0);
