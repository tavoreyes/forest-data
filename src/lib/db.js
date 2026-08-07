import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'forestdata.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS trees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      species TEXT NOT NULL,
      zone TEXT NOT NULL,
      planted_at TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      health TEXT DEFAULT 'good' CHECK(health IN ('good','fair','poor')),
      height_cm REAL DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS care_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tree_id INTEGER NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
      water_liters REAL,
      height_cm REAL,
      notes TEXT,
      captured_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as n FROM trees').get();
  if (count.n === 0) {
    seedData();
  }
}

function seedData() {
  const insert = db.prepare(`
    INSERT INTO trees (code, species, zone, planted_at, lat, lng, health, height_cm, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const trees = [
    ['A-01', 'Pinus pseudostrobus', 'Zona A', '2023-12-01', 19.468, -101.877, 'good', 112, 'Arbol adulto, buen desarrollo.'],
    ['A-02', 'Pinus montezumae', 'Zona A', '2024-01-15', 19.470, -101.875, 'good', 98, 'Crecimiento uniforme.'],
    ['A-03', 'Pinus leiophylla', 'Zona A', '2024-01-10', 19.466, -101.880, 'good', 104, 'Aciculas verde intenso.'],
    ['A-04', 'Pinus pseudostrobus', 'Zona A', '2024-02-01', 19.464, -101.876, 'fair', 71, 'Crecimiento lento, revisar drenaje.'],
    ['A-06', 'Cedrus deodara', 'Zona A', '2024-04-10', 19.467, -101.882, 'good', 87, 'Excelente adaptacion.'],
    ['A-07', 'Cedrus deodara', 'Zona A', '2024-03-20', 19.469, -101.879, 'good', 91, 'Desarrollo normal.'],
    ['A-08', 'Quercus rugosa', 'Zona A', '2024-06-01', 19.465, -101.874, 'fair', 63, 'Crecimiento lento, caracteristico de encinos.'],
    ['B-01', 'Pinus leiophylla', 'Zona B', '2024-03-01', 19.475, -101.872, 'good', 104, 'Mayor exposicion solar.'],
    ['B-02', 'Pinus montezumae', 'Zona B', '2024-03-15', 19.477, -101.870, 'good', 96, 'Raices bien establecidas.'],
    ['B-03', 'Pinus pseudostrobus', 'Zona B', '2024-02-20', 19.474, -101.868, 'good', 108, 'El mas alto de Zona B.'],
    ['B-04', 'Pinus leiophylla', 'Zona B', '2024-03-10', 19.476, -101.873, 'fair', 78, 'Zona ventosa, revisar soporte.'],
    ['C-01', 'Quercus rugosa', 'Zona C', '2024-06-05', 19.461, -101.865, 'fair', 58, 'Pendiente pronunciada.'],
    ['C-02', 'Pinus montezumae', 'Zona C', '2024-04-01', 19.459, -101.863, 'poor', 44, 'Estancamiento, posible dano radicular.'],
    ['C-03', 'Cedrus deodara', 'Zona C', '2024-07-01', 19.462, -101.867, 'fair', 58, 'Adaptacion moderada.'],
    ['C-04', 'Pinus pseudostrobus', 'Zona C', '2024-04-15', 19.460, -101.861, 'poor', 39, 'Estado critico, zona muy expuesta.'],
  ];

  const insertCare = db.prepare(`
    INSERT INTO care_logs (tree_id, water_liters, height_cm, notes, captured_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    for (const t of trees) {
      const info = insert.run(...t);
      insertCare.run(info.lastInsertRowid, 1.5, t[7], 'Riego inicial de establecimiento.', '2024-06-01');
      if (t[7] > 80) {
        insertCare.run(info.lastInsertRowid, 2.0, t[7] - 10, 'Segundo registro de cuidado.', '2025-01-15');
      }
    }
  });

  transaction();
}

export default getDb;
