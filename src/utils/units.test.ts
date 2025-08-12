import { describe, it, expect } from 'vitest';
import { toKg } from './units';

describe('units.toKg', () => {
  it('returns same value for kg', () => {
    expect(toKg(70, 'kg')).toBe(70);
  });
  it('converts lbs to kg', () => {
    expect(Math.round(toKg(154.324, 'lbs'))).toBe(70);
  });
  it('handles non-finite numbers gracefully', () => {
    expect(toKg(Number.NaN, 'kg')).toBe(0);
  });
});
