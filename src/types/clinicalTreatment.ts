import { Drug, Regimen } from './regimens';
import { SolventType } from './solvents';

export interface PatientInfo {
  cnp: string;
  foNumber?: string;
  firstName?: string;
  lastName?: string;
  weight: number;
  height: number;
  age: number;
  sex: string;
  bsa: number;
  creatinineClearance: number;
  cycleNumber: number;
  treatmentDate: string;
  nextCycleDate?: string;
  diagnosis?: string;
  bloodType?: string;
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
  unitCount?: number;
  unitType?: string;
  userNotes?: string;
}

export interface PremedSolventGroup {
  id: string;
  solvent: string;
  medications: PremedAgent[];
  notes?: string;
}

export interface GroupedPremedications {
  groups: PremedSolventGroup[];
  individual: PremedAgent[];
}

export interface TreatmentData {
  patient: PatientInfo;
  regimen: Regimen;
  calculatedDrugs: CalculatedDrug[];
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