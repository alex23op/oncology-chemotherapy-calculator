import { Regimen } from "@/types/regimens";

// Original regimens (keeping existing structure)
const originalRegimens: Regimen[] = [
  // COLORECTAL CANCER REGIMENS - Consolidated from separate colorectal category
  
  // Neoadjuvant Regimens
  {
    id: "gi-colorectal-001",
    name: "FOLFOX (Neoadjuvant)",
    subtype: "Colorectal",
    category: "neoadjuvant",
    lineOfTherapy: "first-line",
    description: "Neoadjuvant FOLFOX for locally advanced rectal cancer (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 6,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "2 h",
        dilution: "250-500 mL D5W",
        availableSolvents: ["D5W"],
        availableVolumes: [250, 500],
        notes: "Neurotoxicity monitoring, use only Glucose 5%"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "2 h",
        dilution: "250 mL NS",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250, 500]
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS",
        notes: "Bolus, omit if hematologic toxicity"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 h",
        notes: "Continuous infusion, DPD testing recommended"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe neuropathy", "Renal impairment CrCl <30"]
    },
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 min before",
        category: "antiemetic",
        indication: "CINV prevention",
        isRequired: true,
        isStandard: true
      },
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 min before",
        category: "corticosteroid",
        indication: "CINV prevention",
        isRequired: true,
        isStandard: true
      }
    ]
  },

  // Adjuvant Regimens
  {
    id: "gi-colorectal-002",
    name: "FOLFOX (Adjuvant)",
    subtype: "Colorectal",
    category: "adjuvant",
    lineOfTherapy: "first-line",
    description: "Standard adjuvant therapy for stage III colon cancer (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "2 h",
        dilution: "250-500 mL D5W",
        availableSolvents: ["D5W"],
        availableVolumes: [250, 500],
        notes: "Neurotoxicity monitoring"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250, 500]
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2-5 minutes",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h",
        notes: "Continuous infusion"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2]
    }
  },

  // First-line Metastatic Regimens
  {
    id: "gi-colorectal-003",
    name: "mFOLFOX6",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Colorectal metastatic first-line (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h",
        dilution: "250-500 mL D5W",
        availableSolvents: ["D5W"],
        availableVolumes: [250, 500],
        notes: "Use only Glucose 5%, neurotoxicity monitoring"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250, 500]
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus, omit if hematologic toxicity"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h",
        notes: "Continuous infusion, DPD testing recommended"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2]
    }
  },

  {
    id: "gi-colorectal-004",
    name: "FOLFIRI",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Colorectal metastatic 1L or 2L (HSE/NCCP, NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "90 min",
        dilution: "250-500 mL D5W or NS",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [250, 500],
        notes: "UGT1A1*28 testing, atropine premedication"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "2 h",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250, 500]
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
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

  // Additional Colorectal Regimens - First Line Metastatic
  {
    id: "gi-colorectal-005",
    name: "mFOLFOX7",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Modified FOLFOX7 for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h",
        dilution: "250-500 mL D5W",
        availableSolvents: ["D5W"],
        availableVolumes: [250, 500],
        notes: "Use only Glucose 5%"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250, 500]
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h",
        notes: "Continuous infusion, no bolus"
      }
    ]
  },

  {
    id: "gi-colorectal-006",
    name: "FOLFOX + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFOX with bevacizumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h",
        availableSolvents: ["D5W"],
        availableVolumes: [250, 500]
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h",
        notes: "Continuous infusion"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min",
        notes: "Monitor for hypertension, proteinuria, bleeding"
      }
    ]
  },

  {
    id: "gi-colorectal-007",
    name: "FOLFOX + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFOX with panitumumab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min",
        notes: "KRAS/NRAS/BRAF WT required, left-sided preferred"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true,
        testingMethod: "NGS/PCR"
      }
    ]
  },

  {
    id: "gi-colorectal-008",
    name: "FOLFOX + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFOX with cetuximab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        administrationDuration: "2 h",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-009",
    name: "CAPEOX",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Capecitabine and oxaliplatin for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "130",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h",
        availableSolvents: ["D5W"],
        availableVolumes: [250, 500]
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-14",
        drugClass: "chemotherapy",
        notes: "Twice daily, with food, DPD testing recommended"
      }
    ]
  },

  {
    id: "gi-colorectal-010",
    name: "CAPEOX + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "CAPEOX with bevacizumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "130",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-14",
        drugClass: "chemotherapy",
        notes: "Twice daily with food"
      },
      {
        name: "Bevacizumab",
        dosage: "7.5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  {
    id: "gi-colorectal-011",
    name: "CAPEOX + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "CAPEOX with cetuximab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "130",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-14",
        drugClass: "chemotherapy",
        notes: "Twice daily with food"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-012",
    name: "CAPEOX + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "CAPEOX with panitumumab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "130",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-14",
        drugClass: "chemotherapy",
        notes: "Twice daily with food"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-013",
    name: "FOLFIRI + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFIRI with bevacizumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min",
        notes: "UGT1A1*28 testing recommended"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  {
    id: "gi-colorectal-014",
    name: "FOLFIRI + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFIRI with cetuximab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-015",
    name: "FOLFIRI + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFIRI with panitumumab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
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
  },

  // Additional Colorectal Regimens - Second/Third Line and Special Populations
  {
    id: "gi-colorectal-016",
    name: "FOLFIRI + Ziv-aflibercept",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "FOLFIRI with ziv-aflibercept for second-line metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Ziv-aflibercept",
        dosage: "4",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min",
        notes: "Monitor for hypertension, proteinuria"
      }
    ]
  },

  {
    id: "gi-colorectal-017",
    name: "FOLFIRI + Ramucirumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "FOLFIRI with ramucirumab for second-line metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Ramucirumab",
        dosage: "8",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ]
  },

  {
    id: "gi-colorectal-018",
    name: "FOLFIRINOX",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFIRINOX for fit patients with metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Age >75", "Significant comorbidities"]
    }
  },

  {
    id: "gi-colorectal-019",
    name: "Modified FOLFIRINOX",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Modified FOLFIRINOX with reduced toxicity for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Irinotecan",
        dosage: "150",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min",
        notes: "Reduced dose"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h",
        notes: "No bolus"
      }
    ]
  },

  {
    id: "gi-colorectal-020",
    name: "FOLFIRINOX + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "FOLFIRINOX with bevacizumab for fit patients with metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  {
    id: "gi-colorectal-021",
    name: "IROX",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Irinotecan and oxaliplatin for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "200",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      }
    ]
  },

  {
    id: "gi-colorectal-022",
    name: "IROX + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "IROX with bevacizumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "200",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Bevacizumab",
        dosage: "7.5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  {
    id: "gi-colorectal-023",
    name: "5-FU/Leucovorin (Roswell Park)",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "5-FU/Leucovorin Roswell Park regimen for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Weekly x 6, then 2 weeks off",
    cycles: 8,
    drugs: [
      {
        name: "Leucovorin",
        dosage: "500",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "500",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "1 h",
        notes: "Start 1 hour after leucovorin"
      }
    ]
  },

  {
    id: "gi-colorectal-024",
    name: "5-FU/Leucovorin (sLV5FU2)",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Simplified LV5FU2 regimen for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      }
    ]
  },

  {
    id: "gi-colorectal-025",
    name: "5-FU/Leucovorin (Weekly)",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Weekly 5-FU/Leucovorin for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Weekly",
    cycles: 24,
    drugs: [
      {
        name: "Leucovorin",
        dosage: "20",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "425",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Daily x 5, repeat weekly"
      }
    ]
  },

  {
    id: "gi-colorectal-026",
    name: "5-FU + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "5-FU with bevacizumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  {
    id: "gi-colorectal-027",
    name: "Capecitabine",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Capecitabine monotherapy for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Capecitabine",
        dosage: "1250",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-14",
        drugClass: "chemotherapy",
        notes: "Twice daily with food, DPD testing recommended"
      }
    ]
  },

  {
    id: "gi-colorectal-028",
    name: "Capecitabine + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Capecitabine with bevacizumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Capecitabine",
        dosage: "1250",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-14",
        drugClass: "chemotherapy",
        notes: "Twice daily with food"
      },
      {
        name: "Bevacizumab",
        dosage: "7.5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  // Targeted and Immunotherapy Regimens
  {
    id: "gi-colorectal-029",
    name: "Regorafenib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "third-line",
    description: "Regorafenib for refractory metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q28d",
    cycles: 999,
    drugs: [
      {
        name: "Regorafenib",
        dosage: "160",
        unit: "mg",
        route: "PO",
        day: "Days 1-21",
        drugClass: "targeted",
        notes: "Daily x 3 weeks, then 1 week off. Take with low-fat meal"
      }
    ]
  },

  {
    id: "gi-colorectal-030",
    name: "Trifluridine + Tipiracil",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "third-line",
    description: "Trifluridine/tipiracil for refractory metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q28d",
    cycles: 999,
    drugs: [
      {
        name: "Trifluridine + Tipiracil",
        dosage: "35",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-5, 8-12",
        drugClass: "chemotherapy",
        notes: "Twice daily within 1 hour of eating"
      }
    ]
  },

  {
    id: "gi-colorectal-031",
    name: "Trifluridine + Tipiracil + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "third-line",
    description: "Trifluridine/tipiracil with bevacizumab for refractory metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q28d",
    cycles: 999,
    drugs: [
      {
        name: "Trifluridine + Tipiracil",
        dosage: "35",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-5, 8-12",
        drugClass: "chemotherapy",
        notes: "Twice daily within 1 hour of eating"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "Days 1, 15",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  // Immunotherapy for MSI-H/dMMR
  {
    id: "gi-colorectal-032",
    name: "Nivolumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Nivolumab for dMMR/MSI-H metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 999,
    drugs: [
      {
        name: "Nivolumab",
        dosage: "240",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
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
    id: "gi-colorectal-033",
    name: "Nivolumab + Ipilimumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Nivolumab with ipilimumab for dMMR/MSI-H metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d for 4 cycles, then nivolumab q14d",
    cycles: 999,
    drugs: [
      {
        name: "Nivolumab",
        dosage: "3",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        administrationDuration: "30 min"
      },
      {
        name: "Ipilimumab",
        dosage: "1",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        administrationDuration: "90 min",
        notes: "For first 4 cycles only"
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

  {
    id: "gi-colorectal-034",
    name: "Dostarlimab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Dostarlimab for dMMR/MSI-H metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d for 4 cycles, then q42d",
    cycles: 999,
    drugs: [
      {
        name: "Dostarlimab",
        dosage: "500",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        administrationDuration: "30 min",
        notes: "500mg q3w x 4, then 1000mg q6w"
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

  {
    id: "gi-colorectal-035",
    name: "Cemiplimab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Cemiplimab for dMMR/MSI-H metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 999,
    drugs: [
      {
        name: "Cemiplimab",
        dosage: "350",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        administrationDuration: "30 min"
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

  // Molecular Targeted Therapies
  {
    id: "gi-colorectal-036",
    name: "Trastuzumab + Pertuzumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Trastuzumab with pertuzumab for HER2-amplified, RAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 999,
    drugs: [
      {
        name: "Trastuzumab",
        dosage: "8",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        administrationDuration: "90 min",
        notes: "Loading dose, then 6 mg/kg q3w"
      },
      {
        name: "Pertuzumab",
        dosage: "840",
        unit: "mg",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        administrationDuration: "60 min",
        notes: "Loading dose, then 420 mg q3w"
      }
    ],
    biomarkerRequirements: [
      {
        name: "HER2",
        status: "amplified" as const,
        required: true,
        testingMethod: "IHC/FISH"
      },
      {
        name: "RAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-037",
    name: "Fam-trastuzumab deruxtecan",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "third-line",
    description: "Fam-trastuzumab deruxtecan for HER2-amplified (IHC 3+) metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 999,
    drugs: [
      {
        name: "Fam-trastuzumab deruxtecan",
        dosage: "6.4",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min",
        notes: "Monitor for ILD/pneumonitis"
      }
    ],
    biomarkerRequirements: [
      {
        name: "HER2",
        status: "amplified" as const,
        required: true,
        testingMethod: "IHC 3+"
      }
    ]
  },

  {
    id: "gi-colorectal-038",
    name: "Encorafenib + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Encorafenib with panitumumab for BRAF V600E metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily + q14d",
    cycles: 999,
    drugs: [
      {
        name: "Encorafenib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        notes: "Daily continuous dosing"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
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

  // KRAS G12C Inhibitors
  {
    id: "gi-colorectal-039",
    name: "Adagrasib + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Adagrasib with cetuximab for KRAS G12C metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily + weekly",
    cycles: 999,
    drugs: [
      {
        name: "Adagrasib",
        dosage: "600",
        unit: "mg",
        route: "PO",
        day: "Twice daily",
        drugClass: "targeted",
        notes: "With food"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS G12C",
        status: "mutated" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-040",
    name: "Sotorasib + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Sotorasib with cetuximab for KRAS G12C metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily + weekly",
    cycles: 999,
    drugs: [
      {
        name: "Sotorasib",
        dosage: "960",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        notes: "Without food"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS G12C",
        status: "mutated" as const,
        required: true
      }
    ]
  }
];

// Additional missing colorectal regimens to complete the list
const additionalColorectalRegimens: Regimen[] = [
  // NTRK Fusion-Positive Regimens
  {
    id: "gi-colorectal-041",
    name: "Larotrectinib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Larotrectinib for NTRK gene fusion-positive metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily",
    cycles: 999,
    drugs: [
      {
        name: "Larotrectinib",
        dosage: "100",
        unit: "mg",
        route: "PO",
        day: "Twice daily",
        drugClass: "targeted",
        notes: "With or without food"
      }
    ],
    biomarkerRequirements: [
      {
        name: "NTRK gene fusion",
        status: "positive" as const,
        required: true,
        testingMethod: "RNA sequencing/IHC"
      }
    ]
  },

  {
    id: "gi-colorectal-042",
    name: "Entrectinib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Entrectinib for NTRK gene fusion-positive metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily",
    cycles: 999,
    drugs: [
      {
        name: "Entrectinib",
        dosage: "600",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        notes: "With food"
      }
    ],
    biomarkerRequirements: [
      {
        name: "NTRK gene fusion",
        status: "positive" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-043",
    name: "Repotrectinib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Repotrectinib for NTRK gene fusion-positive metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily",
    cycles: 999,
    drugs: [
      {
        name: "Repotrectinib",
        dosage: "160",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        notes: "With food"
      }
    ],
    biomarkerRequirements: [
      {
        name: "NTRK gene fusion",
        status: "positive" as const,
        required: true
      }
    ]
  },

  // RET Fusion-Positive
  {
    id: "gi-colorectal-044",
    name: "Selpercatinib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Selpercatinib for RET gene fusion-positive metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily",
    cycles: 999,
    drugs: [
      {
        name: "Selpercatinib",
        dosage: "160",
        unit: "mg",
        route: "PO",
        day: "Twice daily",
        drugClass: "targeted",
        notes: "Without food (2h before or 1h after meals)"
      }
    ],
    biomarkerRequirements: [
      {
        name: "RET gene fusion",
        status: "positive" as const,
        required: true
      }
    ]
  },

  // Irinotecan-based regimens
  {
    id: "gi-colorectal-045",
    name: "Irinotecan",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Irinotecan monotherapy for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "350",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min",
        notes: "UGT1A1*28 testing recommended"
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
    id: "gi-colorectal-046",
    name: "Irinotecan + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Irinotecan with cetuximab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d + weekly",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "350",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-047",
    name: "Irinotecan + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Irinotecan with panitumumab for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "350",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-048",
    name: "Irinotecan + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Irinotecan with bevacizumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "350",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "90 min"
      }
    ]
  },

  {
    id: "gi-colorectal-049",
    name: "Irinotecan + Ramucirumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Irinotecan with ramucirumab for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Ramucirumab",
        dosage: "8",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ]
  },

  {
    id: "gi-colorectal-050",
    name: "Irinotecan + Ziv-aflibercept",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Irinotecan with ziv-aflibercept for metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min"
      },
      {
        name: "Ziv-aflibercept",
        dosage: "4",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ]
  },

  // Monotherapy targeted agents
  {
    id: "gi-colorectal-051",
    name: "Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Cetuximab monotherapy for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025, category 2B)",
    schedule: "Weekly",
    cycles: 999,
    drugs: [
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        administrationDuration: "2 h",
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-052",
    name: "Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Panitumumab monotherapy for KRAS/NRAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025, category 2B)",
    schedule: "q14d",
    cycles: 999,
    drugs: [
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS/NRAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  // Additional immunotherapy agents
  {
    id: "gi-colorectal-053",
    name: "Retifanlimab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Retifanlimab for dMMR/MSI-H metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q28d",
    cycles: 999,
    drugs: [
      {
        name: "Retifanlimab",
        dosage: "500",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        administrationDuration: "30 min"
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

  {
    id: "gi-colorectal-054",
    name: "Tislelizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Tislelizumab for dMMR/MSI-H metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 999,
    drugs: [
      {
        name: "Tislelizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        administrationDuration: "60 min"
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

  {
    id: "gi-colorectal-055",
    name: "Toripalimab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Toripalimab for dMMR/MSI-H metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d",
    cycles: 999,
    drugs: [
      {
        name: "Toripalimab",
        dosage: "240",
        unit: "mg",
        route: "IV",  
        day: "Day 1",
        drugClass: "immunotherapy",
        administrationDuration: "60 min"
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

  // Additional HER2-targeted combinations
  {
    id: "gi-colorectal-056",
    name: "Trastuzumab + Lapatinib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Trastuzumab with lapatinib for HER2-amplified, RAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d + daily",
    cycles: 999,
    drugs: [
      {
        name: "Trastuzumab",
        dosage: "8",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        administrationDuration: "90 min",
        notes: "Loading dose, then 6 mg/kg q3w"
      },
      {
        name: "Lapatinib",
        dosage: "1250",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        notes: "1 hour before or after food"
      }
    ],
    biomarkerRequirements: [
      {
        name: "HER2",
        status: "amplified" as const,
        required: true
      },
      {
        name: "RAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-057",
    name: "Trastuzumab + Tucatinib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Trastuzumab with tucatinib for HER2-amplified, RAS/BRAF WT metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "q21d + daily",
    cycles: 999,
    drugs: [
      {
        name: "Trastuzumab",
        dosage: "8",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
        administrationDuration: "90 min",
        notes: "Loading dose, then 6 mg/kg q3w"
      },
      {
        name: "Tucatinib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Twice daily",
        drugClass: "targeted",
        notes: "With or without food"
      }
    ],
    biomarkerRequirements: [
      {
        name: "HER2",
        status: "amplified" as const,
        required: true
      },
      {
        name: "RAS/BRAF",
        status: "wild-type" as const,
        required: true
      }
    ]
  },

  // BRAF V600E combinations with chemotherapy
  {
    id: "gi-colorectal-058",
    name: "Encorafenib + FOLFOX + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Encorafenib with FOLFOX and cetuximab for BRAF V600E metastatic colorectal cancer (NCCN 3.2025, category 2B)",
    schedule: "Daily + q14d + weekly",
    cycles: 12,
    drugs: [
      {
        name: "Encorafenib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted"
      },
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 cycle 1",
        drugClass: "targeted",
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

  {
    id: "gi-colorectal-059",
    name: "Encorafenib + FOLFOX + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Encorafenib with FOLFOX and panitumumab for BRAF V600E metastatic colorectal cancer (NCCN 3.2025, category 2B)",
    schedule: "Daily + q14d",
    cycles: 12,
    drugs: [
      {
        name: "Encorafenib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted"
      },
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "2 h"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        notes: "Bolus"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-3",
        drugClass: "chemotherapy",
        administrationDuration: "46 h"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
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

  // Additional KRAS G12C combinations
  {
    id: "gi-colorectal-060",
    name: "Adagrasib + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Adagrasib with panitumumab for KRAS G12C metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily + q14d",
    cycles: 999,
    drugs: [
      {
        name: "Adagrasib",
        dosage: "600",
        unit: "mg",
        route: "PO",
        day: "Twice daily",
        drugClass: "targeted",
        notes: "With food"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS G12C",
        status: "mutated" as const,
        required: true
      }
    ]
  },

  {
    id: "gi-colorectal-061",
    name: "Sotorasib + Panitumumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "Sotorasib with panitumumab for KRAS G12C metastatic colorectal cancer (NCCN 3.2025)",
    schedule: "Daily + q14d",
    cycles: 999,
    drugs: [
      {
        name: "Sotorasib",
        dosage: "960",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        notes: "Without food"
      },
      {
        name: "Panitumumab",
        dosage: "6",
        unit: "mg/kg",
        route: "IV",
        day: "Day 1",
        drugClass: "targeted",
        administrationDuration: "60 min"
      }
    ],
    biomarkerRequirements: [
      {
        name: "KRAS G12C",
        status: "mutated" as const,
        required: true
      }
    ]
  }
];

// Combine original regimens with additional colorectal regimens
export const gastrointestinalCancerRegimens: Regimen[] = [
  ...originalRegimens,
  ...additionalColorectalRegimens
];