import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function POST(request, { params }) {
  const db = getDb();
  const id = Number(params.id);
  const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(id);

  if (!tree) {
    return NextResponse.json({ error: 'Arbol no encontrado' }, { status: 404 });
  }

  const body = await request.json();
  const { water_liters, height_cm, notes } = body;

  const result = db.prepare(`
    INSERT INTO care_logs (tree_id, water_liters, height_cm, notes)
    VALUES (?, ?, ?, ?)
  `).run(id, water_liters || null, height_cm || null, notes || null);

  if (height_cm) {
    db.prepare(`
      UPDATE trees SET height_cm = ?, updated_at = datetime('now') WHERE id = ?
    `).run(height_cm, id);
  }

  const careLog = db.prepare('SELECT * FROM care_logs WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(careLog, { status: 201 });
}
