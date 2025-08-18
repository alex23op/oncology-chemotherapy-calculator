import { Drug, Regimen } from './regimens';
import { SolventType } from './solvents';

export interface PatientInfo {
  cnp: string;
  foNumber?: string;
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
  solvent: SolventType;
}

export interface PremedAgent {
  name: string;
  category: string;
  class: string;
  dosage: string;
  unit: string;
  route: string;
  timing: string;
  indication: string;
  rationale?: string;
  isRequired: boolean;
  isStandard: boolean;
  administrationDuration?: string;
  weightBased?: boolean;
  notes?: string;
  evidenceLevel?: string;
  drugSpecific?: string[];
  solvent: SolventType;
}

export interface PremedSolventGroup {
  id: string;
  solvent: string;
  medications: PremedAgent[];
}

export interface GroupedPremedications {
  groups: PremedSolventGroup[];
  individual: PremedAgent[];
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
  solventGroups?: GroupedPremedications;
  clinicalNotes?: string;
  preparingPharmacist?: string;
  verifyingNurse?: string;
}