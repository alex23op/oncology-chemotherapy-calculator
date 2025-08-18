import { Regimen } from "@/types/regimens";

// Urothelial Cancer Regimens
export const urothelialCancerRegimens: Regimen[] = [
  // HSE/NCCP Regimens
  {
    id: "gu-001",
    name: "Gemcitabine 1000 mg/m² + Cisplatin 70 mg/m²",
    subtype: "Urothelial",
    category: "advanced",
    description: "Urothelial advanced, cisplatin-eligible (HSE/NCCP, NCCN 3.2025)",
    schedule: "Days 1,8 (Gem) + Day 2 (Cis) every 21 days",
    cycles: 6,
    drugs: [
      { 
        name: "Gemcitabine", 
        dosage: "1000", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1,8", 
        administrationDuration: "30 min",
        dilution: "250 mL NaCl"
      },
      { 
        name: "Cisplatin", 
        dosage: "70", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Day 2", 
        administrationDuration: "2 h",
        dilution: "1000 mL NaCl",
        notes: "Pre/post-hydration required"
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 min before cisplatin",
        category: "antiemetic",
        indication: "Nausea/vomiting prevention",
        isRequired: true,
        isStandard: true
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 min before cisplatin",
        category: "corticosteroid",
        indication: "Antiemetic and anti-inflammatory",
        isRequired: true,
        isStandard: true
      }
    ]
  },
  {
    id: "gu-002",
    name: "Carboplatin AUC4.5 + Gemcitabine 1000 mg/m²",
    subtype: "Urothelial",
    category: "advanced",
    description: "Urothelial advanced, cisplatin-ineligible (HSE/NCCP)",
    schedule: "Days 1,8 (Gem) + Day 1 (Carbo) every 21 days",
    cycles: 6,
    drugs: [
      { 
        name: "Carboplatin", 
        dosage: "AUC4.5", 
        unit: "AUC", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "60 min",
        dilution: "500 mL Glu 5%"
      },
      { 
        name: "Gemcitabine", 
        dosage: "1000", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1,8", 
        administrationDuration: "30 min",
        dilution: "250 mL NaCl"
      }
    ]
  },

  // NCCN/ESMO Regimens
  {
    id: "nccn-gu-001",
    name: "Enfortumab vedotin + Pembrolizumab",
    subtype: "Urothelial",
    category: "metastatic",
    description: "Urothelial metastatic 1L, cisplatin-ineligible (EV-302, NCCN 3.2025/ESMO 2024 preferred)",
    schedule: "Days 1,8 (EV) + Day 1 (Pembro) every 21 days",
    cycles: 12,
    drugs: [
      { 
        name: "Enfortumab vedotin", 
        dosage: "1.25", 
        unit: "mg/kg", 
        route: "IV", 
        day: "Days 1,8", 
        administrationDuration: "30 min"
      },
      { 
        name: "Pembrolizumab", 
        dosage: "200", 
        unit: "mg", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "30 min"
      }
    ]
  },
  {
    id: "nccn-gu-002",
    name: "Avelumab maintenance",
    subtype: "Urothelial",
    category: "maintenance",
    description: "Urothelial post-platinum, no progression (JAVELIN Bladder 100, NCCN 3.2025)",
    schedule: "Every 14 days",
    cycles: 999,
    drugs: [
      { 
        name: "Avelumab", 
        dosage: "10", 
        unit: "mg/kg", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "60 min"
      }
    ]
  },
  {
    id: "nccn-gu-003",
    name: "Sacituzumab govitecan",
    subtype: "Urothelial",
    category: "advanced",
    description: "Urothelial metastatic post-platinum/PD-1 (TROPHY-U-01, NCCN 3.2025)",
    schedule: "Days 1,8 every 21 days",
    cycles: 999,
    drugs: [
      { 
        name: "Sacituzumab govitecan", 
        dosage: "10", 
        unit: "mg/kg", 
        route: "IV", 
        day: "Days 1,8", 
        administrationDuration: "3 h"
      }
    ]
  }
];

