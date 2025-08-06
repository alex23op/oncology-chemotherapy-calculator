import { Premedication } from "@/types/regimens";

export interface PremedProtocol {
  id: string;
  name: string;
  description: string;
  indication: string[];
  premedications: Premedication[];
}

export const standardPremedProtocols: PremedProtocol[] = [
  {
    id: "taxane_standard",
    name: "Taxane Standard Premedication",
    description: "Standard premedication protocol for taxane-based chemotherapy (paclitaxel, docetaxel)",
    indication: ["paclitaxel", "docetaxel", "carboplatin + paclitaxel"],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "20",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "corticosteroid",
        indication: "Hypersensitivity reaction prevention",
        isRequired: true,
        isStandard: true,
        administrationDuration: "Slow IV push over 2-3 minutes",
        dilution: "Mix in 50-100 mL normal saline",
        notes: "Can be given PO 12h and 6h before as alternative"
      },
      {
        name: "Diphenhydramine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "antihistamine",
        indication: "H1 antihistamine for hypersensitivity prevention",
        isRequired: true,
        isStandard: true,
        administrationDuration: "IV push over 2 minutes",
        dilution: "May dilute in 10-20 mL normal saline"
      },
      {
        name: "Ranitidine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "h2_blocker",
        indication: "H2 antihistamine for hypersensitivity prevention",
        isRequired: false,
        isStandard: true,
        administrationDuration: "IV push over 2 minutes",
        dilution: "Dilute in 20 mL normal saline",
        notes: "Alternative: Famotidine 20mg IV"
      }
    ]
  },
  {
    id: "platinum_standard",
    name: "Platinum Standard Premedication",
    description: "Standard antiemetic protocol for platinum-based chemotherapy",
    indication: ["cisplatin", "carboplatin", "oxaliplatin"],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "antiemetic",
        indication: "Prevention of acute chemotherapy-induced nausea and vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "IV push over 2-5 minutes",
        dilution: "May give undiluted or dilute in 50 mL normal saline"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "corticosteroid",
        indication: "Prevention of delayed nausea and vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "IV push over 2-3 minutes",
        dilution: "Mix in 50 mL normal saline"
      },
      {
        name: "Granisetron",
        dosage: "1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "antiemetic",
        indication: "Alternative 5-HT3 antagonist for CINV prevention",
        isRequired: false,
        isStandard: false,
        administrationDuration: "IV push over 30 seconds",
        dilution: "May give undiluted or dilute in 20-50 mL normal saline",
        notes: "Alternative to ondansetron"
      }
    ]
  },
  {
    id: "anthracycline_standard",
    name: "Anthracycline Antiemetic Protocol",
    description: "Antiemetic protocol for anthracycline-based chemotherapy",
    indication: ["doxorubicin", "epirubicin", "adriamycin"],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "antiemetic",
        indication: "Prevention of acute CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "IV push over 2-5 minutes",
        dilution: "May give undiluted or dilute in 50 mL normal saline"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: false,
        isStandard: true,
        administrationDuration: "IV push over 2-3 minutes",
        dilution: "Mix in 50 mL normal saline",
        notes: "May omit for low emetogenic potential"
      }
    ]
  },
  {
    id: "general_antiemetic",
    name: "General Antiemetic Options",
    description: "Additional antiemetic options for various regimens",
    indication: ["general"],
    premedications: [
      {
        name: "Metoclopramide",
        dosage: "10",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "antiemetic",
        indication: "Alternative antiemetic, gastric motility",
        isRequired: false,
        isStandard: false,
        administrationDuration: "IV push over 1-2 minutes",
        dilution: "May give undiluted or dilute in 10-20 mL normal saline"
      },
      {
        name: "Promethazine",
        dosage: "25",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "antiemetic",
        indication: "Alternative antiemetic with sedative effects",
        isRequired: false,
        isStandard: false,
        administrationDuration: "Slow IV push over 10-15 minutes",
        dilution: "Dilute in 20-50 mL normal saline",
        notes: "Risk of tissue necrosis if extravasated"
      },
      {
        name: "Lorazepam",
        dosage: "0.5-2",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "other",
        indication: "Anticipatory nausea and anxiety",
        isRequired: false,
        isStandard: false,
        administrationDuration: "Slow IV push over 2-5 minutes",
        dilution: "Dilute in 10 mL normal saline"
      }
    ]
  }
];

export const getRecommendedProtocols = (drugNames: string[]): PremedProtocol[] => {
  const protocols: PremedProtocol[] = [];
  const lowerDrugNames = drugNames.map(name => name.toLowerCase());
  
  // Check for taxane drugs
  if (lowerDrugNames.some(drug => drug.includes('paclitaxel') || drug.includes('docetaxel'))) {
    protocols.push(standardPremedProtocols.find(p => p.id === 'taxane_standard')!);
  }
  
  // Check for platinum drugs
  if (lowerDrugNames.some(drug => drug.includes('cisplatin') || drug.includes('carboplatin') || drug.includes('oxaliplatin'))) {
    protocols.push(standardPremedProtocols.find(p => p.id === 'platinum_standard')!);
  }
  
  // Check for anthracyclines
  if (lowerDrugNames.some(drug => drug.includes('doxorubicin') || drug.includes('epirubicin') || drug.includes('adriamycin'))) {
    protocols.push(standardPremedProtocols.find(p => p.id === 'anthracycline_standard')!);
  }
  
  // Always include general options
  protocols.push(standardPremedProtocols.find(p => p.id === 'general_antiemetic')!);
  
  return protocols;
};

export const calculateWeightBasedDose = (premedication: Premedication, weight: number): number => {
  if (!premedication.weightBased) {
    return parseFloat(premedication.dosage);
  }
  
  // Weight-based calculations for specific drugs
  const baseDose = parseFloat(premedication.dosage);
  
  if (premedication.name.toLowerCase().includes('dexamethasone')) {
    // Dexamethasone: Standard doses regardless of weight for premedication
    return baseDose;
  }
  
  if (premedication.name.toLowerCase().includes('diphenhydramine')) {
    // Diphenhydramine: 1mg/kg (max 50mg)
    return Math.min(weight * 1, 50);
  }
  
  return baseDose;
};