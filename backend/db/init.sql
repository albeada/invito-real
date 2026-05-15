CREATE DATABASE IF NOT EXISTS invito;
USE invito;

CREATE TABLE IF NOT EXISTS prof (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cognome VARCHAR(100) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  voto INT NOT NULL,
  stato VARCHAR(50) NOT NULL
);

INSERT INTO prof (cognome, nome, voto, stato) VALUES
  ('Rossi', 'Mario', 28, 'attivo'),
  ('Bianchi', 'Luca', 24, 'attivo'),
  ('Verdi', 'Giulia', 30, 'assente');
