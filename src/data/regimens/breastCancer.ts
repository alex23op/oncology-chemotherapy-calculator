import { Regimen } from "@/types/regimens";

export const breastCancerRegimens: Regimen[] = [
  // Neoadjuvant Regimens
  {
    id: "ac-t-neoadj",
    name: "AC-T (Neoadjuvant)",
    description: "Doxorubicin/Cyclophosphamide followed by Paclitaxel",
    category: "neoadjuvant",
    drugs: [
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1" }
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
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Pegfilgrastim", dosage: "6", unit: "mg", route: "SQ", day: "Day 2" }
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
      { name: "Paclitaxel", dosage: "80", unit: "mg/m²", route: "IV", day: "Weekly" },
      { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV", day: "Day 1" }
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
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1" }
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
      { name: "Docetaxel", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1" }
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
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Pegfilgrastim", dosage: "6", unit: "mg", route: "SQ", day: "Day 2" }
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
      { name: "Paclitaxel", dosage: "80", unit: "mg/m²", route: "IV", day: "Days 1, 8, 15" }
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
      { name: "Docetaxel", dosage: "75-100", unit: "mg/m²", route: "IV", day: "Day 1" }
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
      { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1" }
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
      { name: "Gemcitabine", dosage: "1000", unit: "mg/m²", route: "IV", day: "Days 1, 8" },
      { name: "Carboplatin", dosage: "AUC 2", unit: "", route: "IV", day: "Days 1, 8" }
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
      { name: "Capecitabine", dosage: "1250", unit: "mg/m²", route: "PO", day: "BID days 1-14" }
    ],
    schedule: "14 days on, 7 days off",
    cycles: 6
  }
];