import { z } from "zod";

// Enhanced type safety with Zod schemas
export const DrugSchema = z.object({
  name: z.string().min(1, "Drug name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  unit: z.enum(["mg/m²", "mg/kg", "mg", "AUC", "units", "g/m²"], {
    errorMap: () => ({ message: "Invalid unit specified" })
  }),
  route: z.enum(["IV", "PO", "SC", "IM", "Intravesical", "IT", "Inhalation"], {
    errorMap: () => ({ message: "Invalid route specified" })
  }),
  day: z.string().optional(),
  notes: z.string().optional(),
  dilution: z.string().optional(),
  administrationDuration: z.string().optional(),
  drugClass: z.enum(["chemotherapy", "targeted", "immunotherapy", "hormone", "supportive"]).optional(),
  mechanismOfAction: z.string().optional(),
  monitoring: z.array(z.string()).optional(),
  availableSolvents: z.array(z.enum(["NS", "D5W", "Normal Saline 0.9%", "Dextrose 5%", "Ringer Solution", "Water for Injection"])).optional(),
  availableVolumes: z.array(z.number().positive()).optional(),
  solvent: z.string().optional(),
  volume: z.number().positive().optional(),
});

export const PremedicationSchema = z.object({
  name: z.string().min(1, "Premedication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  unit: z.string().min(1, "Unit is required"),
  route: z.enum(["IV", "PO", "SC", "IM"]),
  timing: z.string().min(1, "Timing is required"),
  dilution: z.string().optional(),
  category: z.enum(["antiemetic", "corticosteroid", "antihistamine", "h2_blocker", "bronchodilator", "other"]),
  indication: z.string().min(1, "Indication is required"),
  isRequired: z.boolean(),
  isStandard: z.boolean(),
  administrationDuration: z.string().optional(),
  weightBased: z.boolean().optional(),
  notes: z.string().optional(),
});

export const BiomarkerSchema = z.object({
  name: z.string().min(1, "Biomarker name is required"),
  status: z.enum(["positive", "negative", "wild-type", "mutated", "amplified", "high", "low", "unknown"]),
  testingMethod: z.string().optional(),
  threshold: z.string().optional(),
  required: z.boolean(),
  turnaroundTime: z.string().optional(),
});

export const RegimenSchema = z.object({
  id: z.string().min(1, "Regimen ID is required"),
  name: z.string().min(1, "Regimen name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["neoadjuvant", "adjuvant", "advanced", "metastatic", "maintenance", "general", "perioperative"]),
  subtype: z.string().optional(),
  lineOfTherapy: z.enum(["first-line", "second-line", "third-line", "maintenance", "salvage"]).optional(),
  drugs: z.array(DrugSchema).min(1, "At least one drug is required"),
  premedications: z.array(PremedicationSchema).optional(),
  schedule: z.string().min(1, "Schedule is required"),
  cycles: z.union([z.number().positive(), z.literal("Until progression")]),
  biomarkerRequirements: z.array(BiomarkerSchema).optional(),
  eligibilityCriteria: z.object({
    ecogStatus: z.array(z.number().min(0).max(4)),
    biomarkers: z.array(z.string()).optional(),
    contraindications: z.array(z.string()).optional(),
  }).optional(),
  mechanismOfAction: z.string().optional(),
  responseRates: z.object({
    overall: z.number().min(0).max(100),
    progressionFreeSurvival: z.string(),
  }).optional(),
  drugInteractions: z.array(z.object({
    drug: z.string(),
    severity: z.enum(["major", "moderate", "minor"]),
    effect: z.string(),
    management: z.string(),
  })).optional(),
  clinicalTrials: z.array(z.string()).optional(),
});

export const CancerTypeSchema = z.object({
  id: z.string().min(1, "Cancer type ID is required"),
  name: z.string().min(1, "Cancer type name is required"),
  category: z.string().min(1, "Category is required"),
  regimens: z.array(RegimenSchema).min(1, "At least one regimen is required"),
});

// Enhanced validation functions
export const validateRegimen = (regimen: unknown): regimen is z.infer<typeof RegimenSchema> => {
  try {
    RegimenSchema.parse(regimen);
    return true;
  } catch (error) {
    console.error(`Regimen validation failed:`, error);
    return false;
  }
};

export const validateCancerType = (cancerType: unknown): cancerType is z.infer<typeof CancerTypeSchema> => {
  try {
    CancerTypeSchema.parse(cancerType);
    return true;
  } catch (error) {
    console.error(`Cancer type validation failed:`, error);
    return false;
  }
};

// Type exports
export type ValidatedDrug = z.infer<typeof DrugSchema>;
export type ValidatedRegimen = z.infer<typeof RegimenSchema>;
export type ValidatedCancerType = z.infer<typeof CancerTypeSchema>;