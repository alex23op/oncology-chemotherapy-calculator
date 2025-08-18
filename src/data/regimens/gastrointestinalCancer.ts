import { Regimen } from "@/types/regimens";

export const gastrointestinalCancerRegimens: Regimen[] = [
  // COLORECTAL CANCER REGIMENS
  {
    id: "gi-001",
    name: "mFOLFOX6",
    subtype: "Colorectal",
    category: "metastatic",
    description: "Colorectal metastatic or adjuvant (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "2 h",
        notes: "Use only Glucose 5%, neurotoxicity monitoring"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        notes: "Bolus, omit if hematologic toxicity"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        administrationDuration: "46 h",
        notes: "Continuous infusion, DPD testing recommended"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2]
    }
  },
  {
    id: "gi-002",
    name: "FOLFIRI",
    subtype: "Colorectal",
    category: "metastatic",
    description: "Colorectal metastatic 2L or 1L (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "90 min",
        notes: "UGT1A1*28 testing, atropine premedication"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        administrationDuration: "46 h",
        notes: "Continuous infusion"
      }
    ],
    premedications: [
      {
        name: "Atropine",
        dosage: "0.25",
        unit: "mg",
        route: "IV",
        timing: "30 min before",
        category: "other",
        indication: "Prevent cholinergic symptoms",
        isRequired: true,
        isStandard: true
      }
    ]
  },
  {
    id: "gi-003",
    name: "Pembrolizumab",
    subtype: "Colorectal",
    category: "metastatic",
    description: "dMMR/MSI-H metastatic colorectal cancer, 1L (KEYNOTE-177, NCCN 3.2025)",
    schedule: "q21d",
    cycles: 35,
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        administrationDuration: "30 min"
      }
    ],
    biomarkerRequirements: [
      {
        name: "MSI/MMR Status",
        status: "high" as const,
        required: true,
        testingMethod: "IHC/PCR"
      }
    ]
  },
  {
    id: "gi-004",
    name: "Fruquintinib",
    subtype: "Colorectal",
    category: "metastatic",
    description: "Metastatic colorectal cancer, post-prior therapies (FRESCO-2, NCCN 3.2025/ESMO 2024)",
    schedule: "q28d",
    cycles: 999,
    drugs: [
      {
        name: "Fruquintinib",
        dosage: "5",
        unit: "mg",
        route: "PO",
        day: "Days 1-21",
        notes: "3 weeks on, 1 week off"
      }
    ]
  },
  {
    id: "gi-005",
    name: "Encorafenib + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    description: "BRAF V600E metastatic colorectal cancer (BEACON CRC, NCCN 3.2025)",
    schedule: "Daily + weekly",
    cycles: 999,
    drugs: [
      {
        name: "Encorafenib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Daily"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "BRAF V600E",
        status: "mutated" as const,
        required: true
      }
    ]
  },

  // ESOPHAGEAL/GEJ REGIMENS
  {
    id: "gi-006",
    name: "Nivolumab + mFOLFOX6",
    subtype: "Esophageal/GEJ",
    category: "advanced",
    description: "1L advanced esophageal/GEJ, PD-L1 CPS ≥5 (CheckMate 648, NCCN 3.2025/ESMO 2024)",
    schedule: "q14d",
    cycles: 12,
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
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "2 h"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        administrationDuration: "46 h"
      }
    ],
    biomarkerRequirements: [
      {
        name: "PD-L1 CPS",
        status: "high" as const,
        threshold: "≥5",
        required: true
      }
    ]
  },
  {
    id: "gi-007",
    name: "Pembrolizumab + Cisplatin + 5-FU",
    subtype: "Esophageal/GEJ",
    category: "advanced",
    description: "1L squamous esophageal cancer, PD-L1 CPS ≥10 (KEYNOTE-590, NCCN 3.2025)",
    schedule: "q21d",
    cycles: 6,
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV", 
        day: "Day 1"
      },
      {
        name: "Cisplatin",
        dosage: "80",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        notes: "Pre/post-hydration required"
      },
      {
        name: "5-Fluorouracil",
        dosage: "800",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-5",
        administrationDuration: "120 h"
      }
    ]
  },

  // GASTRIC REGIMENS
  {
    id: "gi-008",
    name: "FLOT",
    subtype: "Gastric",
    category: "neoadjuvant",
    description: "Perioperative gastric/GEJ adenocarcinoma (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 8,
    drugs: [
      {
        name: "Docetaxel",
        dosage: "50",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "1 h"
      },
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "2 h"
      },
      {
        name: "Leucovorin",
        dosage: "200",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2600",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-2",
        administrationDuration: "24 h"
      }
    ],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "PO",
        timing: "12, 3, 1 hours prior",
        category: "corticosteroid",
        indication: "Docetaxel premedication",
        isRequired: true,
        isStandard: true
      }
    ]
  },
  {
    id: "gi-009",
    name: "Zolbetuximab + mFOLFOX6",
    subtype: "Gastric",
    category: "advanced",
    description: "1L HER2-negative, CLDN18.2-positive gastric cancer (SPOTLIGHT, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Zolbetuximab",
        dosage: "800",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        notes: "Then 600 mg/m² subsequent cycles"
      },
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3"
      }
    ],
    biomarkerRequirements: [
      {
        name: "CLDN18.2",
        status: "positive" as const,
        required: true
      },
      {
        name: "HER2",
        status: "negative" as const,
        required: true
      }
    ]
  },

  // PANCREATIC REGIMENS
  {
    id: "gi-010",
    name: "FOLFIRINOX",
    subtype: "Pancreatic",
    category: "advanced",
    description: "Metastatic pancreatic adenocarcinoma (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "2 h"
      },
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "90 min"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        administrationDuration: "46 h"
      }
    ]
  },
  {
    id: "gi-011",
    name: "NALIRIFOX",
    subtype: "Pancreatic",
    category: "advanced",
    description: "1L metastatic pancreatic adenocarcinoma (NAPOLI-3, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Liposomal Irinotecan",
        dosage: "50",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        administrationDuration: "90 min"
      },
      {
        name: "Oxaliplatin",
        dosage: "60",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3"
      }
    ]
  },
  {
    id: "gi-012",
    name: "Gemcitabine + nab-Paclitaxel",
    subtype: "Pancreatic",
    category: "advanced",
    description: "Metastatic pancreatic adenocarcinoma (HSE/NCCP, NCCN 3.2025)",
    schedule: "q28d",
    cycles: 6,
    drugs: [
      {
        name: "nab-Paclitaxel",
        dosage: "125",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1,8,15",
        administrationDuration: "30 min"
      },
      {
        name: "Gemcitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1,8,15",
        administrationDuration: "30 min"
      }
    ]
  },
  {
    id: "gi-013",
    name: "Olaparib",
    subtype: "Pancreatic",
    category: "maintenance",
    description: "BRCA-mutated metastatic pancreatic cancer, maintenance (POLO, NCCN 3.2025)",
    schedule: "Daily",
    cycles: 999,
    drugs: [
      {
        name: "Olaparib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Twice daily",
        notes: "Continue until progression"
      }
    ],
    biomarkerRequirements: [
      {
        name: "BRCA1/2",
        status: "mutated" as const,
        required: true
      }
    ]
  },

  // BILIARY REGIMENS
  {
    id: "gi-014",
    name: "Durvalumab + Gemcitabine + Cisplatin",
    subtype: "Biliary",
    category: "advanced",
    description: "1L advanced biliary tract cancer (TOPAZ-1, NCCN 3.2025/ESMO 2024)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Durvalumab",
        dosage: "1500",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        administrationDuration: "60 min"
      },
      {
        name: "Gemcitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1,8",
        administrationDuration: "30 min"
      },
      {
        name: "Cisplatin",
        dosage: "25",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1,8",
        notes: "Pre/post-hydration required"
      }
    ]
  },
  {
    id: "gi-015",
    name: "Gemcitabine + Cisplatin",
    subtype: "Biliary",
    category: "advanced", 
    description: "Advanced biliary tract cancer (HSE/NCCP, NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Gemcitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1,8",
        administrationDuration: "30 min"
      },
      {
        name: "Cisplatin",
        dosage: "25",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1,8",
        administrationDuration: "1 h"
      }
    ]
  },
  {
    id: "gi-016",
    name: "Pembrolizumab",
    subtype: "Biliary",
    category: "advanced",
    description: "MSI-H/dMMR advanced biliary tract cancer (KEYNOTE-158, NCCN 3.2025)",
    schedule: "q21d",
    cycles: 35,
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1"
      }
    ],
    biomarkerRequirements: [
      {
        name: "MSI/MMR Status",
        status: "high" as const,
        required: true
      }
    ]
  },

  // HEPATOCELLULAR CARCINOMA (HCC) REGIMENS
  {
    id: "gi-017",
    name: "Atezolizumab + Bevacizumab",
    subtype: "HCC",
    category: "advanced",
    description: "1L unresectable hepatocellular carcinoma (IMbrave150, HSE/NCCP, NCCN 3.2025)",
    schedule: "q21d",
    cycles: 999,
    drugs: [
      {
        name: "Atezolizumab",
        dosage: "1200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        administrationDuration: "60 min"
      },
      {
        name: "Bevacizumab",
        dosage: "15",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        administrationDuration: "90 min",
        notes: "Monitor HTN, proteinuria, GI varices"
      }
    ]
  },
  {
    id: "gi-018",
    name: "Durvalumab + Tremelimumab",
    subtype: "HCC",
    category: "advanced",
    description: "1L unresectable hepatocellular carcinoma (HIMALAYA, NCCN 3.2025)",
    schedule: "Single dose + q4w",
    cycles: 999,
    drugs: [
      {
        name: "Tremelimumab",
        dosage: "300",
        unit: "mg",
        route: "IV",
        day: "Day 1 cycle 1 only",
        notes: "Single dose"
      },
      {
        name: "Durvalumab",
        dosage: "1500",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        notes: "Every 4 weeks"
      }
    ]
  },
  {
    id: "gi-019",
    name: "Sorafenib",
    subtype: "HCC",
    category: "advanced",
    description: "1L advanced hepatocellular carcinoma (HSE/NCCP, NCCN 3.2025)",
    schedule: "Daily",
    cycles: 999,
    drugs: [
      {
        name: "Sorafenib",
        dosage: "400",
        unit: "mg",
        route: "PO",
        day: "Twice daily",
        notes: "Take on empty stomach"
      }
    ]
  },
  {
    id: "gi-020",
    name: "Tislelizumab",
    subtype: "HCC",
    category: "advanced",
    description: "2L unresectable hepatocellular carcinoma (NCCN 3.2025 update)",
    schedule: "q21d",
    cycles: 999,
    drugs: [
      {
        name: "Tislelizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        administrationDuration: "60 min"
      }
    ]
  }
];