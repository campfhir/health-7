#!/usr/bin/env node
/**
 * Migrates ParseResult → Result, .success → .ok, .data → .val, .error → .err.message
 *
 * Run: node migrate-result.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = new URL('./src', import.meta.url).pathname;

// ── helpers ────────────────────────────────────────────────────────────────

function allTsFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...allTsFiles(full));
    else if (extname(full) === '.ts' && !full.endsWith('.d.ts')) files.push(full);
  }
  return files;
}

function relpath(f) {
  return relative(ROOT + '/..', f);
}

// ── transforms ─────────────────────────────────────────────────────────────

function transform(src) {
  let out = src;

  // 1. Type annotation: ParseResult<T> → Result<T>
  out = out.replace(/\bParseResult(<[^>]+>)/g, 'Result$1');

  // 2. Inline single-line ok object:  { success: true, data: X }
  out = out.replace(/\{\s*success:\s*true,\s*data:/g, '{ ok: true, val:');

  // 3. Inline single-line err object:  { success: false, error: X }
  //    Replace the key names only; Err() wrapping is done per-line below.
  out = out.replace(/\{\s*success:\s*false,\s*error:/g, '{ ok: false, err: new Err(');
  // Close the Err() call — value ends just before the closing `}`
  // Pattern: `new Err(VALUE }` → `new Err(VALUE) }`
  out = out.replace(/(new Err\()([^}]+?)(\s*\})/g, '$1$2)$3');

  // 4. Multi-line objects — each key on its own line:
  //      success: false,    →  ok: false,
  //      success: true,     →  ok: true,
  out = out.replace(/^(\s*)success:\s*false,$/gm, '$1ok: false,');
  out = out.replace(/^(\s*)success:\s*true,$/gm, '$1ok: true,');

  //      data: X,           →  val: X,
  out = out.replace(/^(\s*)data:/gm, '$1val:');

  //      error: X,          →  err: new Err(X),
  //    The value ends at the trailing comma.
  out = out.replace(/^(\s*)error:\s*(.+?),\s*$/gm, (_, indent, value) => {
    return `${indent}err: new Err(${value.trim()}),`;
  });

  // 5. Property access: .error  →  .err.message
  //    Handle .error! (non-null) before plain .error
  out = out.replace(/\.error!/g, '.err!.message');
  out = out.replace(/\.error\b/g, '.err.message');

  // 6. Property access: .success → .ok
  out = out.replace(/\.success\b/g, '.ok');

  // 7. Property access: .data → .val
  //    Only replace when it follows a variable-like identifier to avoid
  //    collisions with unrelated `.data` (e.g. HTTP response body, etc.)
  //    Pattern: word char or `]` or `)` or `!` immediately before `.data`
  out = out.replace(/(\w|]|\)|\!)\.data\b/g, '$1.val');

  // 8. Update imports ──────────────────────────────────────────────────────

  // 8a. Replace ParseResult with Result in existing imports from types/parser
  //     e.g. import { ParseResult, ParserUtils } from "../../types/parser"
  //       → import { ParserUtils } from "../../types/parser"
  //     and add a separate Result import from types/result
  out = out.replace(
    /import\s*\{([^}]+)\}\s*from\s*(['"])((?:\.\.\/)*types\/parser)\2/g,
    (match, names, q, path) => {
      const cleaned = names
        .split(',')
        .map(n => n.trim())
        .filter(n => n !== 'ParseResult' && n !== '');
      const parserImport = cleaned.length > 0
        ? `import { ${cleaned.join(', ')} } from ${q}${path}${q}`
        : null;
      return parserImport ?? '';
    }
  );

  // 8b. Add Result import from types/result if file uses Result<
  if (/\bResult</.test(out) && !/from ['"].*types\/result['"]/.test(out)) {
    // Determine the relative path depth by counting leading ../ in existing imports
    const depthMatch = out.match(/from ['"]((\.\.\/)+)/);
    const prefix = depthMatch ? depthMatch[1] : '../../';
    out = `import { Result } from "${prefix}types/result";\n` + out;
  }

  // 8c. Add Err import from utils/err if file uses new Err(
  if (/\bnew Err\(/.test(out) && !/from ['"].*utils\/err['"]/.test(out)) {
    const depthMatch = out.match(/from ['"]((\.\.\/)+)/);
    const prefix = depthMatch ? depthMatch[1] : '../../';
    out = `import { Err } from "${prefix}utils/err";\n` + out;
  }

  return out;
}

// ── main ───────────────────────────────────────────────────────────────────

const files = allTsFiles(ROOT);
let changed = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  const transformed = transform(original);
  if (transformed !== original) {
    if (!DRY_RUN) writeFileSync(file, transformed);
    console.log(`${DRY_RUN ? '[dry]' : 'wrote'} ${relpath(file)}`);
    changed++;
  }
}

console.log(`\n${changed} file(s) ${DRY_RUN ? 'would be' : 'were'} modified.`);
if (DRY_RUN) console.log('Run without --dry-run to apply changes.');
