import { Regimen } from "@/types/regimens";

export const colorectalCancerRegimens: Regimen[] = [
  // Neoadjuvant Regimens
  {
    id: "folfox-neoadj-crc",
    name: "FOLFOX (Neoadjuvant)",
    description: "Neoadjuvant therapy for locally advanced rectal cancer",
    category: "neoadjuvant",
    drugs: [
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2" }
    ],
    schedule: "Every 2 weeks",
    cycles: 8
  },
  {
    id: "capox-neoadj-crc",
    name: "CAPOX (Neoadjuvant)",
    description: "Capecitabine/Oxaliplatin for neoadjuvant therapy",
    category: "neoadjuvant",
    drugs: [
      { name: "Oxaliplatin", dosage: "130", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Capecitabine", dosage: "1000", unit: "mg/m²", route: "PO", day: "BID days 1-14" }
    ],
    schedule: "Every 3 weeks",
    cycles: 6
  },

  // Adjuvant Regimens
  {
    id: "folfox-adj-crc",
    name: "FOLFOX (Adjuvant)",
    description: "Standard adjuvant therapy for stage III colon cancer",
    category: "adjuvant",
    drugs: [
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2" }
    ],
    schedule: "Every 2 weeks",
    cycles: 12
  },
  {
    id: "capox-adj-crc",
    name: "CAPOX (Adjuvant)",
    description: "Oral alternative to FOLFOX for adjuvant therapy",
    category: "adjuvant",
    drugs: [
      { name: "Oxaliplatin", dosage: "130", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Capecitabine", dosage: "1000", unit: "mg/m²", route: "PO", day: "BID days 1-14" }
    ],
    schedule: "Every 3 weeks",
    cycles: 8
  },
  {
    id: "5fu-lv-adj-crc",
    name: "5-FU/Leucovorin (Adjuvant)",
    description: "For patients unable to tolerate oxaliplatin",
    category: "adjuvant",
    drugs: [
      { name: "Leucovorin", dosage: "500", unit: "mg/m²", route: "IV", day: "Days 1, 8, 15, 22, 29, 36" },
      { name: "5-Fluorouracil", dosage: "500", unit: "mg/m²", route: "IV", day: "Days 1, 8, 15, 22, 29, 36" }
    ],
    schedule: "Weekly x 6 weeks, 2 weeks break",
    cycles: 4
  },

  // Advanced/Metastatic Regimens
  {
    id: "folfox-bev-met-crc",
    name: "FOLFOX/Bevacizumab",
    description: "First-line therapy for metastatic colorectal cancer",
    category: "metastatic",
    drugs: [
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2" },
      { name: "Bevacizumab", dosage: "5", unit: "mg/kg", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 2 weeks",
    cycles: 12
  },
  {
    id: "folfiri-bev-met-crc",
    name: "FOLFIRI/Bevacizumab",
    description: "Alternative first-line or second-line therapy",
    category: "metastatic",
    drugs: [
      { name: "Irinotecan", dosage: "180", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2" },
      { name: "Bevacizumab", dosage: "5", unit: "mg/kg", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 2 weeks",
    cycles: 12
  },
  {
    id: "folfoxiri-bev-met-crc",
    name: "FOLFOXIRI/Bevacizumab",
    description: "Intensive triplet therapy for fit patients with metastatic disease",
    category: "metastatic",
    drugs: [
      { name: "Irinotecan", dosage: "165", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Leucovorin", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "5-Fluorouracil", dosage: "3200", unit: "mg/m²", route: "IV continuous", day: "Days 1-2" },
      { name: "Bevacizumab", dosage: "5", unit: "mg/kg", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 2 weeks",
    cycles: 12
  },
  {
    id: "capox-bev-met-crc",
    name: "CAPOX/Bevacizumab",
    description: "Oral-based regimen for metastatic disease",
    category: "metastatic",
    drugs: [
      { name: "Oxaliplatin", dosage: "130", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Capecitabine", dosage: "1000", unit: "mg/m²", route: "PO", day: "BID days 1-14" },
      { name: "Bevacizumab", dosage: "7.5", unit: "mg/kg", route: "IV", day: "Day 1" }
    ],
    schedule: "Every 3 weeks",
    cycles: 8
  },
  {
    id: "regorafenib-met-crc",
    name: "Regorafenib",
    description: "Third-line oral therapy for refractory metastatic CRC",
    category: "metastatic",
    drugs: [
      { name: "Regorafenib", dosage: "160", unit: "mg", route: "PO", day: "Daily days 1-21" }
    ],
    schedule: "21 days on, 7 days off",
    cycles: 6
  }
];