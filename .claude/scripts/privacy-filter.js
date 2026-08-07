#!/usr/bin/env node
/**
 * Privacy Filter for ForestData Auto-Memory
 * 
 * Filtra contenido sensible (<private>...</private>) antes de persistir en memoria.
 * Uso: node .claude/scripts/privacy-filter.js < input.txt > output.txt
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(__filename), '..', '..');

const PRIVATE_PATTERNS = [
  // Tags explícitos
  /<private>[\s\S]*?<\/private>/gi,
  
  // Datos de alumnos (nunca en memoria persistente)
  /\b(matricula|matrícula|nombre\s+completo|apellido|curp|rfc)\s*[:=]\s*\S+/gi,
  /\b\d{8,12}\b/g,  // Posibles matrículas/CURP
  
  // Ubicaciones exactas (solo referencias, no coords reales)
  /latitude\s*[:=]\s*-?\d+\.\d+/gi,
  /longitude\s*[:=]\s*-?\d+\.\d+/gi,
  /gps_accuracy_m\s*[:=]\s*\d+/gi,
  
  // Secrets y credenciales
  /(api[_-]?key|secret|token|password|credential)\s*[:=]\s*\S+/gi,
  /(sk|pk)_[a-zA-Z0-9]{20,}/g,
  
  // Emails personales
  /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
  
  // Teléfonos
  /(\+?52\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{4}[\s-]?\d{4}/g,
];

const WHITELIST_PATTERNS = [
  // Coordenadas de ejemplo/test (rango CDMX aprox)
  /latitude\s*[:=]\s*19\.\d+/gi,
  /longitude\s*[:=]\s*-99\.\d+/gi,
  // Emails institucionales permitidos
  /@(cecytem|edu\.mx|gmail\.com)(?=\s|$)/gi,
];

function filterPrivate(text) {
  let cleaned = text;
  
  // Primero proteger whitelist
  const protectedSpans = [];
  WHITELIST_PATTERNS.forEach((pattern, i) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      protectedSpans.push({ start: match.index, end: match.index + match[0].length, placeholder: `__WHITELIST_${i}_${protectedSpans.length}__` });
    }
  });
  
  // Ordenar por posición inversa para no romper índices
  protectedSpans.sort((a, b) => b.start - a.start);
  
  protectedSpans.forEach(span => {
    cleaned = cleaned.slice(0, span.start) + span.placeholder + cleaned.slice(span.end);
  });
  
  // Aplicar filtros de privacidad
  PRIVATE_PATTERNS.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '[FILTRADO]');
  });
  
  // Restaurar whitelist
  protectedSpans.forEach(span => {
    cleaned = cleaned.replace(span.placeholder, text.slice(span.start, span.end));
  });
  
  return cleaned;
}

function processFile(inputPath, outputPath) {
  const input = fs.readFileSync(inputPath, 'utf-8');
  const output = filterPrivate(input);
  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`[PRIVACY] Procesado: ${inputPath} -> ${outputPath}`);
  console.log(`  Original: ${input.length} chars | Filtrado: ${output.length} chars`);
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0) {
  // Stdin -> stdout
  let input = '';
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    console.log(filterPrivate(input));
  });
} else if (args.length === 1) {
  // Archivo -> stdout
  const input = fs.readFileSync(args[0], 'utf-8');
  console.log(filterPrivate(input));
} else if (args.length === 2) {
  // Archivo -> archivo
  processFile(args[0], args[1]);
} else {
  console.error('Uso: privacy-filter.js [input] [output?]');
  process.exit(1);
}