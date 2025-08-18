#!/usr/bin/env node
/*
  i18n consistency checker - Enhanced version
  - Compares src/locales/en and src/locales/ro JSON files recursively
  - Supports multiple languages (en, ro, fr, es)
  - Detects invalid key formats (keys ending with ':' or other invalid patterns)
  - Reports:
      MISSING in target language: keys present in EN but missing in target
      MISSING in EN: keys present in target but missing in EN
      EMPTY in target language: keys present in both but empty string in target
      INVALID KEYS: keys with invalid formats
  - Exit code: 1 if any issue found (unless --fix resolves everything), else 0
  - Optional: --fix will add missing target language keys using EN values as fallback

  Usage:
    node scripts/check-i18n.js
    node scripts/check-i18n.js --fix
    node scripts/check-i18n.js --languages en,ro,fr,es
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LOCALE_DIR = path.join(ROOT, 'src', 'locales');

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const LANGUAGES_ARG = args.find(arg => arg.startsWith('--languages='));
const LANGUAGES = LANGUAGES_ARG 
  ? LANGUAGES_ARG.split('=')[1].split(',')
  : ['en', 'ro'];

const PRIMARY_LANG = LANGUAGES[0]; // Usually 'en'
const TARGET_LANGUAGES = LANGUAGES.slice(1);

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
    console.warn(`Warning: Could not read ${filePath}: ${e.message}`);
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

function unflatten(flatObj) {
  const result = {};
  for (const [key, value] of Object.entries(flatObj)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

// Validation functions for key formats
function isValidKey(key) {
  // Check for invalid patterns
  if (key.endsWith(':') || key.endsWith('.')) return false;
  if (key.includes('..') || key.includes('.:') || key.includes(':.')) return false;
  if (key.trim() !== key) return false; // No leading/trailing spaces
  return true;
}

function suggestKeyCorrection(key) {
  // Remove trailing invalid characters
  let corrected = key.replace(/[:.]$/, '');
  
  // Fix double dots
  corrected = corrected.replace(/\.+/g, '.');
  
  return corrected;
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
  const primaryDir = path.join(LOCALE_DIR, PRIMARY_LANG);
  const primaryFiles = listJsonFiles(primaryDir);

  const localeData = new Map();
  
  // Load primary language data
  localeData.set(PRIMARY_LANG, new Map());
  for (const rel of primaryFiles) {
    const filePath = path.join(primaryDir, rel);
    const obj = readJson(filePath);
    localeData.get(PRIMARY_LANG).set(rel, { raw: obj, flat: flatten(obj) });
  }

  // Load target language data
  for (const lang of TARGET_LANGUAGES) {
    const langDir = path.join(LOCALE_DIR, lang);
    localeData.set(lang, new Map());
    
    for (const rel of primaryFiles) {
      const filePath = path.join(langDir, rel);
      const obj = fs.existsSync(filePath) ? readJson(filePath) : {};
      localeData.get(lang).set(rel, { raw: obj, flat: flatten(obj) });
    }
  }

  return { primaryFiles, localeData };
}

function computeDiffs(primaryFiles, localeData) {
  const issues = {};
  
  for (const lang of TARGET_LANGUAGES) {
    issues[lang] = {
      missingInTarget: [],
      missingInPrimary: [],
      emptyInTarget: [],
      invalidKeys: []
    };
  }

  const primaryData = localeData.get(PRIMARY_LANG);

  for (const rel of primaryFiles) {
    const primaryFlat = primaryData.get(rel)?.flat || {};
    
    // Check for invalid keys in primary language
    for (const key of Object.keys(primaryFlat)) {
      if (!isValidKey(key)) {
        console.warn(`Invalid key format in ${PRIMARY_LANG}/${rel}: ${key} -> suggested: ${suggestKeyCorrection(key)}`);
      }
    }

    // Check each target language
    for (const lang of TARGET_LANGUAGES) {
      const targetFlat = localeData.get(lang).get(rel)?.flat || {};
      
      // Check for invalid keys in target language
      for (const key of Object.keys(targetFlat)) {
        if (!isValidKey(key)) {
          issues[lang].invalidKeys.push(`${rel.replace(/\\/g, '/')}:${key} -> suggested: ${suggestKeyCorrection(key)}`);
        }
      }

      const primaryKeys = Object.keys(primaryFlat);
      const targetKeys = Object.keys(targetFlat);

      for (const k of primaryKeys) {
        if (!(k in targetFlat)) {
          issues[lang].missingInTarget.push(`${rel.replace(/\\/g, '/')}:${k}`);
        } else if (targetFlat[k] === '') {
          issues[lang].emptyInTarget.push(`${rel.replace(/\\/g, '/')}:${k}`);
        }
      }
      
      for (const k of targetKeys) {
        if (!(k in primaryFlat)) {
          issues[lang].missingInPrimary.push(`${rel.replace(/\\/g, '/')}:${k}`);
        }
      }
    }
  }

  // Sort all arrays
  for (const lang of TARGET_LANGUAGES) {
    Object.keys(issues[lang]).forEach(key => {
      issues[lang][key] = issues[lang][key].sort();
    });
  }

  return issues;
}

function applyFix(primaryFiles, localeData) {
  let totalFixes = 0;
  const primaryData = localeData.get(PRIMARY_LANG);

  for (const lang of TARGET_LANGUAGES) {
    const langData = localeData.get(lang);
    
    for (const rel of primaryFiles) {
      const primaryEntry = primaryData.get(rel);
      const targetEntry = langData.get(rel) || { raw: {}, flat: {} };
      
      const primaryFlat = primaryEntry?.flat || {};
      const targetFlat = targetEntry.flat || {};
      const targetRaw = targetEntry.raw || {};

      let fileChanged = false;

      for (const k of Object.keys(primaryFlat)) {
        if (!(k in targetFlat) || targetFlat[k] === '') {
          const val = getByPath(primaryEntry.raw, k);
          setByPath(targetRaw, k, val);
          totalFixes++;
          fileChanged = true;
        }
      }

      if (fileChanged) {
        const targetPath = path.join(LOCALE_DIR, lang, rel);
        writeJson(targetPath, targetRaw);
        console.log(`Updated ${lang}/${rel}`);
      }
    }
  }

  return totalFixes;
}

function main() {
  console.log(`Checking i18n consistency for languages: ${LANGUAGES.join(', ')}`);
  console.log(`Primary language: ${PRIMARY_LANG}`);
  console.log(`Target languages: ${TARGET_LANGUAGES.join(', ')}`);

  const { primaryFiles, localeData } = collectAllKeysByLocale();

  if (primaryFiles.length === 0) {
    console.log('No locale files found.');
    process.exit(0);
  }

  let issues = computeDiffs(primaryFiles, localeData);

  if (FIX) {
    const fixed = applyFix(primaryFiles, localeData);
    console.log(`--fix applied: added ${fixed} missing keys with ${PRIMARY_LANG} fallbacks.`);
    
    // Recompute after fixing
    const recomputed = collectAllKeysByLocale();
    issues = computeDiffs(recomputed.primaryFiles, recomputed.localeData);
  }

  let hasIssues = false;

  const printSection = (title, arr) => {
    console.log(`\n${title}`);
    if (!arr.length) {
      console.log('  - none -');
    } else {
      hasIssues = true;
      for (const item of arr) console.log(`  • ${item}`);
    }
  };

  for (const lang of TARGET_LANGUAGES) {
    console.log(`\n=== ${lang.toUpperCase()} Language Issues ===`);
    printSection(`MISSING in ${lang.toUpperCase()}`, issues[lang].missingInTarget);
    printSection(`MISSING in ${PRIMARY_LANG.toUpperCase()}`, issues[lang].missingInPrimary);
    printSection(`EMPTY in ${lang.toUpperCase()}`, issues[lang].emptyInTarget);
    printSection(`INVALID KEYS in ${lang.toUpperCase()}`, issues[lang].invalidKeys);
  }

  if (hasIssues) {
    if (!FIX) {
      console.error('\nFound i18n inconsistencies. Run with --fix to autofill missing keys using EN values.');
    } else {
      console.error('\nSome inconsistencies remain after --fix (likely EMPTY values or INVALID KEYS). Please review manually.');
    }
    process.exit(1);
  } else {
    console.log(`\n✔ i18n keys are consistent across all languages: ${LANGUAGES.join(', ')}.`);
    process.exit(0);
  }
}

main();