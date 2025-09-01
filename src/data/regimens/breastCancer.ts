import { Regimen, Premedication } from "@/types/regimens";

export const breastCancerRegimens: Regimen[] = [
  // Neoadjuvant Regimens
  {
    id: "ac-t-neoadj",
    name: "AC-T (Neoadjuvant)",
    description: "Doxorubicin/Cyclophosphamide followed by Paclitaxel",
    category: "neoadjuvant",
    premedications: [
      { 
        name: "Ondansetron", 
        dosage: "8", 
        unit: "mg", 
        route: "IV", 
        timing: "30 min prior", 
        dilution: "ser fiziologic 50mL",
        category: "antiemetic" as const,
        indication: "Prevention of acute CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "IV push over 2-5 minutes"
      },
      { 
        name: "Dexamethasone", 
        dosage: "12", 
        unit: "mg", 
        route: "IV", 
        timing: "30 min prior", 
        dilution: "ser fiziologic 50mL",
        category: "corticosteroid" as const,
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "IV push over 2-3 minutes"
      }
    ],
    drugs: [
      { 
        name: "Doxorubicin", 
        dosage: "60", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Day 1",
        dilution: "Normal saline 50-100mL",
        administrationDuration: "5-10 minutes",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [50, 100, 250]
      },
      { 
        name: "Cyclophosphamide", 
        dosage: "600", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Day 1",
        dilution: "Normal saline 250mL",
        administrationDuration: "30-60 minutes"
      },
      { 
        name: "Paclitaxel", 
        dosage: "175", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Day 1",
        dilution: "Normal saline 250-500mL",
        administrationDuration: "3 hours",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [250, 500]
      }
    ],
    schedule: "AC q3wk x 4 cycles → Paclitaxel q3wk x 4 cycles",
    cycles: 8
  },
  {
    id: "dose-dense-ac-t-neoadj",
    name: "Dose-Dense AC-T (Neoadjuvant)", 
    description: "Dose-dense doxorubicin/cyclophosphamide followed by paclitaxel",
    category: "neoadjuvant",
    drugs: [
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "5-10 minutes" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250mL", administrationDuration: "30-60 minutes" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250-500mL", administrationDuration: "3 hours" },
      { name: "Pegfilgrastim", dosage: "6", unit: "mg", route: "SQ", day: "Day 2", dilution: "Pre-filled syringe", administrationDuration: "Immediate injection" }
    ],
    schedule: "AC q2wk x 4 cycles → Paclitaxel q2wk x 4 cycles with G-CSF support",
    cycles: 8
  },
  {
    id: "tcap-neoadj",
    name: "TCAP (Neoadjuvant)",
    description: "Paclitaxel/Carboplatin with optional bevacizumab",
    category: "neoadjuvant",
    drugs: [
      { name: "Paclitaxel", dosage: "80", unit: "mg/m²", route: "IV", day: "Weekly", dilution: "Normal saline 250mL", administrationDuration: "1 hour" },
      { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV", day: "Day 1", dilution: "5% Dextrose or Normal saline 250-500mL", administrationDuration: "30-60 minutes" }
    ],
    schedule: "Weekly paclitaxel x 12 weeks, carboplatin q3wk x 4 cycles",
    cycles: 4
  },

  // Adjuvant Regimens
  {
    id: "ac-t-adj",
    name: "AC-T (Adjuvant)",
    description: "Standard adjuvant doxorubicin/cyclophosphamide followed by paclitaxel",
    category: "adjuvant",
    drugs: [
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "5-10 minutes" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250mL", administrationDuration: "30-60 minutes" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250-500mL", administrationDuration: "3 hours" }
    ],
    schedule: "AC q3wk x 4 cycles → Paclitaxel q3wk x 4 cycles",
    cycles: 8
  },
  {
    id: "tc-adj",
    name: "TC (Adjuvant)",
    description: "Docetaxel/Cyclophosphamide",
    category: "adjuvant",
    drugs: [
      { name: "Docetaxel", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250mL", administrationDuration: "1 hour" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250mL", administrationDuration: "30-60 minutes", availableSolvents: ["NS", "D5W"], availableVolumes: [100, 250, 500] }
    ],
    schedule: "Every 3 weeks",
    cycles: 4
  },
  {
    id: "dose-dense-ac-t-adj",
    name: "Dose-Dense AC-T (Adjuvant)",
    description: "Dose-dense adjuvant therapy with G-CSF support",
    category: "adjuvant", 
    drugs: [
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "5-10 minutes" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250mL", administrationDuration: "30-60 minutes" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250-500mL", administrationDuration: "3 hours" },
      { name: "Pegfilgrastim", dosage: "6", unit: "mg", route: "SQ", day: "Day 2", dilution: "Pre-filled syringe", administrationDuration: "Immediate injection" }
    ],
    schedule: "AC q2wk x 4 cycles → Paclitaxel q2wk x 4 cycles",
    cycles: 8
  },

  // Advanced/Metastatic Regimens
  {
    id: "paclitaxel-weekly-met",
    name: "Paclitaxel Weekly",
    description: "Weekly paclitaxel for metastatic breast cancer",
    category: "metastatic",
    drugs: [
      { name: "Paclitaxel", dosage: "80", unit: "mg/m²", route: "IV", day: "Days 1, 8, 15", dilution: "Normal saline 250mL", administrationDuration: "1 hour" }
    ],
    schedule: "Weekly x 3 weeks, 1 week break",
    cycles: 6
  },
  {
    id: "docetaxel-met",
    name: "Docetaxel",
    description: "Single-agent docetaxel for metastatic disease",
    category: "metastatic",
    drugs: [
      { name: "Docetaxel", dosage: "75-100", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250mL", administrationDuration: "1 hour" }
    ],
    schedule: "Every 3 weeks",
    cycles: 6
  },
  {
    id: "carboplatin-paclitaxel-met",
    name: "Carboplatin/Paclitaxel",
    description: "Combination therapy for metastatic breast cancer",
    category: "metastatic",
    drugs: [
      { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV", day: "Day 1", dilution: "5% Dextrose or Normal saline 250-500mL", administrationDuration: "30-60 minutes" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 250-500mL", administrationDuration: "3 hours" }
    ],
    schedule: "Every 3 weeks",
    cycles: 6
  },
  {
    id: "gemcitabine-carboplatin-met",
    name: "Gemcitabine/Carboplatin",
    description: "For TNBC or BRCA-mutated metastatic breast cancer",
    category: "metastatic",
    drugs: [
      { name: "Gemcitabine", dosage: "1000", unit: "mg/m²", route: "IV", day: "Days 1, 8", dilution: "Normal saline 100-250mL", administrationDuration: "30 minutes" },
      { name: "Carboplatin", dosage: "AUC 2", unit: "", route: "IV", day: "Days 1, 8", dilution: "5% Dextrose or Normal saline 250-500mL", administrationDuration: "30-60 minutes" }
    ],
    schedule: "Days 1, 8 q3wk",
    cycles: 6
  },
  {
    id: "capecitabine-met",
    name: "Capecitabine",
    description: "Oral fluoropyrimidine for metastatic breast cancer",
    category: "metastatic",
    drugs: [
      { name: "Capecitabine", dosage: "1250", unit: "mg/m²", route: "PO", day: "BID days 1-14", dilution: "Take with food and water", administrationDuration: "N/A - oral medication" }
    ],
    schedule: "14 days on, 7 days off",
    cycles: 6
  }
];