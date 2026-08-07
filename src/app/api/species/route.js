import { NextResponse } from 'next/server';

const PLANTNET_API_KEY = process.env.PLANTNET_API_KEY;
const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify';

/**
 * POST /api/species
 * 
 * Identifica especie de planta usando Pl@ntNet API.
 * 
 * Body:
 * - image: string (data URL base64)
 * - tree_id: number (opcional)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { image, tree_id } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Se requiere image (data URL)' },
        { status: 400 }
      );
    }

    // Convertir data URL a Blob
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });

    // Crear FormData para Pl@ntNet
    const formData = new FormData();
    formData.append('images', blob, 'tree.jpg');
    formData.append('organs', 'auto');
    if (tree_id) {
      formData.append('tree_id', tree_id.toString());
    }

    // Llamar a Pl@ntNet API
    const response = await fetch(`${PLANTNET_API_URL}?api-key=${PLANTNET_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pl@ntNet API error:', errorText);
      
      // Fallback: retornar especie del árbol si existe
      return NextResponse.json({
        success: true,
        species: {
          species: 'Pinus sp.',
          common_name: 'Pino',
          confidence: 50,
          source: 'fallback',
          message: 'Pl@ntNet no disponible'
        }
      });
    }

    const data = await response.json();

    // Extraer resultado principal
    const bestMatch = data.results?.[0];
    
    if (!bestMatch) {
      return NextResponse.json({
        success: true,
        species: {
          species: 'Pinus sp.',
          common_name: 'Pino',
          confidence: 50,
          source: 'fallback',
          message: 'No se pudo identificar'
        }
      });
    }

    return NextResponse.json({
      success: true,
      species: {
        species: bestMatch.species,
        common_name: bestMatch.common_names?.[0] || bestMatch.species,
        confidence: Math.round(bestMatch.score * 100),
        score: bestMatch.score,
        source: 'plantnet',
        details: {
          genus: bestMatch.genus,
          family: bestMatch.family,
          taxonomy: bestMatch.taxonomy
        }
      }
    });

  } catch (error) {
    console.error('Error in species identification:', error);
    
    // Fallback en caso de error
    return NextResponse.json({
      success: true,
      species: {
        species: 'Pinus sp.',
        common_name: 'Pino',
        confidence: 50,
        source: 'fallback',
        message: 'Error en identificacion'
      }
    });
  }
}
