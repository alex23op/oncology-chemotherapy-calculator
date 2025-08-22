// Strict solvent types for better type safety with volumes
export type SolventType = 
  | "Soluție glucoză 5% 100ml" 
  | "Soluție glucoză 5% 250ml"
  | "Soluție glucoză 5% 500ml"
  | "Soluție NaCl 0.9% 100ml"
  | "Soluție NaCl 0.9% 250ml"
  | "Soluție NaCl 0.9% 500ml"
  | "Ringer Solution"
  | null;

export const AVAILABLE_SOLVENTS: SolventType[] = [
  "Soluție NaCl 0.9% 100ml",
  "Soluție NaCl 0.9% 250ml",
  "Soluție NaCl 0.9% 500ml",
  "Soluție glucoză 5% 100ml",
  "Soluție glucoză 5% 250ml", 
  "Soluție glucoză 5% 500ml",
  "Ringer Solution"
];

export const validateSolventType = (solvent: string | null): solvent is SolventType => {
  if (solvent === null) return true;
  return AVAILABLE_SOLVENTS.includes(solvent as SolventType);
};