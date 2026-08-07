import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone');
  const health = searchParams.get('health');
  const q = searchParams.get('q');

  let sql = 'SELECT * FROM trees WHERE 1=1';
  const params = [];

  if (zone && zone !== 'all') {
    sql += ' AND zone = ?';
    params.push(zone);
  }
  if (health && health !== 'all') {
    sql += ' AND health = ?';
    params.push(health);
  }
  if (q) {
    sql += ' AND (species LIKE ? OR code LIKE ? OR notes LIKE ?)';
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  sql += ' ORDER BY created_at DESC';
  const trees = db.prepare(sql).all(...params);
  return NextResponse.json(trees);
}

export async function POST(request) {
  const db = getDb();
  const body = await request.json();
  const { code, species, zone, planted_at, lat, lng, health, height_cm, notes } = body;

  if (!code || !species || !zone || lat == null || lng == null) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos: code, species, zone, lat, lng' },
      { status: 400 }
    );
  }

  try {
    const result = db.prepare(`
      INSERT INTO trees (code, species, zone, planted_at, lat, lng, health, height_cm, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(code, species, zone, planted_at || null, lat, lng, health || 'good', height_cm || 0, notes || null);

    const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(tree, { status: 201 });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: `El codigo "${code}" ya existe` }, { status: 409 });
    }
    throw err;
  }
}
