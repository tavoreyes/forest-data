import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';

// Configuración de R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

/**
 * POST /api/upload
 * 
 * Recibe una imagen, la convierte a WebP, strip EXIF, y sube a R2.
 * 
 * Body (JSON):
 * - image: string (base64 data URL o base64 puro)
 * - tree_id: number (opcional)
 * - care_log_id: number (opcional)
 * - filename: string (opcional)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { image, tree_id, care_log_id, filename } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Se requiere image (base64)' },
        { status: 400 }
      );
    }

    // Extraer buffer de base64
    let imageBuffer;
    if (image.startsWith('data:')) {
      // Data URL: data:image/jpeg;base64,/9j/4AAQ...
      const base64Data = image.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // Base64 puro
      imageBuffer = Buffer.from(image, 'base64');
    }

    // Convertir a WebP y strip EXIF con Sharp
    const webpBuffer = await sharp(imageBuffer)
      .rotate()  // Auto-rotate based on EXIF
      .webp({ 
        quality: 85,
        effort: 4 
      })
      .toBuffer();

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(8).toString('hex');
    const r2Key = `photos/${timestamp}-${randomId}.webp`;

    // Subir a R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: r2Key,
      Body: webpBuffer,
      ContentType: 'image/webp',
      // Metadata adicional
      Metadata: {
        'tree-id': tree_id?.toString() || '',
        'care-log-id': care_log_id?.toString() || '',
        'original-filename': filename || 'unknown',
      }
    });

    await r2Client.send(command);

    // Construir URL pública
    const r2Url = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${r2Key}`;

    return NextResponse.json({
      success: true,
      photo: {
        r2_key: r2Key,
        r2_url: r2Url,
        file_size_bytes: webpBuffer.length,
        original_filename: filename,
        mime_type: 'image/webp'
      }
    });

  } catch (error) {
    console.error('Error uploading to R2:', error);
    return NextResponse.json(
      { error: 'Error subiendo la foto' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/upload
 * 
 * Sube imagen con metadata de Pl@ntNet o Gemma.
 * 
 * Body (JSON):
 * - r2_key: string (clave del archivo existente)
 * - ai_species: string (opcional)
 * - ai_confidence: number (opcional)
 * - ai_description: string (opcional)
 */
export async function PUT(request) {
  // Esta función se usaría para actualizar metadata de fotos existentes
  // Por ahora, retorna no implementado
  return NextResponse.json(
    { error: 'PUT no implementado aún' },
    { status: 501 }
  );
}
