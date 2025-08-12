#!/usr/bin/env node
/*
  i18n consistency checker
  - Compares src/locales/en and src/locales/ro JSON files recursively
  - Reports:
      MISSING in RO: keys present in EN but missing in RO
      MISSING in EN: keys present in RO but missing in EN
      EMPTY in RO: keys present in both but empty string in RO
  - Exit code: 1 if any issue found (unless --fix resolves everything), else 0
  - Optional: --fix will add missing RO keys using EN values as fallback

  Usage:
    node scripts/check-i18n.js
    node scripts/check-i18n.js --fix
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EN_DIR = path.join(ROOT, 'src', 'locales', 'en');
const RO_DIR = path.join(ROOT, 'src', 'locales', 'ro');

const args = process.argv.slice(2);
const FIX = args.includes('--fix');

function listJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(current, base) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(current, e.name);
      const rel = path.relative(base, full);
      if (e.isDirectory()) walk(full, base);
      else if (e.isFile() && e.name.endsWith('.json')) out.push(rel);
    }
  })(dir, dir);
  return out.sort();
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function writeJson(filePath, obj) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function flatten(obj, prefix = '') {
  const result = {};
  if (obj == null) return result;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      Object.assign(result, flatten(v, key));
    } else {
      result[key] = v;
    }
  }
  return result;
}

function getByPath(obj, dotPath) {
  return dotPath.split('.').reduce((acc, p) => (acc && acc[p] !== undefined ? acc[p] : undefined), obj);
}

function setByPath(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      cur[p] = value;
    } else {
      if (typeof cur[p] !== 'object' || cur[p] === null || Array.isArray(cur[p])) cur[p] = {};
      cur = cur[p];
    }
  }
}

function collectAllKeysByLocale() {
  const enFiles = listJsonFiles(EN_DIR);
  const roFiles = listJsonFiles(RO_DIR);

  const allFiles = Array.from(new Set([...enFiles, ...roFiles])).sort();

  const enMap = new Map(); // fileRel -> {raw, flat}
  const roMap = new Map();

  for (const rel of allFiles) {
    const enPath = path.join(EN_DIR, rel);
    const roPath = path.join(RO_DIR, rel);
    const enObj = fs.existsSync(enPath) ? readJson(enPath) : {};
    const roObj = fs.existsSync(roPath) ? readJson(roPath) : {};

    enMap.set(rel, { raw: enObj, flat: flatten(enObj) });
    roMap.set(rel, { raw: roObj, flat: flatten(roObj) });
  }

  return { allFiles, enMap, roMap };
}

function computeDiffs(enMap, roMap) {
  const missingInRO = [];
  const missingInEN = [];
  const emptyInRO = [];

  for (const [rel, { flat: enFlat }] of enMap.entries()) {
    const roFlat = roMap.get(rel)?.flat || {};

    const enKeys = Object.keys(enFlat);
    const roKeys = Object.keys(roFlat);

    for (const k of enKeys) {
      if (!(k in roFlat)) missingInRO.push(`${rel.replace(/\\/g, '/')}:${k}`);
      else if (roFlat[k] === '') emptyInRO.push(`${rel.replace(/\\/g, '/')}:${k}`);
    }
    for (const k of roKeys) {
      if (!(k in enFlat)) missingInEN.push(`${rel.replace(/\\/g, '/')}:${k}`);
    }
  }

  return {
    missingInRO: missingInRO.sort(),
    missingInEN: missingInEN.sort(),
    emptyInRO: emptyInRO.sort(),
  };
}

function applyFix(enMap, roMap) {
  let fixes = 0;
  for (const [rel, { raw: enRaw, flat: enFlat }] of enMap.entries()) {
    const roEntry = roMap.get(rel) || { raw: {}, flat: {} };
    const roRaw = roEntry.raw || {};
    const roFlat = roEntry.flat || {};

    for (const k of Object.keys(enFlat)) {
      if (!(k in roFlat)) {
        const val = getByPath(enRaw, k);
        setByPath(roRaw, k, val);
        fixes++;
      }
    }

    // Write back the updated RO file if any change was applied
    const roPath = path.join(RO_DIR, rel);
    writeJson(roPath, roRaw);
  }
  return fixes;
}

function main() {
  const { allFiles, enMap, roMap } = collectAllKeysByLocale();

  if (allFiles.length === 0) {
    console.log('No locale files found.');
    process.exit(0);
  }

  let { missingInRO, missingInEN, emptyInRO } = computeDiffs(enMap, roMap);

  if (FIX) {
    const fixed = applyFix(enMap, roMap);
    // Recompute after fixing
    const recomputed = collectAllKeysByLocale();
    ({ missingInRO, missingInEN, emptyInRO } = computeDiffs(recomputed.enMap, recomputed.roMap));
    console.log(`--fix applied: added ${fixed} missing RO keys with EN fallbacks.`);
  }

  const hasIssues = missingInRO.length || missingInEN.length || emptyInRO.length;

  const printSection = (title, arr) => {
    console.log(`\n${title}`);
    if (!arr.length) {
      console.log('  - none -');
    } else {
      for (const k of arr) console.log(`  • ${k}`);
    }
  };

  printSection('MISSING in RO', missingInRO);
  printSection('MISSING in EN', missingInEN);
  printSection('EMPTY in RO', emptyInRO);

  if (hasIssues) {
    if (!FIX) {
      console.error('\nFound i18n inconsistencies. Run with --fix to autofill missing RO keys using EN values.');
    } else {
      console.error('\nSome inconsistencies remain after --fix (likely EMPTY values). Please review.');
    }
    process.exit(hasIssues ? 1 : 0);
  } else {
    console.log('\n✔ i18n keys are consistent between EN and RO.');
    process.exit(0);
  }
}

main();