// Germ Cell Tumour Regimens
export const germCellTumourRegimens: Regimen[] = [
  {
    id: "gu-101",
    name: "BEP (Bleomycin + Etoposide + Cisplatin)",
    subtype: "Germ Cell Tumours",
    category: "adjuvant",
    description: "Germ cell tumour curative (HSE/NCCP, NCCN 2.2025)",
    schedule: "Days 1-5 every 21 days",
    cycles: 3,
    drugs: [
      { 
        name: "Bleomycin", 
        dosage: "30", 
        unit: "units", 
        route: "IV", 
        day: "Days 2,9,16", 
        administrationDuration: "10 min",
        notes: "Maximum cumulative dose: 270 units"
      },
      { 
        name: "Etoposide", 
        dosage: "100", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1-5", 
        administrationDuration: "60 min",
        dilution: "500 mL NaCl"
      },
      { 
        name: "Cisplatin", 
        dosage: "20", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1-5", 
        administrationDuration: "2 h",
        dilution: "1000 mL NaCl",
        notes: "Pre/post-hydration required"
      }
    ]
  },
  {
    id: "gu-102",
    name: "EP (Etoposide + Cisplatin)",
    subtype: "Germ Cell Tumours",
    category: "adjuvant",
    description: "Germ cell tumour good risk (HSE/NCCP, NCCN 2.2025)",
    schedule: "Days 1-5 every 21 days",
    cycles: 4,
    drugs: [
      { 
        name: "Etoposide", 
        dosage: "100", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1-5", 
        administrationDuration: "60 min",
        dilution: "500 mL NaCl"
      },
      { 
        name: "Cisplatin", 
        dosage: "20", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1-5", 
        administrationDuration: "2 h",
        dilution: "1000 mL NaCl"
      }
    ]
  },
  {
    id: "nccn-gu-101",
    name: "VIP (Vinblastine + Ifosfamide + Cisplatin)",
    subtype: "Germ Cell Tumours",
    category: "advanced",
    description: "Germ cell tumour poor-risk/salvage (NCCN 2.2025, ESMO 2024)",
    schedule: "Days 1-5 every 21 days",
    cycles: 4,
    drugs: [
      { 
        name: "Vinblastine", 
        dosage: "0.11", 
        unit: "mg/kg", 
        route: "IV", 
        day: "Days 1-2", 
        administrationDuration: "5 min"
      },
      { 
        name: "Ifosfamide", 
        dosage: "1200", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1-5", 
        administrationDuration: "2 h",
        notes: "With mesna protection"
      },
      { 
        name: "Cisplatin", 
        dosage: "20", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Days 1-5", 
        administrationDuration: "2 h"
      }
    ]
  }
];

// Prostate Cancer Regimens
export const prostateCancerRegimens: Regimen[] = [
  {
    id: "gu-201",
    name: "Docetaxel 75 mg/m² + Prednisone",
    subtype: "Prostate Cancer",
    category: "metastatic",
    description: "mCRPC first-line (HSE/NCCP, NCCN 3.2025)",
    schedule: "Every 21 days",
    cycles: 10,
    drugs: [
      { 
        name: "Docetaxel", 
        dosage: "75", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "60 min",
        dilution: "250 mL NaCl"
      },
      { 
        name: "Prednisone", 
        dosage: "5", 
        unit: "mg", 
        route: "PO", 
        day: "Twice daily", 
        notes: "Continuous"
      }
    ],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "PO",
        timing: "12, 3, and 1 hour before docetaxel",
        category: "corticosteroid",
        indication: "Hypersensitivity prevention",
        isRequired: true,
        isStandard: true
      }
    ]
  },
  {
    id: "gu-202",
    name: "Cabazitaxel 25 mg/m² + Prednisone",
    subtype: "Prostate Cancer",
    category: "metastatic",
    description: "mCRPC post-docetaxel (HSE/NCCP, NCCN 3.2025)",
    schedule: "Every 21 days",
    cycles: 10,
    drugs: [
      { 
        name: "Cabazitaxel", 
        dosage: "25", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "60 min",
        dilution: "250 mL NaCl"
      },
      { 
        name: "Prednisone", 
        dosage: "10", 
        unit: "mg", 
        route: "PO", 
        day: "Daily"
      }
    ]
  },
  {
    id: "nccn-gu-201",
    name: "Darolutamide + Docetaxel + ADT",
    subtype: "Prostate Cancer",
    category: "metastatic",
    description: "mHSPC high-risk (ARASENS, NCCN 3.2025)",
    schedule: "Docetaxel q21d × 6, Darolutamide daily",
    cycles: 6,
    drugs: [
      { 
        name: "Darolutamide", 
        dosage: "600", 
        unit: "mg", 
        route: "PO", 
        day: "Twice daily",
        notes: "Continuous"
      },
      { 
        name: "Docetaxel", 
        dosage: "75", 
        unit: "mg/m²", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "60 min"
      },
      { 
        name: "Goserelin", 
        dosage: "10.8", 
        unit: "mg", 
        route: "SC", 
        day: "Every 12 weeks",
        notes: "LHRH agonist"
      }
    ]
  },
  {
    id: "nccn-gu-202",
    name: "Olaparib",
    subtype: "Prostate Cancer",
    category: "metastatic",
    description: "mCRPC BRCA-mutated post-ARPI (PROfound, NCCN 3.2025)",
    schedule: "Continuous",
    cycles: 999,
    drugs: [
      { 
        name: "Olaparib", 
        dosage: "300", 
        unit: "mg", 
        route: "PO", 
        day: "Twice daily",
        notes: "Take with food"
      }
    ]
  },
  {
    id: "nccn-gu-203",
    name: "Talazoparib + Enzalutamide",
    subtype: "Prostate Cancer",
    category: "metastatic",
    description: "mCRPC HRR-mutated (TALAPRO-2, NCCN 3.2025)",
    schedule: "Continuous",
    cycles: 999,
    drugs: [
      { 
        name: "Talazoparib", 
        dosage: "0.5", 
        unit: "mg", 
        route: "PO", 
        day: "Daily"
      },
      { 
        name: "Enzalutamide", 
        dosage: "160", 
        unit: "mg", 
        route: "PO", 
        day: "Daily"
      }
    ]
  }
];

