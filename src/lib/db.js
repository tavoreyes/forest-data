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
    -- Tabla principal de arboles
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

    -- Tabla de registros de cuidado con GPS
    CREATE TABLE IF NOT EXISTS care_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tree_id INTEGER NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
      water_liters REAL,
      height_cm REAL,
      notes TEXT,
      captured_at TEXT DEFAULT (datetime('now')),
      -- GPS del momento del cuidado
      lat REAL,
      lng REAL,
      accuracy_m REAL,
      -- Foto de la sesion de cuidado
      photo_url TEXT,
      -- Fuente de medicion de altura
      measurement_source TEXT CHECK(measurement_source IN ('manual','aruco','vlm')),
      -- Confianza de la medicion (0-100)
      measurement_confidence REAL
    );

    -- Tabla de fotos subidas a R2
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tree_id INTEGER REFERENCES trees(id) ON DELETE SET NULL,
      care_log_id INTEGER REFERENCES care_logs(id) ON DELETE SET NULL,
      r2_key TEXT NOT NULL,
      r2_url TEXT NOT NULL,
      original_filename TEXT,
      file_size_bytes INTEGER,
      mime_type TEXT DEFAULT 'image/webp',
      -- Metadatos EXIF
      exif_lat REAL,
      exif_lng REAL,
      exif_taken_at TEXT,
      -- Metadata de IA
      ai_species TEXT,
      ai_confidence REAL,
      ai_description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Tabla de estimaciones de altura con ArUco
    CREATE TABLE IF NOT EXISTS height_estimates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tree_id INTEGER NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
      care_log_id INTEGER REFERENCES care_logs(id) ON DELETE SET NULL,
      photo_id INTEGER REFERENCES photos(id) ON DELETE SET NULL,
      -- Datos del marcador ArUco
      marker_id INTEGER NOT NULL,
      marker_distance_cm REAL NOT NULL,
      -- Medicion en pixels
      base_y_px INTEGER NOT NULL,
      tip_y_px INTEGER NOT NULL,
      pixels_per_cm REAL NOT NULL,
      -- Resultado
      height_cm REAL NOT NULL,
      -- Validacion con Gemma (si esta online)
      vlm_validated BOOLEAN DEFAULT 0,
      vlm_height_cm REAL,
      vlm_confidence REAL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Tabla de identificaciones de especies con Pl@ntNet
    CREATE TABLE IF NOT EXISTS species_identifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tree_id INTEGER REFERENCES trees(id) ON DELETE SET NULL,
      care_log_id INTEGER REFERENCES care_logs(id) ON DELETE SET NULL,
      photo_id INTEGER REFERENCES photos(id) ON DELETE SET NULL,
      -- Resultado de Pl@ntNet
      plantnet_species TEXT,
      plantnet_common_name TEXT,
      plantnet_confidence REAL,
      plantnet_score REAL,
      -- Validacion con Gemma (si esta online)
      vlm_species TEXT,
      vlm_common_name TEXT,
      vlm_confidence REAL,
      -- Decision final
      final_species TEXT,
      final_common_name TEXT,
      validated_by TEXT CHECK(validated_by IN ('plantnet','vlm','teacher','student')),
      created_at TEXT DEFAULT (datetime('now'))
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

  // Datos reales de CECyTEM 33 Capula (coordenadas verificadas)
  const trees = [
    ['P-001', 'Pinus leiophylla', 'Patio Central', '2024-08-01', 19.6738, -101.3933, 'good', 45, 'Arbol joven, primer registro con regla ArUco'],
    ['P-002', 'Pinus montezumae', 'Patio Central', '2024-08-01', 19.6739, -101.3934, 'good', 52, 'Buen desarrollo, exposition solar directa'],
    ['P-003', 'Pinus pseudostrobus', 'Patio Central', '2024-08-01', 19.6737, -101.3932, 'good', 38, 'Crecimiento normal para su edad'],
    ['P-004', 'Pinus leiophylla', 'Jardin Botanico', '2024-09-15', 19.6736, -101.3935, 'good', 61, 'Cerca del sendero principal'],
    ['P-005', 'Pinus montezumae', 'Jardin Botanico', '2024-09-15', 19.6735, -101.3933, 'fair', 48, 'Sombra parcial, crecimiento moderado'],
    ['P-006', 'Pinus pseudostrobus', 'Entrada Principal', '2024-10-01', 19.6740, -101.3936, 'good', 67, 'Mayor exposicion, buen desarrollo'],
    ['P-007', 'Pinus leiophylla', 'Entrada Principal', '2024-10-01', 19.6741, -101.3934, 'good', 55, 'Junto a la barda, protegido del viento'],
    ['P-008', 'Pinus montezumae', 'Deportes', '2024-10-15', 19.6734, -101.3931, 'fair', 42, 'Zona de juegos, requiere monitoreo'],
    ['P-009', 'Pinus pseudostrobus', 'Deportes', '2024-10-15', 19.6733, -101.3932, 'good', 58, 'Buen estado, riego regular'],
    ['P-010', 'Pinus leiophylla', 'Laboratorio', '2024-11-01', 19.6738, -101.3937, 'good', 34, 'Arbol mas joven, en establecimiento'],
  ];

  const insertCare = db.prepare(`
    INSERT INTO care_logs (tree_id, water_liters, height_cm, notes, captured_at, lat, lng, accuracy_m, measurement_source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    for (const t of trees) {
      const info = insert.run(...t);
      // Registrar cuidado inicial con GPS del arbol
      insertCare.run(
        info.lastInsertRowid, 
        1.5, 
        t[7], 
        'Riego inicial de establecimiento.', 
        '2024-08-01',
        t[4], // lat del arbol
        t[5], // lng del arbol
        3.5,  // precision GPS
        'manual'
      );
      // Segundo registro si el arbol es grande
      if (t[7] > 50) {
        insertCare.run(
          info.lastInsertRowid, 
          2.0, 
          t[7] - 8, 
          'Segundo registro de cuidado.', 
          '2025-01-15',
          t[4] + 0.00001,
          t[5] + 0.00001,
          4.2,
          'manual'
        );
      }
    }
  });

  transaction();
}

export default getDb;
