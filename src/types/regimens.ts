export interface Biomarker {
  name: string;
  status: "positive" | "negative" | "wild-type" | "mutated" | "amplified" | "high" | "low" | "unknown";
  testingMethod?: string;
  threshold?: string;
  required: boolean;
  turnaroundTime?: string;
}

export interface DrugInteraction {
  drug: string;
  severity: "major" | "moderate" | "minor";
  effect: string;
  management: string;
}

export interface Drug {
  name: string;
  dosage: string;
  unit: string;
  route: string;
  day?: string;
  notes?: string;
  dilution?: string;
  administrationDuration?: string;
  drugClass?: "chemotherapy" | "targeted" | "immunotherapy" | "hormone" | "supportive";
  mechanismOfAction?: string;
  monitoring?: string[];
  availableSolvents?: string[];
  availableVolumes?: number[];
  solvent?: string;
  volume?: number;
}

export interface Premedication {
  name: string;
  dosage: string;
  unit: string;
  route: string;
  timing: string;
  dilution?: string;
  category: "antiemetic" | "corticosteroid" | "antihistamine" | "h2_blocker" | "bronchodilator" | "other";
  indication: string;
  isRequired: boolean;
  isStandard: boolean;
  administrationDuration?: string;
  weightBased?: boolean;
  notes?: string;
}

export interface Regimen {
  id: string;
  name: string;
  description: string;
  category: "neoadjuvant" | "adjuvant" | "advanced" | "metastatic" | "maintenance" | "general" | "perioperative";
  subtype?: string;
  lineOfTherapy?: "first-line" | "second-line" | "third-line" | "maintenance" | "salvage";
  drugs: Drug[];
  premedications?: Premedication[];
  schedule: string;
  cycles: number | string;
  biomarkerRequirements?: Biomarker[];
  eligibilityCriteria?: {
    ecogStatus: number[];
    biomarkers?: string[];
    contraindications?: string[];
  };
  mechanismOfAction?: string;
  responseRates?: {
    overall: number;
    progressionFreeSurvival: string;
  };
  drugInteractions?: DrugInteraction[];
  clinicalTrials?: string[];
}

export interface CancerType {
  id: string;
  name: string;
  category: string;
  regimens: Regimen[];
}