// Renal Cell Carcinoma Regimens
export const renalCellCarcinomaRegimens: Regimen[] = [
  {
    id: "gu-301",
    name: "Sunitinib",
    subtype: "Renal Cell Carcinoma",
    category: "advanced",
    description: "Advanced RCC first-line (HSE/NCCP)",
    schedule: "4 weeks on, 2 weeks off",
    cycles: 999,
    drugs: [
      { 
        name: "Sunitinib", 
        dosage: "50", 
        unit: "mg", 
        route: "PO", 
        day: "Daily for 4 weeks",
        notes: "2 weeks break between cycles"
      }
    ]
  },
  {
    id: "gu-302",
    name: "Pazopanib",
    subtype: "Renal Cell Carcinoma",
    category: "advanced",
    description: "Advanced RCC first-line alternative (HSE/NCCP)",
    schedule: "Continuous",
    cycles: 999,
    drugs: [
      { 
        name: "Pazopanib", 
        dosage: "800", 
        unit: "mg", 
        route: "PO", 
        day: "Daily",
        notes: "Take on empty stomach"
      }
    ]
  },
  {
    id: "nccn-gu-301",
    name: "Pembrolizumab + Lenvatinib",
    subtype: "Renal Cell Carcinoma",
    category: "advanced",
    description: "Advanced clear-cell RCC 1L (CLEAR, NCCN 3.2025/ESMO 2024 preferred)",
    schedule: "Pembrolizumab q21d, Lenvatinib daily",
    cycles: 999,
    drugs: [
      { 
        name: "Pembrolizumab", 
        dosage: "200", 
        unit: "mg", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "30 min"
      },
      { 
        name: "Lenvatinib", 
        dosage: "20", 
        unit: "mg", 
        route: "PO", 
        day: "Daily"
      }
    ]
  },
  {
    id: "nccn-gu-302",
    name: "Avelumab + Axitinib",
    subtype: "Renal Cell Carcinoma",
    category: "advanced",
    description: "Advanced RCC 1L (JAVELIN Renal 101, NCCN 3.2025)",
    schedule: "Avelumab q14d, Axitinib daily",
    cycles: 999,
    drugs: [
      { 
        name: "Avelumab", 
        dosage: "10", 
        unit: "mg/kg", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "60 min"
      },
      { 
        name: "Axitinib", 
        dosage: "5", 
        unit: "mg", 
        route: "PO", 
        day: "Twice daily"
      }
    ]
  },
  {
    id: "nccn-gu-303",
    name: "Nivolumab + Cabozantinib",
    subtype: "Renal Cell Carcinoma",
    category: "advanced",
    description: "Advanced RCC 1L (CheckMate 9ER, NCCN 3.2025)",
    schedule: "Nivolumab q14d, Cabozantinib daily",
    cycles: 999,
    drugs: [
      { 
        name: "Nivolumab", 
        dosage: "240", 
        unit: "mg", 
        route: "IV", 
        day: "Day 1", 
        administrationDuration: "30 min"
      },
      { 
        name: "Cabozantinib", 
        dosage: "40", 
        unit: "mg", 
        route: "PO", 
        day: "Daily"
      }
    ]
  },
  {
    id: "nccn-gu-304",
    name: "Belzutifan",
    subtype: "Renal Cell Carcinoma",
    category: "advanced",
    description: "VHL-associated RCC (NCCN 3.2025 update)",
    schedule: "Continuous",
    cycles: 999,
    drugs: [
      { 
        name: "Belzutifan", 
        dosage: "120", 
        unit: "mg", 
        route: "PO", 
        day: "Daily",
        notes: "Take with or without food"
      }
    ]
  }
];

export const allGenitourinaryRegimens = [
  ...urothelialCancerRegimens,
  ...germCellTumourRegimens,
  ...prostateCancerRegimens,
  ...renalCellCarcinomaRegimens
];