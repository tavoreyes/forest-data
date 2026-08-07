import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execFileAsync = promisify(execFile);

// Ruta al intérprete de Python en el venv
const PYTHON_PATH = process.env.PYTHON_PATH || 'python';
const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

/**
 * POST /api/measure
 * 
 * Recibe una imagen y puntos base/tip del estudiante.
 * Ejecuta el script Python de medición con ArUco.
 * 
 * Body:
 * - image_path: string (ruta temporal de la imagen)
 * - base_y: number (posición Y de la base en pixels)
 * - tip_y: number (posición Y de la punta en pixels)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { image_path, base_y, tip_y } = body;

    if (!image_path) {
      return NextResponse.json(
        { error: 'Se requiere image_path' },
        { status: 400 }
      );
    }

    // Verificar que la imagen existe
    if (!fs.existsSync(image_path)) {
      return NextResponse.json(
        { error: 'La imagen no existe en la ruta especificada' },
        { status: 400 }
      );
    }

    // Construir argumentos del script Python
    const scriptPath = path.join(SCRIPTS_DIR, 'measure.py');
    const args = [scriptPath, '--image', image_path, '--output-json'];

    if (base_y !== undefined && tip_y !== undefined) {
      args.push('--base-y', base_y.toString(), '--tip-y', tip_y.toString());
    }

    // Ejecutar script Python
    const { stdout, stderr } = await execFileAsync(PYTHON_PATH, args, {
      timeout: 30000, // 30 segundos máximo
      cwd: process.cwd(),
      env: {
        ...process.env,
        PYTHONPATH: path.join(process.cwd(), 'venv', 'Lib', 'site-packages')
      }
    });

    // Parsear resultado JSON
    let result;
    try {
      result = JSON.parse(stdout);
    } catch (parseError) {
      console.error('Error parsing Python output:', stdout, stderr);
      return NextResponse.json(
        { error: 'Error en la salida del script de medición' },
        { status: 500 }
      );
    }

    // Verificar si hay error
    if (result.error) {
      return NextResponse.json(
        { error: result.error, details: result },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      measurement: {
        height_cm: result.height_cm,
        confidence: result.confidence,
        px_per_cm: result.px_per_cm,
        base_y: result.base_y,
        tip_y: result.tip_y,
        marker_positions: result.marker_positions
      }
    });

  } catch (error) {
    console.error('Error in measure endpoint:', error);
    
    // Error de timeout
    if (error.killed) {
      return NextResponse.json(
        { error: 'Timeout en la medición. Intenta de nuevo.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/measure
 * 
 * Detecta marcadores ArUco en una imagen y retorna sus posiciones.
 * Útil para el modo interactivo donde el estudiante ve los marcadores.
 * 
 * Query params:
 * - image_path: string (ruta de la imagen)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const image_path = searchParams.get('image_path');

    if (!image_path) {
      return NextResponse.json(
        { error: 'Se requiere image_path como query parameter' },
        { status: 400 }
      );
    }

    // Verificar que la imagen existe
    if (!fs.existsSync(image_path)) {
      return NextResponse.json(
        { error: 'La imagen no existe en la ruta especificada' },
        { status: 400 }
      );
    }

    // Ejecutar script Python para detectar marcadores
    const scriptPath = path.join(SCRIPTS_DIR, 'measure.py');
    const args = [scriptPath, '--image', image_path, '--output-json'];

    const { stdout, stderr } = await execFileAsync(PYTHON_PATH, args, {
      timeout: 15000,
      cwd: process.cwd()
    });

    let result;
    try {
      result = JSON.parse(stdout);
    } catch (parseError) {
      console.error('Error parsing Python output:', stdout, stderr);
      return NextResponse.json(
        { error: 'Error en la salida del script' },
        { status: 500 }
      );
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error, details: result },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      markers: result.detected_markers || {},
      calibration: result.calibration || {}
    });

  } catch (error) {
    console.error('Error detecting markers:', error);
    return NextResponse.json(
      { error: 'Error detectando marcadores' },
      { status: 500 }
    );
  }
}
