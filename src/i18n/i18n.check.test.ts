import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const EN_DIR = path.join(ROOT, 'src', 'locales', 'en');
const RO_DIR = path.join(ROOT, 'src', 'locales', 'ro');

function listJsonFiles(dir: string) {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(current: string, base: string) {
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

function readJson(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {} as Record<string, unknown>;
  }
}

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (obj == null) return result;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      Object.assign(result, flatten(v as Record<string, any>, key));
    } else {
      result[key] = v as unknown;
    }
  }
  return result;
}

describe('i18n keys consistency (EN vs RO)', () => {
  it('has no missing or empty keys', () => {
    const enFiles = listJsonFiles(EN_DIR);
    const roFiles = listJsonFiles(RO_DIR);
    const allFiles = Array.from(new Set([...enFiles, ...roFiles])).sort();

    const missingInRO: string[] = [];
    const missingInEN: string[] = [];
    const emptyInRO: string[] = [];

    for (const rel of allFiles) {
      const enObj = readJson(path.join(EN_DIR, rel));
      const roObj = readJson(path.join(RO_DIR, rel));
      const enFlat = flatten(enObj);
      const roFlat = flatten(roObj);

      for (const k of Object.keys(enFlat)) {
        if (!(k in roFlat)) missingInRO.push(`${rel}:${k}`);
        else if (roFlat[k] === '') emptyInRO.push(`${rel}:${k}`);
      }
      for (const k of Object.keys(roFlat)) {
        if (!(k in enFlat)) missingInEN.push(`${rel}:${k}`);
      }
    }

    const debug = [
      `MISSING in RO (count ${missingInRO.length})\n${missingInRO.join('\n')}`,
      `MISSING in EN (count ${missingInEN.length})\n${missingInEN.join('\n')}`,
      `EMPTY in RO (count ${emptyInRO.length})\n${emptyInRO.join('\n')}`,
    ].join('\n\n');

    expect({ debug, missingInRO, missingInEN, emptyInRO }).toMatchObject({
      missingInRO: [],
      missingInEN: [],
      emptyInRO: [],
    });
  });
});
