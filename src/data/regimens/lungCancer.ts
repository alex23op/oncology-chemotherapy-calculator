import { Regimen, Premedication } from "@/types/regimens";

export const lungCancerRegimens: Regimen[] = [
  // HSE/NCCP Regimens
  {
    id: "00271a",
    name: "Carboplatin AUC5 + Etoposide 100 mg/m²",
    subtype: "SCLC",
    description: "SCLC extensive stage (HSE/NCCP 00271)",
    category: "advanced",
    cycleLength: 21,
    drugs: [
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3", administrationDuration: "60 min", dilution: "1000 mL NaCl" }
    ],
    schedule: "Day 1-3 every 21 days",
    cycles: 4,
    premedications: [
      { name: "5-HT3 antagonist", dosage: "8", unit: "mg", route: "IV", timing: "30 min before", category: "antiemetic", indication: "High emetogenic risk", isRequired: true, isStandard: true },
      { name: "Dexamethasone", dosage: "12", unit: "mg", route: "IV", timing: "30 min before", category: "corticosteroid", indication: "Antiemetic", isRequired: true, isStandard: true }
    ]
  },
  {
    id: "00280a",
    name: "Cisplatin 75 mg/m² + Etoposide 100 mg/m²",
    subtype: "SCLC",
    description: "SCLC extensive stage, alternative to carboplatin (HSE/NCCP 00280)",
    category: "advanced",
    drugs: [
      { name: "Cisplatin", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "1-2 hours", dilution: "1000 mL NaCl", notes: "Pre and post hydration required" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3", administrationDuration: "60 min", dilution: "1000 mL NaCl" }
    ],
    schedule: "Day 1-3 every 21 days",
    cycles: 4,
    premedications: [
      { name: "5-HT3 antagonist", dosage: "8", unit: "mg", route: "IV", timing: "30 min before", category: "antiemetic", indication: "High emetogenic risk", isRequired: true, isStandard: true },
      { name: "Dexamethasone", dosage: "12", unit: "mg", route: "IV", timing: "30 min before", category: "corticosteroid", indication: "Antiemetic", isRequired: true, isStandard: true }
    ]
  },
  {
    id: "00689a",
    name: "Atezolizumab + Carboplatin + Etoposide",
    subtype: "SCLC",
    description: "SCLC extensive stage with immunotherapy (HSE/NCCP 00689)",
    category: "advanced",
    drugs: [
      { name: "Atezolizumab", dosage: "1200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "60 min", dilution: "250 mL NaCl" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3", administrationDuration: "60 min", dilution: "1000 mL NaCl" }
    ],
    schedule: "Day 1-3 every 21 days x 4, then Atezolizumab maintenance",
    cycles: 4
  },
  
  // NCCN 3.2025 Regimens - NSCLC Neoadjuvant
  {
    id: "nccn-lung-neo-001",
    name: "Nivolumab + Carboplatin + Paclitaxel",
    subtype: "NSCLC",
    description: "Neoadjuvant for resectable NSCLC, CheckMate 816 (NCCN 3.2025)",
    category: "neoadjuvant",
    drugs: [
      { name: "Nivolumab", dosage: "360", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "100 mL NaCl" },
      { name: "Carboplatin", dosage: "AUC5-6", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Paclitaxel", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 hours", dilution: "500 mL NaCl" }
    ],
    schedule: "Every 21 days",
    cycles: 3
  },
  {
    id: "nccn-lung-neo-002",
    name: "Pembrolizumab + Cisplatin + Pemetrexed",
    subtype: "NSCLC",
    description: "Neoadjuvant for resectable non-squamous, KEYNOTE-671 (NCCN 3.2025)",
    category: "neoadjuvant",
    drugs: [
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "100 mL NaCl" },
      { name: "Cisplatin", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "1-2 hours", dilution: "1000 mL NaCl" },
      { name: "Pemetrexed", dosage: "500", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "10 min", dilution: "100 mL NaCl" }
    ],
    schedule: "Every 21 days",
    cycles: 4,
    premedications: [
      { name: "Folic Acid", dosage: "400-1000", unit: "mcg", route: "PO", timing: "Daily starting 7 days before", category: "other", indication: "Pemetrexed premedication", isRequired: true, isStandard: true },
      { name: "Vitamin B12", dosage: "1000", unit: "mcg", route: "IM", timing: "7-14 days before first dose", category: "other", indication: "Pemetrexed premedication", isRequired: true, isStandard: true }
    ]
  },

  // NCCN 3.2025 - NSCLC Adjuvant
  {
    id: "nccn-lung-adj-001",
    name: "Atezolizumab (Adjuvant)",
    subtype: "NSCLC",
    description: "Post-surgery adjuvant for stage II-IIIA, PD-L1 ≥1%, IMpower010 (NCCN 3.2025)",
    category: "adjuvant",
    drugs: [
      { name: "Atezolizam ab", dosage: "1200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "60 min", dilution: "250 mL NaCl" }
    ],
    schedule: "Every 21 days",
    cycles: 16
  },
  {
    id: "nccn-lung-adj-002",
    name: "Pembrolizumab (Adjuvant)",
    subtype: "NSCLC",
    description: "Post-surgery adjuvant for stage IB-IIIA, PEARLS/KEYNOTE-091 (NCCN 3.2025)",
    category: "adjuvant",
    drugs: [
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "100 mL NaCl" }
    ],
    schedule: "Every 21 days",
    cycles: 18
  },

  // NCCN 3.2025 - NSCLC Metastatic
  {
    id: "nccn-lung-met-001",
    name: "Pembrolizumab + Carboplatin + Pemetrexed",
    subtype: "NSCLC",
    description: "First-line non-squamous, PD-L1 <50%, KEYNOTE-189 (NCCN 3.2025/ESMO 2024)",
    category: "metastatic",
    drugs: [
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "100 mL NaCl" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Pemetrexed", dosage: "500", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "10 min", dilution: "100 mL NaCl" }
    ],
    schedule: "Every 21 days x 4, then Pembrolizumab + Pemetrexed maintenance",
    cycles: 4,
    premedications: [
      { name: "Folic Acid", dosage: "400-1000", unit: "mcg", route: "PO", timing: "Daily starting 7 days before", category: "other", indication: "Pemetrexed premedication", isRequired: true, isStandard: true },
      { name: "Vitamin B12", dosage: "1000", unit: "mcg", route: "IM", timing: "7-14 days before first dose", category: "other", indication: "Pemetrexed premedication", isRequired: true, isStandard: true }
    ]
  },
  {
    id: "nccn-lung-met-002",
    name: "Nivolumab + Ipilimumab + Carboplatin + Paclitaxel",
    subtype: "NSCLC",
    description: "First-line squamous, PD-L1 any, CheckMate 9LA (NCCN 3.2025)",
    category: "metastatic",
    drugs: [
      { name: "Nivolumab", dosage: "360", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "100 mL NaCl" },
      { name: "Ipilimumab", dosage: "1", unit: "mg/kg", route: "IV", day: "Day 1", administrationDuration: "90 min", dilution: "250 mL NaCl" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Paclitaxel", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 hours", dilution: "500 mL NaCl" }
    ],
    schedule: "Every 21 days x 2, then Nivolumab + Ipilimumab maintenance",
    cycles: 2
  },
  {
    id: "nccn-lung-met-003",
    name: "Pembrolizumab Monotherapy",
    subtype: "NSCLC",
    description: "First-line PD-L1 ≥50%, KEYNOTE-042 (NCCN 3.2025)",
    category: "metastatic",
    drugs: [
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "100 mL NaCl" }
    ],
    schedule: "Every 21 days or 400 mg every 42 days",
    cycles: 35
  },
  {
    id: "nccn-lung-met-004",
    name: "Docetaxel ± Ramucirumab",
    subtype: "NSCLC",
    description: "Second-line post-platinum, REVEL study (NCCN 3.2025)",
    category: "metastatic",
    drugs: [
      { name: "Docetaxel", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "1 hour", dilution: "250 mL NaCl" },
      { name: "Ramucirumab", dosage: "10", unit: "mg/kg", route: "IV", day: "Day 1", administrationDuration: "60 min", dilution: "250 mL NaCl" }
    ],
    schedule: "Every 21 days",
    cycles: 6,
    premedications: [
      { name: "Dexamethasone", dosage: "8", unit: "mg", route: "PO", timing: "12h, 3h, 1h before", category: "corticosteroid", indication: "Docetaxel premedication", isRequired: true, isStandard: true }
    ]
  },

  // NCCN 3.2025 - SCLC Extensive Stage
  {
    id: "nccn-sclc-ext-001",
    name: "Atezolizumab + Carboplatin + Etoposide",
    subtype: "SCLC",
    description: "First-line extensive stage, IMpower133 (NCCN 3.2025/ESMO 2024)",
    category: "advanced",
    drugs: [
      { name: "Atezolizumab", dosage: "1200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "60 min", dilution: "250 mL NaCl" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3", administrationDuration: "60 min", dilution: "1000 mL NaCl" }
    ],
    schedule: "Every 21 days x 4, then Atezolizumab maintenance",
    cycles: 4
  },
  {
    id: "nccn-sclc-ext-002",
    name: "Durvalumab + Carboplatin + Etoposide",
    subtype: "SCLC",
    description: "First-line extensive stage, CASPIAN study (NCCN 3.2025)",
    category: "advanced",
    drugs: [
      { name: "Durvalumab", dosage: "1500", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "60 min", dilution: "250 mL NaCl" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3", administrationDuration: "60 min", dilution: "1000 mL NaCl" }
    ],
    schedule: "Every 21 days x 4, then Durvalumab 1500 mg every 28 days",
    cycles: 4
  },
  {
    id: "nccn-sclc-2l-001",
    name: "Topotecan",
    subtype: "SCLC",
    description: "Second-line relapsed SCLC (NCCN 3.2025/ESMO 2024)",
    category: "advanced",
    drugs: [
      { name: "Topotecan", dosage: "1.5", unit: "mg/m²", route: "IV", day: "Days 1-5", administrationDuration: "30 min", dilution: "250 mL NaCl" }
    ],
    schedule: "Days 1-5 every 21 days or 2.3 mg/m² PO days 1-5",
    cycles: 6
  },
  {
    id: "nccn-sclc-2l-002",
    name: "Lurbinectedin",
    subtype: "SCLC",
    description: "Second-line relapsed SCLC (NCCN 3.2025, ESMO 2024)",
    category: "advanced",
    drugs: [
      { name: "Lurbinectedin", dosage: "3.2", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "60 min", dilution: "500 mL Glu 5%" }
    ],
    schedule: "Every 21 days",
    cycles: 6,
    premedications: [
      { name: "Dexamethasone", dosage: "4", unit: "mg", route: "IV", timing: "30 min before", category: "corticosteroid", indication: "Premedication", isRequired: true, isStandard: true }
    ]
  },

  // NCCN 3.2025 - SCLC Limited Stage
  {
    id: "nccn-sclc-lim-001",
    name: "Cisplatin + Etoposide + RT",
    subtype: "SCLC",
    description: "Limited-stage standard chemoradiation (NCCN 3.2025)",
    category: "advanced",
    drugs: [
      { name: "Cisplatin", dosage: "60-80", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "1-2 hours", dilution: "1000 mL NaCl", notes: "Concurrent with radiation therapy" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-3", administrationDuration: "60 min", dilution: "1000 mL NaCl" }
    ],
    schedule: "Every 21 days x 4 with concurrent RT",
    cycles: 4
  },

  // ESMO 2024 Additional Regimens
  {
    id: "esmo-lung-001",
    name: "Amivantamab + Carboplatin + Pemetrexed",
    subtype: "NSCLC",
    description: "EGFR exon 20 insertion first-line, MARIPOSA-2 (ESMO 2024)",
    category: "metastatic",
    drugs: [
      { name: "Amivantamab", dosage: "1050-1400", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "240 min", dilution: "500 mL NaCl", notes: "Weight-based dosing" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "30 min", dilution: "500 mL Glu 5%" },
      { name: "Pemetrexed", dosage: "500", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "10 min", dilution: "100 mL NaCl" }
    ],
    schedule: "Every 21 days x 4, then Amivantamab maintenance",
    cycles: 4
  }
];