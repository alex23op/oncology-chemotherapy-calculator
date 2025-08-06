export interface Drug {
  name: string;
  dosage: string;
  unit: string;
  route: string;
  day?: string;
  notes?: string;
  dilution?: string;
  administrationDuration?: string;
}

export interface Premedication {
  name: string;
  dosage: string;
  unit: string;
  route: string;
  timing: string;
  dilution?: string;
}

export interface Regimen {
  id: string;
  name: string;
  description: string;
  category: "neoadjuvant" | "adjuvant" | "advanced" | "metastatic";
  drugs: Drug[];
  premedications?: Premedication[];
  schedule: string;
  cycles: number;
}

export interface CancerType {
  id: string;
  name: string;
  category: string;
  regimens: Regimen[];
}