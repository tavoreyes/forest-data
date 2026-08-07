#!/usr/bin/env node
/**
 * Checkpoint Protocol for ForestData
 * 
 * Gestiona checkpoints automáticos cada N mensajes para optimizar tokens.
 * Uso: node .claude/scripts/checkpoint.js [--trigger] [--resume] [--list]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const CHECKPOINT_DIR = path.join(PROJECT_ROOT, '.claude', 'checkpoints');
const CONFIG_PATH = path.join(PROJECT_ROOT, '.claude', 'config.json');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch {
    return { checkpointProtocol: { triggerMessageCount: 15, summaryMaxTokens: 500 } };
  }
}

function ensureCheckpointDir() {
  if (!fs.existsSync(CHECKPOINT_DIR)) {
    fs.mkdirSync(CHECKPOINT_DIR, { recursive: true });
  }
}

function getSessionFile() {
  const today = new Date().toISOString().split('T')[0];
  return path.join(CHECKPOINT_DIR, `session-${today}.jsonl`);
}

function countMessages() {
  const sessionFile = getSessionFile();
  if (!fs.existsSync(sessionFile)) return 0;
  const content = fs.readFileSync(sessionFile, 'utf-8').trim();
  return content ? content.split('\n').length : 0;
}

function createDenseSummary(messages, maxTokens = 500) {
  const relevant = messages.filter(m => m.role !== 'system' || m.content.includes('DECISION') || m.content.includes('LEARNED'));
  const summary = relevant.map(m => {
    const prefix = m.role === 'user' ? 'U:' : m.role === 'assistant' ? 'A:' : 'S:';
    const content = m.content.slice(0, 200).replace(/\n/g, ' ');
    return `${prefix} ${content}`;
  }).join('\n');
  
  const approxTokens = summary.length / 4;
  if (approxTokens > maxTokens) {
    return summary.slice(0, maxTokens * 4) + '\n... [truncado]';
  }
  return summary;
}

function saveCheckpoint(summary, contextoMd, nextStep) {
  ensureCheckpointDir();
  const timestamp = new Date().toISOString();
  const checkpoint = {
    timestamp,
    messageCount: countMessages(),
    summary,
    contextoMd: contextoMd.slice(0, 2000),
    nextStep
  };
  
  const checkpointFile = path.join(CHECKPOINT_DIR, `checkpoint-${timestamp.replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(checkpointFile, JSON.stringify(checkpoint, null, 2));
  
  const sessionFile = getSessionFile();
  fs.appendFileSync(sessionFile, JSON.stringify(checkpoint) + '\n');
  
  return checkpointFile;
}

function loadLatestCheckpoint() {
  ensureCheckpointDir();
  const files = fs.readdirSync(CHECKPOINT_DIR)
    .filter(f => f.startsWith('checkpoint-') && f.endsWith('.json'))
    .sort()
    .reverse();
  
  if (files.length === 0) return null;
  
  return JSON.parse(fs.readFileSync(path.join(CHECKPOINT_DIR, files[0]), 'utf-8'));
}

function generateResumePrompt(checkpoint) {
  const config = loadConfig();
  const template = config.checkpointProtocol?.resumePromptTemplate || 
    '[RESUMEN DE SESIÓN ANTERIOR]\n{dense_summary}\n\n---\nCONTEXTO ACTUAL: {contexto_md}\nPRÓXIMO PASO: {next_step}\n\nContinúa desde aquí.';
  
  return template
    .replace('{dense_summary}', checkpoint.summary)
    .replace('{contexto_md}', checkpoint.contextoMd)
    .replace('{next_step}', checkpoint.nextStep);
}

function triggerCheckpoint(contextoMd, nextStep) {
  const msgCount = countMessages();
  const config = loadConfig();
  const trigger = config.checkpointProtocol?.triggerMessageCount || 15;
  
  if (msgCount >= trigger) {
    console.log(`[CHECKPOINT] Trigger: ${msgCount} mensajes (límite: ${trigger})`);
    const sessionFile = getSessionFile();
    let messages = [];
    if (fs.existsSync(sessionFile)) {
      messages = fs.readFileSync(sessionFile, 'utf-8')
        .trim().split('\n')
        .map(line => { try { return JSON.parse(line); } catch { return null; } })
        .filter(Boolean);
    }
    
    const summary = createDenseSummary(messages, config.checkpointProtocol?.summaryMaxTokens || 500);
    const checkpointFile = saveCheckpoint(summary, contextoMd, nextStep);
    const resumePrompt = generateResumePrompt({ summary, contextoMd, nextStep });
    
    console.log(`[CHECKPOINT] Guardado en: ${checkpointFile}`);
    console.log('\n--- PROMPT DE RESUMEN PARA NUEVA SESIÓN ---\n');
    console.log(resumePrompt);
    console.log('\n--- FIN PROMPT ---\n');
    
    return { triggered: true, resumePrompt, checkpointFile };
  }
  
  return { triggered: false, messageCount: msgCount, threshold: trigger };
}

function listCheckpoints() {
  if (!fs.existsSync(CHECKPOINT_DIR)) {
    console.log('No hay checkpoints aún.');
    return;
  }
  
  const files = fs.readdirSync(CHECKPOINT_DIR)
    .filter(f => f.startsWith('checkpoint-') && f.endsWith('.json'))
    .sort()
    .reverse();
  
  console.log(`\nCheckpoints encontrados: ${files.length}\n`);
  files.forEach(f => {
    const cp = JSON.parse(fs.readFileSync(path.join(CHECKPOINT_DIR, f), 'utf-8'));
    console.log(`  ${cp.timestamp} | ${cp.messageCount} msgs | ${cp.nextStep}`);
  });
}

const args = process.argv.slice(2);
const comando = args[0];

switch (comando) {
  case '--trigger': {
    const contextoMd = fs.readFileSync(path.join(PROJECT_ROOT, 'CONTEXTO.md'), 'utf-8');
    const nextStep = args[1] || 'Continuar tarea actual';
    triggerCheckpoint(contextoMd, nextStep);
    break;
  }
  case '--resume': {
    const cp = loadLatestCheckpoint();
    if (cp) {
      console.log(generateResumePrompt(cp));
    } else {
      console.log('No hay checkpoint previo.');
    }
    break;
  }
  case '--list':
    listCheckpoints();
    break;
  case 'boot':
    const cp = loadLatestCheckpoint();
    if (cp) {
      console.log(generateResumePrompt(cp));
    } else {
      console.log('No hay checkpoint previo. Iniciando sesión fresca.');
      console.log('---');
      const contextoMd = fs.readFileSync(path.join(PROJECT_ROOT, 'CONTEXTO.md'), 'utf-8');
      console.log('CONTEXTO ACTUAL:');
      console.log(contextoMd.slice(0, 2000));
    }
    break;
  case 'close': {
    const contextoMd = fs.readFileSync(path.join(PROJECT_ROOT, 'CONTEXTO.md'), 'utf-8');
    const nextStep = args.slice(1).join(' ') || 'Continuar tarea actual';
    // close siempre guarda checkpoint (force)
    const sessionFile = getSessionFile();
    let messages = [];
    if (fs.existsSync(sessionFile)) {
      const content = fs.readFileSync(sessionFile, 'utf-8').trim();
      if (content) {
        messages = content.split('\n')
          .map(line => { try { const parsed = JSON.parse(line); return parsed && parsed.content ? parsed : null; } catch { return null; } })
          .filter(Boolean);
      }
    }
    const config = loadConfig();
    const summary = createDenseSummary(messages, config.checkpointProtocol?.summaryMaxTokens || 500);
    const checkpointFile = saveCheckpoint(summary, contextoMd, nextStep);
    const resumePrompt = generateResumePrompt({ summary, contextoMd, nextStep });
    
    console.log(`[CHECKPOINT] Guardado en: ${checkpointFile}`);
    console.log('\n--- PROMPT DE RESUMEN PARA NUEVA SESIÓN ---\n');
    console.log(resumePrompt);
    console.log('\n--- FIN PROMPT ---\n');
    break;
  }
  default:
    console.log(`
Uso: node .claude/scripts/checkpoint.js [comando]

Comandos:
  boot                      Inicia sesión: muestra resumen previo + CONTEXTO.md
  close [próximo_paso]      Cierra sesión: guarda checkpoint + actualiza próximo paso
  --trigger [siguiente_paso] Verifica y crea checkpoint si aplica (auto @15 msgs)
  --resume                  Genera prompt de reanudación del último checkpoint
  --list                    Lista todos los checkpoints guardados

Integración recomendada:
  - Al iniciar sesión: boot
  - Al cerrar sesión: close "próximo paso"
  - Durante sesión: auto-checkpoint cada 15 mensajes
`);
}