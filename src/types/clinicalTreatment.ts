import { Drug, Regimen } from './regimens';

export interface PatientInfo {
  patientId: string;
  fullName?: string;
  weight: number;
  height: number;
  age: number;
  sex: string;
  bsa: number;
  creatinineClearance: number;
  cycleNumber: number;
  treatmentDate: string;
  nextCycleDate?: string;
}

export interface CalculatedDrug extends Drug {
  calculatedDose: string;
  finalDose: string;
  adjustmentNotes?: string;
  preparationInstructions?: string;
  administrationDuration?: string;
  solvent?: string;
}

export interface PremedAgent {
  name: string;
  dosage: string;
  route: string;
  timing: string;
  category: string;
  indication: string;
  rationale?: string;
  administrationDuration?: string;
}

export interface TreatmentData {
  patient: PatientInfo;
  regimen: Regimen;
  calculatedDrugs: CalculatedDrug[];
  emetogenicRisk: {
    level: "high" | "moderate" | "low" | "minimal";
    justification: string;
    acuteRisk: string;
    delayedRisk: string;
  };
  premedications: {
    antiemetics: PremedAgent[];
    infusionReactionProphylaxis: PremedAgent[];
    gastroprotection: PremedAgent[];
    organProtection: PremedAgent[];
    other: PremedAgent[];
  };
  clinicalNotes?: string;
  preparingPharmacist?: string;
  verifyingNurse?: string;
}