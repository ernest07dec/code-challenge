import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "tasks.db");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT,
    deletedAt TEXT
  )
`);

export default db;
