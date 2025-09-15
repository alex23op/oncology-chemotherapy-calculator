import { Regimen, Premedication } from "@/types/regimens";

export const headNeckRegimens: Regimen[] = [
  // Chemoradiation Concomitant (Head & Neck Locally Advanced)
  {
    id: "00332a",
    name: "Carboplatin AUC1.5 weekly + RT (7 cycles)",
    description: "Post-induction TCF for locally advanced HNC (Stage III-IV SCC)",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "Weekly × 7 with concurrent RT",
    cycles: 7,
    drugs: [
      {
        name: "Carboplatin",
        dosage: "AUC1.5",
        unit: "AUC",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "30 minutes",
        dilution: "250 mL Glucose 5%",
        monitoring: ["CBC", "Renal function", "Hearing assessment"]
      }
    ],
    premedications: [
      {
        name: "Granisetron",
        dosage: "1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe renal impairment", "Hearing loss"]
    },
    mechanismOfAction: "Platinum-based radiosensitization",
    responseRates: {
      overall: 70,
      progressionFreeSurvival: "18-24 months"
    }
  },

  {
    id: "00419a",
    name: "Cisplatin weekly (AUC2) + RT",
    description: "Nasopharyngeal III-IV when standard cisplatin contraindicated",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "Weekly with concurrent RT",
    cycles: 7,
    drugs: [
      {
        name: "Cisplatin",
        dosage: "40",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "250 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe renal impairment", "Hearing loss", "Severe neuropathy"]
    }
  },

  {
    id: "00591a",
    name: "Carboplatin AUC4 + 5-FU 600 mg/m² with RT",
    description: "Concurrent chemoradiation for locally advanced head and neck cancer",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "q21d × 3 with concurrent RT",
    cycles: 3,
    drugs: [
      {
        name: "Carboplatin",
        dosage: "AUC4",
        unit: "AUC",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "500 mL Glucose 5%",
        monitoring: ["CBC", "Renal function"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "600",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "96 hours CI",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Granisetron",
        dosage: "1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    }
  },

  {
    id: "00552a",
    name: "Carboplatin AUC5 + 5-FU 1000 mg/m²/day (28d)",
    description: "Adjuvant post-chemoradiation for NPC III-IV",
    category: "adjuvant",
    lineOfTherapy: "first-line",
    schedule: "q28d × 3 cycles",
    cycles: 3,
    drugs: [
      {
        name: "Carboplatin",
        dosage: "AUC5",
        unit: "AUC",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "500 mL Glucose 5%",
        monitoring: ["CBC", "Renal function"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "1000",
        unit: "mg/m²/day",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "22 hours/day",
        dilution: "500 mL Glucose 5% + 1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    }
  },

  {
    id: "00589a",
    name: "Carboplatin 70 mg/m² + 5-FU 600 mg/m² with RT",
    description: "Concurrent chemoradiation q21d × 3",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "q21d × 3 with concurrent RT",
    cycles: 3,
    drugs: [
      {
        name: "Carboplatin",
        dosage: "70",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "250 mL Glucose 5%",
        monitoring: ["CBC", "Renal function"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "600",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "96 hours",
        dilution: "Infusion pump over 96h",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Granisetron",
        dosage: "1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    }
  },

  {
    id: "00314a",
    name: "Cisplatin + 5-FU (28d)",
    description: "Cisplatin 25 mg/m² + 5-FU 1000 mg/m²/day q28d",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "q28d",
    cycles: 6,
    drugs: [
      {
        name: "Cisplatin",
        dosage: "25",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "250 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "1000",
        unit: "mg/m²/day",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "24 hours CI",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment", "Hearing loss"]
    }
  },

  {
    id: "00315a",
    name: "TCF Induction (Docetaxel, Cisplatin, 5-FU) → RT",
    description: "Docetaxel 75 mg/m² + Cisplatin 75 mg/m² + 5-FU 1000 mg/m²/day × 4, then RT + Carboplatin AUC1.5 weekly × 7",
    category: "neoadjuvant",
    lineOfTherapy: "first-line",
    schedule: "q21d × 3 cycles, then concurrent RT + Carboplatin",
    cycles: 3,
    drugs: [
      {
        name: "Docetaxel",
        dosage: "75",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Taxane (microtubule stabilizer)",
        administrationDuration: "60 minutes",
        dilution: "250 mL Normal saline 0.9%",
        monitoring: ["CBC", "LFTs", "Fluid retention"]
      },
      {
        name: "Cisplatin",
        dosage: "75",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "500 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "1000",
        unit: "mg/m²/day",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "24 hours CI",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "PO",
        timing: "12h, 3h, and 1h before docetaxel",
        category: "corticosteroid",
        indication: "Prevention of hypersensitivity and fluid retention",
        isRequired: true,
        isStandard: true,
        administrationDuration: "PO"
      },
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["DPD deficiency", "Severe renal impairment", "Severe hepatic impairment"]
    }
  },

  // Systemic/Targeted Therapy (H&N)
  {
    id: "00207b",
    name: "Cetuximab + RT",
    description: "Cetuximab loading dose + weekly maintenance with concurrent RT",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "Loading dose then weekly × 7 with RT",
    cycles: 8,
    drugs: [
      {
        name: "Cetuximab",
        dosage: "400/250", // Loading/maintenance
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 (400 mg/m²), then weekly (250 mg/m²)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR monoclonal antibody",
        administrationDuration: "120 minutes (loading), 60 minutes (maintenance)",
        dilution: "Normal saline 0.9%",
        monitoring: ["Skin toxicity", "Electrolytes", "Infusion reactions"]
      }
    ],
    premedications: [
      {
        name: "Diphenhydramine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antihistamine",
        indication: "Prevention of infusion reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe cardiac disease"]
    }
  },

  {
    id: "00418a",
    name: "Cetuximab + Carboplatin AUC5 + 5-FU 1000 mg/m²/day (21d)",
    description: "Triple combination therapy for recurrent/metastatic HNSCC",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q21d × 6 cycles",
    cycles: 6,
    drugs: [
      {
        name: "Cetuximab",
        dosage: "400/250",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 (400 mg/m² cycle 1, then 250 mg/m²)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR monoclonal antibody",
        administrationDuration: "120 minutes (loading), 60 minutes (maintenance)",
        dilution: "Normal saline 0.9%",
        monitoring: ["Skin toxicity", "Electrolytes", "Infusion reactions"]
      },
      {
        name: "Carboplatin",
        dosage: "AUC5",
        unit: "AUC",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "500 mL Glucose 5%",
        monitoring: ["CBC", "Renal function"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "1000",
        unit: "mg/m²/day",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "24 hours CI",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Diphenhydramine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before cetuximab",
        category: "antihistamine",
        indication: "Prevention of infusion reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      },
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    }
  },

  {
    id: "00417a",
    name: "Cetuximab + Cisplatin 100 mg/m² + 5-FU 1000 mg/m²/day (21d)",
    description: "Triple combination therapy for recurrent/metastatic HNSCC",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q21d × 6 cycles",
    cycles: 6,
    drugs: [
      {
        name: "Cetuximab",
        dosage: "400/250",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1 (400 mg/m² cycle 1, then 250 mg/m²)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR monoclonal antibody",
        administrationDuration: "120 minutes (loading), 60 minutes (maintenance)",
        dilution: "Normal saline 0.9%",
        monitoring: ["Skin toxicity", "Electrolytes", "Infusion reactions"]
      },
      {
        name: "Cisplatin",
        dosage: "100",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "1000",
        unit: "mg/m²/day",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "24 hours CI",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Diphenhydramine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before cetuximab",
        category: "antihistamine",
        indication: "Prevention of infusion reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      },
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment", "Hearing loss"]
    }
  },

  {
    id: "00385c",
    name: "Cisplatin 40 mg/m² weekly + RT",
    description: "Weekly cisplatin with concurrent radiotherapy",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "Weekly × 6-7 with RT",
    cycles: 7,
    drugs: [
      {
        name: "Cisplatin",
        dosage: "40",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "250 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe renal impairment", "Hearing loss"]
    }
  },

  {
    id: "00387a",
    name: "Cisplatin 100 mg/m² + RT",
    description: "High-dose cisplatin with concurrent radiotherapy",
    category: "advanced",
    lineOfTherapy: "first-line",
    schedule: "q21d × 3 with RT",
    cycles: 3,
    drugs: [
      {
        name: "Cisplatin",
        dosage: "100",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Severe renal impairment", "Hearing loss"]
    }
  },

  {
    id: "00615a",
    name: "Cisplatin monotherapy q21d",
    description: "Cisplatin monotherapy for advanced salivary gland tumors",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q21d × 6 cycles",
    cycles: 6,
    drugs: [
      {
        name: "Cisplatin",
        dosage: "80",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "500 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe renal impairment", "Hearing loss"]
    }
  },

  {
    id: "00514a",
    name: "Gemcitabine 1250 mg/m² monotherapy",
    description: "Gemcitabine monotherapy for recurrent/metastatic NPC",
    category: "metastatic",
    lineOfTherapy: "second-line",
    schedule: "Days 1, 8 q21d × 6 cycles",
    cycles: 6,
    drugs: [
      {
        name: "Gemcitabine",
        dosage: "1250",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1, 8",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "30 minutes",
        dilution: "250 mL Normal saline 0.9%",
        monitoring: ["CBC", "LFTs", "Pulmonary function"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "4",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: false,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe hepatic impairment"]
    }
  },

  {
    id: "00517a",
    name: "Gemcitabine + Cisplatin 80 mg/m² (21d)",
    description: "Gemcitabine days 1&8 + Cisplatin day 1, q21d × 4-6 cycles",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q21d × 4-6 cycles",
    cycles: 6,
    drugs: [
      {
        name: "Gemcitabine",
        dosage: "1250",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1, 8",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "30 minutes",
        dilution: "250 mL Normal saline 0.9%",
        monitoring: ["CBC", "LFTs", "Pulmonary function"]
      },
      {
        name: "Cisplatin",
        dosage: "80",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "500 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      }
    ],
    premedications: [
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of delayed CINV",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe renal impairment", "Hearing loss", "Severe hepatic impairment"]
    }
  },

  {
    id: "00696a",
    name: "Paclitaxel d1,8,15 + Cetuximab d1,15 (28d)",
    description: "Weekly paclitaxel with biweekly cetuximab, q28d cycles",
    category: "metastatic",
    lineOfTherapy: "second-line",
    schedule: "q28d cycles",
    cycles: 6,
    drugs: [
      {
        name: "Paclitaxel",
        dosage: "80",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1, 8, 15",
        drugClass: "chemotherapy",
        mechanismOfAction: "Taxane (microtubule stabilizer)",
        administrationDuration: "60 minutes",
        dilution: "250 mL Normal saline 0.9%",
        monitoring: ["CBC", "Neuropathy assessment", "Hypersensitivity reactions"]
      },
      {
        name: "Cetuximab",
        dosage: "400/250",
        unit: "mg/m²",
        route: "IV",
        day: "Days 1, 15 (400 mg/m² cycle 1, then 250 mg/m²)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR monoclonal antibody",
        administrationDuration: "120 minutes (loading), 60 minutes (maintenance)",
        dilution: "Normal saline 0.9%",
        monitoring: ["Skin toxicity", "Electrolytes", "Infusion reactions"]
      }
    ],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before paclitaxel",
        category: "corticosteroid",
        indication: "Prevention of hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      },
      {
        name: "Diphenhydramine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antihistamine",
        indication: "Prevention of hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      },
      {
        name: "Ranitidine",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before paclitaxel",
        category: "h2_blocker",
        indication: "Prevention of hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe neuropathy", "Severe cardiac disease"]
    }
  },

  // Pembrolizumab regimens
  {
    id: "00455h",
    name: "Pembrolizumab 200 mg monotherapy",
    description: "Pembrolizumab monotherapy for HNSCC CPS ≥ 1",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q3w",
    cycles: 35, // Maximum cycles per label
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "30 minutes",
        dilution: "100 mL Normal saline 0.9%",
        monitoring: ["CBC", "LFTs", "Endocrine panel", "Immune-related AEs"]
      }
    ],
    premedications: [],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["PD-L1 CPS ≥ 1"],
      contraindications: ["Active autoimmune disease", "Severe immunodeficiency"]
    },
    mechanismOfAction: "PD-1 checkpoint inhibition",
    responseRates: {
      overall: 17,
      progressionFreeSurvival: "3.4 months"
    }
  },

  {
    id: "00558h",
    name: "Pembrolizumab 400 mg monotherapy",
    description: "Pembrolizumab 400 mg q6w dosing",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q6w",
    cycles: 18, // Equivalent to 35 q3w cycles
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "400",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "30 minutes",
        dilution: "100 mL Normal saline 0.9%",
        monitoring: ["CBC", "LFTs", "Endocrine panel", "Immune-related AEs"]
      }
    ],
    premedications: [],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["PD-L1 CPS ≥ 1"],
      contraindications: ["Active autoimmune disease", "Severe immunodeficiency"]
    }
  },

  {
    id: "00705a",
    name: "Pembrolizumab + Carboplatin (AUC5) + 5-Fluorouracil",
    description: "1L HNSCC metastatic/recurrent, PD-L1 CPS ≥ 1; q21d × 6, then pembrolizumab maintenance",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q21d × 6 cycles, then pembrolizumab maintenance q3w/q6w",
    cycles: 6,
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "30 minutes",
        dilution: "100 mL Normal saline 0.9%",
        monitoring: ["CBC", "LFTs", "Endocrine panel", "Immune-related AEs"]
      },
      {
        name: "Carboplatin",
        dosage: "AUC5",
        unit: "AUC",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "500 mL Glucose 5%",
        monitoring: ["CBC", "Renal function"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "1000",
        unit: "mg/m²/day",
        route: "IV",
        day: "Days 1-4 (CI)",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "22 hours/day (CI)",
        dilution: "1000 mL Normal saline 0.9% (infusion pump)",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of nausea and hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      },
      {
        name: "Granisetron",
        dosage: "1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["PD-L1 CPS ≥ 1"],
      contraindications: ["DPD deficiency", "Severe renal impairment", "Active autoimmune disease"]
    },
    mechanismOfAction: "Combination immunotherapy with platinum-based chemotherapy",
    responseRates: {
      overall: 36,
      progressionFreeSurvival: "13.0 months"
    }
  },

  {
    id: "00706a",
    name: "Pembrolizumab + Cisplatin + 5-FU",
    description: "Pembrolizumab + cisplatin + 5-FU for recurrent/metastatic HNSCC",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "q21d × 6 cycles, then pembrolizumab maintenance",
    cycles: 6,
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "Day 1",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "30 minutes",
        dilution: "100 mL Normal saline 0.9%",
        monitoring: ["CBC", "LFTs", "Endocrine panel", "Immune-related AEs"]
      },
      {
        name: "Cisplatin",
        dosage: "100",
        unit: "mg/m²",
        route: "IV",
        day: "Day 1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum agent (DNA crosslinking)",
        administrationDuration: "60 minutes",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Renal function", "Hearing", "Electrolytes"]
      },
      {
        name: "5-Fluorouracil",
        dosage: "1000",
        unit: "mg/m²/day",
        route: "IV",
        day: "Days 1-4",
        drugClass: "chemotherapy",
        mechanismOfAction: "Pyrimidine analog",
        administrationDuration: "24 hours CI",
        dilution: "1000 mL Normal saline 0.9%",
        monitoring: ["CBC", "Mucositis", "DPD status"]
      }
    ],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "corticosteroid",
        indication: "Prevention of nausea and hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        administrationDuration: "15 minutes"
      },
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before",
        category: "antiemetic",
        indication: "Prevention of nausea/vomiting",
        isRequired: true,
        isStandard: true,
        administrationDuration: "5 minutes"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["PD-L1 CPS ≥ 1"],
      contraindications: ["DPD deficiency", "Severe renal impairment", "Hearing loss", "Active autoimmune disease"]
    }
  },

  // Thyroid Cancer Regimens
  {
    id: "00295a",
    name: "Lenvatinib (oral)",
    description: "Lenvatinib oral therapy for advanced/metastatic DTC refractory to RAI",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "Daily until progression",
    cycles: 0, // Continuous until progression
    drugs: [
      {
        name: "Lenvatinib",
        dosage: "24",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        mechanismOfAction: "Multi-kinase inhibitor (VEGFR, FGFR, PDGFR, RET, KIT)",
        administrationDuration: "Oral",
        monitoring: ["Blood pressure", "Cardiac function", "LFTs", "Renal function", "Thyroid function"]
      }
    ],
    premedications: [],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe cardiac disease", "Uncontrolled hypertension", "Severe hepatic impairment"]
    }
  },

  {
    id: "00294c",
    name: "Sorafenib (oral)",
    description: "Sorafenib oral therapy for DTC refractory to RAI",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "Daily until progression",
    cycles: 0,
    drugs: [
      {
        name: "Sorafenib",
        dosage: "400",
        unit: "mg",
        route: "PO",
        day: "BID daily",
        drugClass: "targeted",
        mechanismOfAction: "Multi-kinase inhibitor (VEGFR, PDGFR, RAF)",
        administrationDuration: "Oral",
        monitoring: ["Blood pressure", "Cardiac function", "LFTs", "Skin toxicity"]
      }
    ],
    premedications: [],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe cardiac disease", "Uncontrolled hypertension", "Severe hepatic impairment"]
    }
  },

  {
    id: "00242a",
    name: "Vandetanib (oral)",
    description: "Vandetanib oral therapy for advanced MTC",
    category: "metastatic",
    lineOfTherapy: "first-line",
    schedule: "Daily until progression",
    cycles: 0,
    drugs: [
      {
        name: "Vandetanib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "Daily",
        drugClass: "targeted",
        mechanismOfAction: "Multi-kinase inhibitor (VEGFR, EGFR, RET)",
        administrationDuration: "Oral",
        monitoring: ["ECG/QTc", "Blood pressure", "LFTs", "Thyroid function"]
      }
    ],
    premedications: [],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["QTc prolongation", "Severe cardiac disease", "Uncontrolled hypertension"]
    }
  }
];