import Database from "better-sqlite3";

const db = new Database("database/app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS perfis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    perfil_id INTEGER NOT NULL,
    ativo INTEGER DEFAULT 1,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id)
  );
`);

export default db;