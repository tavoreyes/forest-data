import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(request, { params }) {
  const db = getDb();
  const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(Number(params.id));

  if (!tree) {
    return NextResponse.json({ error: 'Arbol no encontrado' }, { status: 404 });
  }

  const careLogs = db.prepare(
    'SELECT * FROM care_logs WHERE tree_id = ? ORDER BY captured_at DESC'
  ).all(Number(params.id));

  return NextResponse.json({ ...tree, careLogs });
}

export async function PUT(request, { params }) {
  const db = getDb();
  const id = Number(params.id);
  const body = await request.json();
  const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(id);

  if (!tree) {
    return NextResponse.json({ error: 'Arbol no encontrado' }, { status: 404 });
  }

  const { code, species, zone, planted_at, lat, lng, health, height_cm, notes } = body;

  db.prepare(`
    UPDATE trees
    SET code = ?, species = ?, zone = ?, planted_at = ?, lat = ?, lng = ?,
        health = ?, height_cm = ?, notes = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    code ?? tree.code,
    species ?? tree.species,
    zone ?? tree.zone,
    planted_at ?? tree.planted_at,
    lat ?? tree.lat,
    lng ?? tree.lng,
    health ?? tree.health,
    height_cm ?? tree.height_cm,
    notes ?? tree.notes,
    id
  );

  const updated = db.prepare('SELECT * FROM trees WHERE id = ?').get(id);
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const db = getDb();
  const id = Number(params.id);
  const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(id);

  if (!tree) {
    return NextResponse.json({ error: 'Arbol no encontrado' }, { status: 404 });
  }

  db.prepare('DELETE FROM trees WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
