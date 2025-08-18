// Type definitions for UI components to replace 'as any' casts

export type BadgeVariant = 
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

export type EmeticRiskLevel = "high" | "moderate" | "low" | "minimal";

export const getRiskBadgeVariant = (level: EmeticRiskLevel): BadgeVariant => {
  switch (level) {
    case "high":
      return "destructive";
    case "moderate":
      return "warning";
    case "low":
      return "secondary";
    case "minimal":
      return "outline";
    default:
      return "default";
  }
};

// Type-safe i18n key generation for solvents
export const getSolventI18nKey = (solvent: string): string => {
  const keyMap: Record<string, string> = {
    "Normal Saline 0.9%": "solvents.normalSaline",
    "Dextrose 5%": "solvents.dextrose5",
    "Ringer Solution": "solvents.ringer",
    "Water for Injection": "solvents.waterForInjection"
  };
  
  return keyMap[solvent] || solvent;
};