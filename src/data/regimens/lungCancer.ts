import { Regimen, Premedication } from "@/types/regimens";

export const lungCancerRegimens: Regimen[] = [
  // Neoadjuvant Regimens
  {
    id: "carboplatin-paclitaxel-neoadj-nsclc",
    name: "Carboplatin/Paclitaxel (Neoadjuvant)",
    description: "Neoadjuvant therapy for resectable NSCLC",
    category: "neoadjuvant",
    drugs: [
      { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 3 weeks",
    cycles: 3
  },
  {
    id: "cisplatin-pemetrexed-neoadj-nsclc",
    name: "Cisplatin/Pemetrexed (Neoadjuvant)",
    description: "For non-squamous NSCLC neoadjuvant therapy",
    category: "neoadjuvant",
    drugs: [
      { name: "Cisplatin", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Pemetrexed", dosage: "500", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Folic Acid", dosage: "400-1000", unit: "mcg", route: "PO", day: "Daily" },
      { name: "Vitamin B12", dosage: "1000", unit: "mcg", route: "IM", day: "q9wk" }
    ],
    schedule: "Every 3 weeks",
    cycles: 3
  },

  // Adjuvant Regimens
  {
    id: "cisplatin-vinorelbine-adj-nsclc",
    name: "Cisplatin/Vinorelbine (Adjuvant)",
    description: "Standard adjuvant therapy for resected NSCLC",
    category: "adjuvant",
    drugs: [
      { name: "Cisplatin", dosage: "80", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Vinorelbine", dosage: "25", unit: "mg/m²", route: "IV", day: "Days 1, 8" }
    ],
    schedule: "Every 3 weeks",
    cycles: 4
  },
  {
    id: "carboplatin-paclitaxel-adj-nsclc",
    name: "Carboplatin/Paclitaxel (Adjuvant)",
    description: "Alternative adjuvant regimen for NSCLC",
    category: "adjuvant",
    drugs: [
      { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 3 weeks",
    cycles: 4
  },

  // Advanced/Metastatic NSCLC
  {
    id: "carboplatin-paclitaxel-bev-nsclc",
    name: "Carboplatin/Paclitaxel/Bevacizumab",
    description: "First-line for non-squamous metastatic NSCLC",
    category: "metastatic",
    drugs: [
      { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Bevacizumab", dosage: "15", unit: "mg/kg", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 3 weeks x 4-6 cycles, then bevacizumab maintenance",
    cycles: 6
  },
  {
    id: "cisplatin-pemetrexed-met-nsclc",
    name: "Cisplatin/Pemetrexed",
    description: "First-line for non-squamous metastatic NSCLC",
    category: "metastatic",
    drugs: [
      { name: "Cisplatin", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Pemetrexed", dosage: "500", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Folic Acid", dosage: "400-1000", unit: "mcg", route: "PO", day: "Daily" },
      { name: "Vitamin B12", dosage: "1000", unit: "mcg", route: "IM", day: "q9wk" }
    ],
    schedule: "Every 3 weeks x 4-6 cycles, then pemetrexed maintenance",
    cycles: 6
  },
  {
    id: "carboplatin-paclitaxel-pembro-nsclc",
    name: "Carboplatin/Paclitaxel/Pembrolizumab",
    description: "First-line immunotherapy combination for metastatic NSCLC",
    category: "metastatic",
    drugs: [
      { name: "Carboplatin", dosage: "AUC 5", unit: "", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 3 weeks x 4 cycles, then pembrolizumab maintenance",
    cycles: 4
  },
  {
    id: "docetaxel-second-line-nsclc",
    name: "Docetaxel (Second-line)",
    description: "Second-line therapy for metastatic NSCLC",
    category: "metastatic",
    drugs: [
      { name: "Docetaxel", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 3 weeks",
    cycles: 6
  },

  // Small Cell Lung Cancer (SCLC)
  {
    id: "cisplatin-etoposide-sclc",
    name: "Cisplatin/Etoposide (SCLC)",
    description: "Standard first-line therapy for extensive-stage SCLC",
    category: "advanced",
    drugs: [
      { name: "Cisplatin", dosage: "80", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3" }
    ],
    schedule: "Every 3 weeks",
    cycles: 4
  },
  {
    id: "carboplatin-etoposide-sclc",
    name: "Carboplatin/Etoposide (SCLC)",
    description: "Alternative first-line for extensive-stage SCLC",
    category: "advanced",
    drugs: [
      { name: "Carboplatin", dosage: "AUC 5", unit: "", route: "IV", day: "Day 1" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3" }
    ],
    schedule: "Every 3 weeks",
    cycles: 4
  }
];