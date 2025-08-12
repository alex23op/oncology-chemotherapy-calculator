export function toKg(weight: number, unit: 'kg' | 'lbs'): number {
  const w = Number.isFinite(weight) ? weight : 0;
  return unit === 'lbs' ? w * 0.453592 : w;
}
