import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET() {
  const db = getDb();

  const total = db.prepare('SELECT COUNT(*) as n FROM trees').get().n;
  const byHealth = db.prepare(
    'SELECT health, COUNT(*) as count FROM trees GROUP BY health'
  ).all();
  const byZone = db.prepare(
    'SELECT zone, COUNT(*) as count FROM trees GROUP BY zone ORDER BY zone'
  ).all();
  const avgHeight = db.prepare(
    'SELECT ROUND(AVG(height_cm), 1) as avg FROM trees'
  ).get().avg;
  const recentCare = db.prepare(
    `SELECT cl.*, t.code, t.species
     FROM care_logs cl
     JOIN trees t ON t.id = cl.tree_id
     ORDER BY cl.captured_at DESC
     LIMIT 5`
  ).all();

  return NextResponse.json({
    total,
    byHealth: Object.fromEntries(byHealth.map(r => [r.health, r.count])),
    byZone: byZone.map(r => ({ zone: r.zone, count: r.count })),
    avgHeight,
    recentCare,
  });
}
