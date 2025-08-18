// Strict solvent types for better type safety
export type SolventType = 
  | "Normal Saline 0.9%" 
  | "Dextrose 5%" 
  | "Ringer Solution" 
  | "Water for Injection"
  | null;

export const AVAILABLE_SOLVENTS: SolventType[] = [
  "Normal Saline 0.9%",
  "Dextrose 5%", 
  "Ringer Solution",
  "Water for Injection"
];

export const validateSolventType = (solvent: string | null): solvent is SolventType => {
  if (solvent === null) return true;
  return AVAILABLE_SOLVENTS.includes(solvent as SolventType);
};