import { Regimen } from "@/types/regimens";

export const gastrointestinalCancerRegimens: Regimen[] = [
  // COLORECTAL CANCER REGIMENS - Consolidated from separate colorectal category
  
  // Neoadjuvant Regimens
  {
    id: "gi-colorectal-001",
    name: "FOLFOX (Neoadjuvant)",
    subtype: "Colorectal",
    category: "neoadjuvant",
    lineOfTherapy: "first-line",
    description: "Neoadjuvant FOLFOX for locally advanced rectal cancer (HSE/NCCP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
    description: "Standard adjuvant therapy for stage III colon cancer (HSE/NCCP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
    description: "Colorectal metastatic first-line (HSE/NCCP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
    description: "Colorectal metastatic 1L or 2L (HSE/NCCP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
    id: "gi-colorectal-005",
    name: "CAPOX (XELOX)",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Colorectal metastatic or adjuvant (HSE/NCCP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "2 h",
        dilution: "500 mL D5W",
        availableSolvents: ["D5W"],
        availableVolumes: [250, 500],
        notes: "Neurotoxicity monitoring, use only Glucose 5%"
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-14 BID",
        drugClass: "chemotherapy",
        mechanismOfAction: "Oral fluoropyrimidine",
        notes: "Hand-foot syndrome, renal adjustment if CrCl <50 mL/min"
      }
    ],
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

  {
    id: "gi-colorectal-006",
    name: "FOLFOXIRI",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Intensive triplet therapy for fit patients with metastatic colorectal cancer (HSE/NCCP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "q14d",
    cycles: 12,
    drugs: [
      {
        name: "Irinotecan",
        dosage: "165",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "90 min",
        dilution: "250-500 mL D5W",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [250, 500],
        notes: "UGT1A1*28 testing"
      },
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
        notes: "Use only Glucose 5%"
      },
      {
        name: "Leucovorin",
        dosage: "200",
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
        dosage: "3200",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-2",
        drugClass: "chemotherapy",
        administrationDuration: "48 h",
        notes: "Continuous infusion"
      }
    ]
  },

  // Immunotherapy - NCCN 3.2025/ESMO 2024 Regimens
  {
    id: "gi-colorectal-007",
    name: "Pembrolizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "dMMR/MSI-H metastatic colorectal cancer, 1L (KEYNOTE-177, NCCN 3.2025/ESMO 2024). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "q21d",
    cycles: 35,
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "30 min",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250]
      }
    ],
    biomarkerRequirements: [
      {
        name: "MSI/MMR Status",
        status: "high" as const,
        required: true,
        testingMethod: "IHC/PCR",
        turnaroundTime: "5-7 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["MSI-H/dMMR"],
      contraindications: ["Active autoimmune disease", "Immunosuppressive therapy"]
    }
  },

  {
    id: "gi-colorectal-008",
    name: "Nivolumab + Ipilimumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "dMMR/MSI-H metastatic colorectal cancer, post-prior therapy (CheckMate 142, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "Nivolumab q2w + Ipilimumab q6w x4, then Nivolumab q2w",
    cycles: 999,
    drugs: [
      {
        name: "Nivolumab",
        dosage: "3",
        unit: "mg/kg",
        route: "IV",
        day: "q2w",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "30 min",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250]
      },
      {
        name: "Ipilimumab",
        dosage: "1",
        unit: "mg/kg",
        route: "IV",
        day: "q6w x4",
        drugClass: "immunotherapy",
        mechanismOfAction: "CTLA-4 inhibitor",
        administrationDuration: "30 min",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250]
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

  // Targeted Therapy - NCCN 3.2025/ESMO 2024
  {
    id: "gi-colorectal-009",
    name: "Encorafenib + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "second-line",
    description: "BRAF V600E metastatic colorectal cancer, 2L (BEACON CRC, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "Encorafenib daily + Cetuximab weekly",
    cycles: 999,
    drugs: [
      {
        name: "Encorafenib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        mechanismOfAction: "BRAF inhibitor",
        notes: "Take with food"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 (loading dose)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR inhibitor",
        administrationDuration: "2 h",
        availableSolvents: ["NS"],
        availableVolumes: [250, 500],
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "BRAF V600E",
        status: "mutated" as const,
        required: true,
        testingMethod: "NGS/PCR"
      }
    ],
    premedications: [
      {
        name: "Diphenhydramine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 min before",
        category: "antihistamine",
        indication: "Infusion reaction prevention",
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
        indication: "Infusion reaction prevention",
        isRequired: true,
        isStandard: true
      }
    ]
  },

  {
    id: "gi-colorectal-010",
    name: "FOLFIRI + Cetuximab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "RAS wild-type metastatic colorectal cancer (HSE/NCCP, NCCN 3.2025). RAS WT testing required. Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [250, 500]
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
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 (loading dose)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR inhibitor",
        administrationDuration: "2 h",
        availableSolvents: ["NS"],
        availableVolumes: [250, 500],
        notes: "Loading dose, then 250 mg/m² weekly"
      }
    ],
    biomarkerRequirements: [
      {
        name: "RAS (KRAS/NRAS)",
        status: "wild-type" as const,
        required: true,
        testingMethod: "NGS/PCR"
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
        indication: "Cholinergic symptom prevention",
        isRequired: true,
        isStandard: true
      },
      {
        name: "Diphenhydramine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 min before",
        category: "antihistamine",
        indication: "Infusion reaction prevention",
        isRequired: true,
        isStandard: true
      }
    ]
  },

  {
    id: "gi-colorectal-011",
    name: "FOLFOX + Bevacizumab",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "First-line therapy for metastatic colorectal cancer (HSE/NCCP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
        mechanismOfAction: "VEGF inhibitor",
        administrationDuration: "30-90 min",
        availableSolvents: ["NS"],
        availableVolumes: [100, 250],
        notes: "Monitor hypertension, proteinuria"
      }
    ]
  },

  // Refractory/Late-line therapy - NCCN 3.2025/ESMO 2024
  {
    id: "gi-colorectal-012",
    name: "Fruquintinib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "third-line",
    description: "Metastatic colorectal cancer, post-prior therapies (FRESCO-2, NCCN 3.2025/ESMO 2024). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "q28d",
    cycles: 999,
    drugs: [
      {
        name: "Fruquintinib",
        dosage: "5",
        unit: "mg",
        route: "PO",
        day: "Days 1-21",
        drugClass: "targeted",
        mechanismOfAction: "VEGFR inhibitor",
        notes: "Take with food, monitor hypertension"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Uncontrolled hypertension", "Recent GI bleeding"]
    }
  },

  {
    id: "gi-colorectal-013",
    name: "Trifluridine/Tipiracil (TAS-102)",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "third-line",
    description: "Refractory metastatic colorectal cancer (RECOURSE, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "q28d",
    cycles: 999,
    drugs: [
      {
        name: "Trifluridine/Tipiracil",
        dosage: "35",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-5, 8-12 BID",
        drugClass: "chemotherapy",
        mechanismOfAction: "Thymidine phosphorylase inhibitor",
        notes: "Take within 1 hour after meals"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Severe bone marrow suppression"]
    }
  },

  {
    id: "gi-colorectal-014",
    name: "Regorafenib",
    subtype: "Colorectal",
    category: "metastatic",
    lineOfTherapy: "third-line",
    description: "Refractory metastatic colorectal cancer (CORRECT, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
        mechanismOfAction: "Multi-kinase inhibitor",
        notes: "Take with low-fat breakfast, monitor liver function"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Child-Pugh B or C", "Uncontrolled hypertension"]
    }
  },

  // ESOPHAGEAL/GEJ CANCER REGIMENS
  {
    id: "gi-eso-001",
    name: "ECF (Epirubicin/Cisplatin/5-FU)",
    subtype: "Esophageal/GEJ",
    category: "perioperative",
    description: "Perioperative therapy for resectable esophagogastric cancer (MAGIC trial, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "q21d",
    cycles: 6,
    drugs: [
      {
        name: "Epirubicin",
        dosage: "50",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Anthracycline",
        administrationDuration: "15 min",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250],
        notes: "Monitor LVEF, cumulative dose limit"
      },
      {
        name: "Cisplatin",
        dosage: "60",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "1-3 h",
        availableSolvents: ["NS"],
        availableVolumes: [250, 500],
        notes: "Pre/post hydration, renal monitoring"
      },
      {
        name: "5-Fluorouracil",
        dosage: "200",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-21",
        drugClass: "chemotherapy",
        administrationDuration: "Continuous",
        notes: "Continuous infusion via pump"
      }
    ]
  },

  // GASTRIC CANCER REGIMENS  
  {
    id: "gi-gastric-001",
    name: "ECX (Epirubicin/Cisplatin/Capecitabine)",
    subtype: "Gastric",
    category: "perioperative",
    description: "Perioperative therapy for resectable gastric cancer (MAGIC trial, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "q21d",
    cycles: 6,
    drugs: [
      {
        name: "Epirubicin",
        dosage: "50",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "15 min",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [100, 250]
      },
      {
        name: "Cisplatin",
        dosage: "60",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "1-3 h",
        availableSolvents: ["NS"],
        availableVolumes: [250, 500]
      },
      {
        name: "Capecitabine",
        dosage: "625",
        unit: "mg/m²",
        route: "PO",
        day: "Days 1-21 BID",
        drugClass: "chemotherapy",
        notes: "Take with food"
      }
    ]
  },

  // PANCREATIC CANCER REGIMENS
  {
    id: "gi-panc-001", 
    name: "FOLFIRINOX",
    subtype: "Pancreatic",
    category: "metastatic",
    lineOfTherapy: "first-line",
    description: "Metastatic pancreatic adenocarcinoma, ECOG 0-1 (PRODIGE 4, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
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
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        administrationDuration: "90 min",
        availableSolvents: ["NS", "D5W"],
        availableVolumes: [250, 500]
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
    ]
  },

  // BILIARY TRACT CANCER REGIMENS
  {
    id: "gi-biliary-001",
    name: "Gemcitabine + Cisplatin",
    subtype: "Biliary Tract",
    category: "advanced",
    lineOfTherapy: "first-line",
    description: "Advanced biliary tract cancer (ABC-02, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "q21d",
    cycles: 8,
    drugs: [
      {
        name: "Gemcitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1, 8",
        drugClass: "chemotherapy",
        mechanismOfAction: "Nucleoside analog",
        administrationDuration: "30 min",
        availableSolvents: ["NS"],
        availableVolumes: [100, 250]
      },
      {
        name: "Cisplatin",
        dosage: "25",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1, 8",
        drugClass: "chemotherapy",
        administrationDuration: "1-3 h",
        availableSolvents: ["NS"],
        availableVolumes: [250, 500],
        notes: "Pre/post hydration required"
      }
    ]
  },

  // HEPATOCELLULAR CARCINOMA REGIMENS
  {
    id: "gi-hcc-001",
    name: "Sorafenib",
    subtype: "HCC",
    category: "advanced",
    lineOfTherapy: "first-line",
    description: "Advanced hepatocellular carcinoma (SHARP, NCCN 3.2025). Consult NCCN/ESMO guidelines and local policy before clinical use.",
    schedule: "Continuous",
    cycles: 999,
    drugs: [
      {
        name: "Sorafenib",
        dosage: "400",
        unit: "mg",
        route: "PO",
        day: "BID",
        drugClass: "targeted",
        mechanismOfAction: "Multi-kinase inhibitor",
        notes: "Take on empty stomach, monitor for hand-foot skin reaction"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Child-Pugh C", "Severe cardiac disease"]
    }
  }
];
