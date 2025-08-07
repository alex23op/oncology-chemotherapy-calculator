import { Regimen, Premedication } from "@/types/regimens";

export const colorectalCancerRegimens: Regimen[] = [
  // ============= NEOADJUVANT REGIMENS =============
  {
    id: "crc-folfox-neoadjuvant",
    name: "FOLFOX (Neoadjuvant)",
    description: "Neoadjuvant FOLFOX for locally advanced rectal cancer",
    category: "neoadjuvant",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe neuropathy", "Renal impairment CrCl <30"]
    },
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      }
    ],
    schedule: "Every 14 days",
    cycles: 8,
    mechanismOfAction: "DNA crosslinking and antimetabolite therapy",
    responseRates: {
      overall: 45,
      progressionFreeSurvival: "N/A (neoadjuvant)"
    }
  },
  {
    id: "crc-capox-neoadjuvant",
    name: "CAPOX (Neoadjuvant)",
    description: "Neoadjuvant capecitabine and oxaliplatin for rectal cancer",
    category: "neoadjuvant",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    },
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "130",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "1-14 BID",
        drugClass: "chemotherapy",
        mechanismOfAction: "Oral fluoropyrimidine",
        notes: "Take with food and water"
      }
    ],
    schedule: "Every 21 days",
    cycles: 6,
    mechanismOfAction: "Platinum and oral fluoropyrimidine combination",
    responseRates: {
      overall: 40,
      progressionFreeSurvival: "N/A (neoadjuvant)"
    }
  },
  {
    id: "crc-folfiri-neoadjuvant",
    name: "FOLFIRI (Neoadjuvant)",
    description: "Neoadjuvant FOLFIRI for locally advanced rectal cancer",
    category: "neoadjuvant",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["UGT1A1*28 homozygous", "Severe diarrhea history"]
    },
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "90 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      }
    ],
    schedule: "Every 14 days",
    cycles: 8,
    mechanismOfAction: "Topoisomerase I inhibition and antimetabolite therapy",
    responseRates: {
      overall: 42,
      progressionFreeSurvival: "N/A (neoadjuvant)"
    }
  },

  // ============= ADJUVANT REGIMENS =============
  {
    id: "crc-folfox-adjuvant",
    name: "FOLFOX (Adjuvant)",
    description: "Standard adjuvant therapy for stage III colon cancer",
    category: "adjuvant",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe neuropathy", "Renal impairment CrCl <30"]
    },
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "DNA crosslinking and antimetabolite therapy",
    responseRates: {
      overall: 75,
      progressionFreeSurvival: "N/A (adjuvant)"
    }
  },
  {
    id: "crc-capox-adjuvant",
    name: "CAPOX (Adjuvant)",
    description: "Oral alternative adjuvant therapy for stage III colon cancer",
    category: "adjuvant",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    },
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "130",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "1-14 BID",
        drugClass: "chemotherapy",
        mechanismOfAction: "Oral fluoropyrimidine",
        notes: "Take with food and water"
      }
    ],
    schedule: "Every 21 days",
    cycles: 8,
    mechanismOfAction: "Platinum and oral fluoropyrimidine combination",
    responseRates: {
      overall: 72,
      progressionFreeSurvival: "N/A (adjuvant)"
    }
  },
  {
    id: "crc-5fu-lv-adjuvant",
    name: "5-FU/Leucovorin (Adjuvant)",
    description: "For patients unable to tolerate oxaliplatin",
    category: "adjuvant",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency"]
    },
    drugs: [
      {
        name: "Leucovorin",
        dosage: "500",
        unit: "mg/m²",
        route: "IV",
        day: "1, 8, 15, 22, 29, 36",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "500",
        unit: "mg/m²",
        route: "IV",
        day: "1, 8, 15, 22, 29, 36",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "5-10 minutes",
        dilution: "50-100 mL NS"
      }
    ],
    schedule: "Weekly x 6 weeks, then 2 weeks break",
    cycles: 4,
    mechanismOfAction: "Antimetabolite therapy with folate enhancement",
    responseRates: {
      overall: 65,
      progressionFreeSurvival: "N/A (adjuvant)"
    }
  },
  {
    id: "crc-capecitabine-adjuvant",
    name: "Capecitabine (Adjuvant)",
    description: "Single-agent oral therapy for stage III colon cancer",
    category: "adjuvant",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    },
    drugs: [
      {
        name: "Capecitabine",
        dosage: "1250",
        unit: "mg/m²",
        route: "PO",
        day: "1-14 BID",
        drugClass: "chemotherapy",
        mechanismOfAction: "Oral fluoropyrimidine",
        notes: "Take with food and water"
      }
    ],
    schedule: "Every 21 days",
    cycles: 8,
    mechanismOfAction: "Oral fluoropyrimidine antimetabolite",
    responseRates: {
      overall: 60,
      progressionFreeSurvival: "N/A (adjuvant)"
    }
  },

  // ============= FIRST-LINE METASTATIC REGIMENS =============
  {
    id: "crc-folfoxiri-bevacizumab",
    name: "FOLFOXIRI + Bevacizumab",
    description: "Intensified chemotherapy with bevacizumab for fit patients with metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["Age ≤70 years preferred", "Good organ function"],
      contraindications: ["Age >75", "ECOG 2+", "Significant comorbidities", "Recent surgery", "Bleeding risk"]
    },
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before oxaliplatin",
        category: "corticosteroid",
        indication: "Hypersensitivity prophylaxis",
        isRequired: true,
        isStandard: true
      },
      {
        name: "Ondansetron",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        category: "antiemetic",
        indication: "Nausea/vomiting prophylaxis",
        isRequired: true,
        isStandard: true
      }
    ],
    drugs: [
      {
        name: "Irinotecan",
        dosage: "165",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "60 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV", 
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum analog",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "200",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "3200",
        unit: "mg/m²",
        route: "IV",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "48 hours continuous infusion",
        dilution: "Ambulatory pump"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "VEGF inhibitor",
        administrationDuration: "First: 90 min, then 60 min, then 30 min",
        dilution: "100 mL NS"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "Triple cytotoxic therapy with angiogenesis inhibition",
    responseRates: {
      overall: 65,
      progressionFreeSurvival: "12.3 months"
    }
  },
  // Neoadjuvant Regimens
  {
    id: "folfox-neoadj-crc",
    name: "FOLFOX (Neoadjuvant)",
    description: "Neoadjuvant therapy for locally advanced rectal cancer",
    category: "neoadjuvant",
    drugs: [
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "2 hours" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "2 hours" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1", dilution: "Normal saline 10-20mL", administrationDuration: "2-4 minutes" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2", dilution: "Normal saline 250-500mL", administrationDuration: "46 hours continuous" }
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
      { name: "Oxaliplatin", dosage: "130", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "2 hours" },
      { name: "Capecitabine", dosage: "1000", unit: "mg/m²", route: "PO", day: "BID days 1-14", dilution: "Take with food and water", administrationDuration: "N/A - oral medication" }
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
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "2 hours" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "2 hours" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1", dilution: "Normal saline 10-20mL", administrationDuration: "2-4 minutes" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2", dilution: "Normal saline 250-500mL", administrationDuration: "46 hours continuous" }
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
      { name: "Oxaliplatin", dosage: "130", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "2 hours" },
      { name: "Capecitabine", dosage: "1000", unit: "mg/m²", route: "PO", day: "BID days 1-14", dilution: "Take with food and water", administrationDuration: "N/A - oral medication" }
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
      { name: "Leucovorin", dosage: "500", unit: "mg/m²", route: "IV", day: "Days 1, 8, 15, 22, 29, 36", dilution: "Normal saline 50-100mL", administrationDuration: "2 hours" },
      { name: "5-Fluorouracil", dosage: "500", unit: "mg/m²", route: "IV", day: "Days 1, 8, 15, 22, 29, 36", dilution: "Normal saline 50-100mL", administrationDuration: "5-10 minutes" }
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
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "2 hours" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "2 hours" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1", dilution: "Normal saline 10-20mL", administrationDuration: "2-4 minutes" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2", dilution: "Normal saline 250-500mL", administrationDuration: "46 hours continuous" },
      { name: "Bevacizumab", dosage: "5", unit: "mg/kg", route: "IV", day: "Day 1", dilution: "Normal saline 100mL", administrationDuration: "30-90 minutes" }
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
      { name: "Irinotecan", dosage: "180", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "90 minutes" },
      { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "2 hours" },
      { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus", day: "Day 1", dilution: "Normal saline 10-20mL", administrationDuration: "2-4 minutes" },
      { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous", day: "Days 1-2", dilution: "Normal saline 250-500mL", administrationDuration: "46 hours continuous" },
      { name: "Bevacizumab", dosage: "5", unit: "mg/kg", route: "IV", day: "Day 1", dilution: "Normal saline 100mL", administrationDuration: "30-90 minutes" }
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
      { name: "Irinotecan", dosage: "165", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "90 minutes" },
      { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "2 hours" },
      { name: "Leucovorin", dosage: "200", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "Normal saline 50-100mL", administrationDuration: "2 hours" },
      { name: "5-Fluorouracil", dosage: "3200", unit: "mg/m²", route: "IV continuous", day: "Days 1-2", dilution: "Normal saline 250-500mL", administrationDuration: "46 hours continuous" },
      { name: "Bevacizumab", dosage: "5", unit: "mg/kg", route: "IV", day: "Day 1", dilution: "Normal saline 100mL", administrationDuration: "30-90 minutes" }
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
      { name: "Oxaliplatin", dosage: "130", unit: "mg/m²", route: "IV", day: "Day 1", dilution: "5% Dextrose 250-500mL", administrationDuration: "2 hours" },
      { name: "Capecitabine", dosage: "1000", unit: "mg/m²", route: "PO", day: "BID days 1-14", dilution: "Take with food and water", administrationDuration: "N/A - oral medication" },
      { name: "Bevacizumab", dosage: "7.5", unit: "mg/kg", route: "IV", day: "Day 1", dilution: "Normal saline 100mL", administrationDuration: "30-90 minutes" }
    ],
    schedule: "Every 3 weeks",
    cycles: 8
  },
  {
    id: "crc-folfox-bevacizumab-1l",
    name: "FOLFOX + Bevacizumab",
    description: "First-line therapy for metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Recent surgery", "Bleeding risk", "Uncontrolled hypertension"]
    },
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "VEGF inhibitor",
        administrationDuration: "30-90 minutes",
        dilution: "100 mL NS"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "DNA crosslinking, antimetabolite, and angiogenesis inhibition",
    responseRates: {
      overall: 48,
      progressionFreeSurvival: "9.4 months"
    }
  },
  {
    id: "crc-folfiri-bevacizumab-1l",
    name: "FOLFIRI + Bevacizumab",
    description: "Alternative first-line therapy for metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["UGT1A1*28 homozygous", "Severe diarrhea history"]
    },
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "90 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      },
      {
        name: "Bevacizumab",
        dosage: "5",
        unit: "mg/kg",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "VEGF inhibitor",
        administrationDuration: "30-90 minutes",
        dilution: "100 mL NS"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "Topoisomerase I inhibition, antimetabolite, and angiogenesis inhibition",
    responseRates: {
      overall: 44,
      progressionFreeSurvival: "8.5 months"
    }
  },
  {
    id: "crc-folfox-cetuximab-kras-wt",
    name: "FOLFOX + Cetuximab (KRAS WT)",
    description: "First-line therapy for KRAS wild-type metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["KRAS wild-type", "NRAS wild-type", "BRAF wild-type"],
      contraindications: ["KRAS/NRAS/BRAF mutations", "Severe skin reactions"]
    },
    biomarkerRequirements: [
      {
        name: "KRAS",
        status: "wild-type",
        required: true,
        testingMethod: "NGS or PCR",
        turnaroundTime: "3-5 days"
      },
      {
        name: "NRAS",
        status: "wild-type",
        required: true,
        testingMethod: "NGS or PCR",
        turnaroundTime: "3-5 days"
      }
    ],
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1 (first dose)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR inhibitor",
        administrationDuration: "120 minutes first dose",
        dilution: "250 mL NS",
        notes: "First dose 400 mg/m², then 250 mg/m² weekly"
      },
      {
        name: "Cetuximab",
        dosage: "250",
        unit: "mg/m²",
        route: "IV",
        day: "8, 15 (maintenance)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR inhibitor",
        administrationDuration: "60 minutes",
        dilution: "250 mL NS"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "DNA crosslinking, antimetabolite, and EGFR inhibition",
    responseRates: {
      overall: 61,
      progressionFreeSurvival: "10.0 months"
    }
  },
  {
    id: "crc-folfiri-cetuximab-kras-wt",
    name: "FOLFIRI + Cetuximab (KRAS WT)",
    description: "Second-line therapy for KRAS wild-type metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "second-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["KRAS wild-type", "NRAS wild-type", "BRAF wild-type"],
      contraindications: ["KRAS/NRAS/BRAF mutations", "Severe skin reactions"]
    },
    biomarkerRequirements: [
      {
        name: "KRAS",
        status: "wild-type",
        required: true,
        testingMethod: "NGS or PCR",
        turnaroundTime: "3-5 days"
      }
    ],
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "90 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1 (first dose)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR inhibitor",
        administrationDuration: "120 minutes first dose",
        dilution: "250 mL NS",
        notes: "First dose 400 mg/m², then 250 mg/m² weekly"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "Topoisomerase I inhibition, antimetabolite, and EGFR inhibition",
    responseRates: {
      overall: 46,
      progressionFreeSurvival: "8.9 months"
    }
  },
  {
    id: "crc-capox-bevacizumab-1l",
    name: "CAPOX + Bevacizumab",
    description: "Oral-based first-line therapy for metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["DPD deficiency", "Recent surgery", "Bleeding risk"]
    },
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "130",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "1-14 BID",
        drugClass: "chemotherapy",
        mechanismOfAction: "Oral fluoropyrimidine",
        notes: "Take with food and water"
      },
      {
        name: "Bevacizumab",
        dosage: "7.5",
        unit: "mg/kg",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "VEGF inhibitor",
        administrationDuration: "30-90 minutes",
        dilution: "100 mL NS"
      }
    ],
    schedule: "Every 21 days",
    cycles: 8,
    mechanismOfAction: "Platinum, oral fluoropyrimidine, and angiogenesis inhibition",
    responseRates: {
      overall: 46,
      progressionFreeSurvival: "8.0 months"
    }
  },

  // ============= SECOND-LINE METASTATIC REGIMENS =============
  {
    id: "crc-folfiri-2l",
    name: "FOLFIRI (Second-line)",
    description: "Second-line therapy after oxaliplatin-based first-line",
    category: "metastatic",
    lineOfTherapy: "second-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["UGT1A1*28 homozygous", "Severe diarrhea history"]
    },
    drugs: [
      {
        name: "Irinotecan",
        dosage: "180",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "90 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "Topoisomerase I inhibition and antimetabolite therapy",
    responseRates: {
      overall: 31,
      progressionFreeSurvival: "6.2 months"
    }
  },
  {
    id: "crc-folfox-2l",
    name: "FOLFOX (Second-line)",
    description: "Second-line therapy after irinotecan-based first-line",
    category: "metastatic",
    lineOfTherapy: "second-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      contraindications: ["Severe neuropathy", "Renal impairment CrCl <30"]
    },
    drugs: [
      {
        name: "Oxaliplatin",
        dosage: "85",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Platinum alkylating agent",
        administrationDuration: "120 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "DNA crosslinking and antimetabolite therapy",
    responseRates: {
      overall: 32,
      progressionFreeSurvival: "6.6 months"
    }
  },
  {
    id: "crc-irinotecan-cetuximab-2l",
    name: "Irinotecan + Cetuximab",
    description: "Second-line therapy for KRAS wild-type patients",
    category: "metastatic",
    lineOfTherapy: "second-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["KRAS wild-type", "NRAS wild-type"],
      contraindications: ["KRAS/NRAS mutations", "Severe skin reactions"]
    },
    biomarkerRequirements: [
      {
        name: "KRAS",
        status: "wild-type",
        required: true,
        testingMethod: "NGS or PCR",
        turnaroundTime: "3-5 days"
      }
    ],
    drugs: [
      {
        name: "Irinotecan",
        dosage: "350",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Topoisomerase I inhibitor",
        administrationDuration: "90 minutes",
        dilution: "250-500 mL D5W"
      },
      {
        name: "Cetuximab",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1 (first dose)",
        drugClass: "targeted",
        mechanismOfAction: "EGFR inhibitor",
        administrationDuration: "120 minutes first dose",
        dilution: "250 mL NS",
        notes: "First dose 400 mg/m², then 250 mg/m² weekly"
      }
    ],
    schedule: "Every 21 days",
    cycles: 8,
    mechanismOfAction: "Topoisomerase I inhibition and EGFR inhibition",
    responseRates: {
      overall: 23,
      progressionFreeSurvival: "4.0 months"
    }
  },

  // ============= THIRD-LINE AND SALVAGE REGIMENS =============
  {
    id: "crc-regorafenib-3l",
    name: "Regorafenib",
    description: "Third-line oral multi-kinase inhibitor for refractory metastatic CRC",
    category: "metastatic",
    lineOfTherapy: "third-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Severe liver dysfunction", "Uncontrolled hypertension"]
    },
    drugs: [
      {
        name: "Regorafenib",
        dosage: "160",
        unit: "mg",
        route: "PO",
        day: "1-21",
        drugClass: "targeted",
        mechanismOfAction: "Multi-kinase inhibitor",
        notes: "Take with low-fat breakfast"
      }
    ],
    schedule: "21 days on, 7 days off",
    cycles: 6,
    mechanismOfAction: "Multi-kinase inhibition (VEGFR, PDGFR, FGFR, KIT, RET)",
    responseRates: {
      overall: 8,
      progressionFreeSurvival: "1.9 months"
    }
  },
  {
    id: "crc-trifluridine-tipiracil-3l",
    name: "Trifluridine/Tipiracil (TAS-102)",
    description: "Third-line oral therapy for refractory metastatic CRC",
    category: "metastatic",
    lineOfTherapy: "third-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Severe bone marrow suppression", "Active infection"]
    },
    drugs: [
      {
        name: "Trifluridine/Tipiracil",
        dosage: "35",
        unit: "mg/m²",
        route: "PO",
        day: "1-5, 8-12",
        drugClass: "chemotherapy",
        mechanismOfAction: "Thymidine phosphorylase inhibitor",
        notes: "Take with food, BID dosing"
      }
    ],
    schedule: "Days 1-5 and 8-12 every 28 days",
    cycles: 6,
    mechanismOfAction: "DNA synthesis inhibition and thymidine phosphorylase inhibition",
    responseRates: {
      overall: 4,
      progressionFreeSurvival: "2.0 months"
    }
  },
  {
    id: "crc-fruquintinib-3l",
    name: "Fruquintinib",
    description: "Third-line VEGFR inhibitor for refractory metastatic CRC",
    category: "metastatic",
    lineOfTherapy: "third-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      contraindications: ["Uncontrolled hypertension", "Recent bleeding"]
    },
    drugs: [
      {
        name: "Fruquintinib",
        dosage: "5",
        unit: "mg",
        route: "PO",
        day: "1-21",
        drugClass: "targeted",
        mechanismOfAction: "VEGFR 1,2,3 inhibitor",
        notes: "Take once daily"
      }
    ],
    schedule: "21 days on, 7 days off",
    cycles: 6,
    mechanismOfAction: "Selective VEGFR inhibition",
    responseRates: {
      overall: 6,
      progressionFreeSurvival: "3.7 months"
    }
  },

  // ============= IMMUNOTHERAPY REGIMENS =============
  {
    id: "crc-pembrolizumab-msi-h",
    name: "Pembrolizumab (MSI-H/dMMR)",
    description: "Immunotherapy for MSI-H/dMMR metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["MSI-H", "dMMR"],
      contraindications: ["Active autoimmune disease", "Immunosuppression"]
    },
    biomarkerRequirements: [
      {
        name: "MSI",
        status: "high",
        required: true,
        testingMethod: "PCR or IHC",
        turnaroundTime: "5-7 days"
      },
      {
        name: "MMR",
        status: "negative",
        required: true,
        testingMethod: "IHC",
        turnaroundTime: "3-5 days"
      }
    ],
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "1",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "30 minutes",
        dilution: "100 mL NS"
      }
    ],
    schedule: "Every 21 days",
    cycles: 35,
    mechanismOfAction: "PD-1/PD-L1 pathway inhibition",
    responseRates: {
      overall: 44,
      progressionFreeSurvival: "16.5 months"
    }
  },
  {
    id: "crc-nivolumab-ipilimumab-msi-h",
    name: "Nivolumab + Ipilimumab (MSI-H/dMMR)",
    description: "Dual checkpoint inhibition for MSI-H/dMMR metastatic CRC",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["MSI-H", "dMMR"],
      contraindications: ["Active autoimmune disease", "Severe immune-related AEs"]
    },
    biomarkerRequirements: [
      {
        name: "MSI",
        status: "high",
        required: true,
        testingMethod: "PCR or IHC",
        turnaroundTime: "5-7 days"
      }
    ],
    drugs: [
      {
        name: "Nivolumab",
        dosage: "3",
        unit: "mg/kg",
        route: "IV",
        day: "1, 15",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 inhibitor",
        administrationDuration: "60 minutes",
        dilution: "100 mL NS"
      },
      {
        name: "Ipilimumab",
        dosage: "1",
        unit: "mg/kg",
        route: "IV",
        day: "1",
        drugClass: "immunotherapy",
        mechanismOfAction: "CTLA-4 inhibitor",
        administrationDuration: "90 minutes",
        dilution: "100 mL NS",
        notes: "Given every 6 weeks for 4 doses"
      }
    ],
    schedule: "Nivolumab Q2 weeks, Ipilimumab Q6 weeks x 4",
    cycles: 24,
    mechanismOfAction: "Dual checkpoint inhibition (PD-1 and CTLA-4)",
    responseRates: {
      overall: 69,
      progressionFreeSurvival: "38.4 months"
    }
  },

  // ============= SPECIAL POPULATIONS =============
  {
    id: "crc-5fu-lv-elderly",
    name: "5-FU/Leucovorin (Elderly)",
    description: "Reduced-intensity regimen for elderly or frail patients",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["Age ≥75 years", "ECOG 2", "Multiple comorbidities"],
      contraindications: ["DPD deficiency"]
    },
    drugs: [
      {
        name: "Leucovorin",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Folate analog",
        administrationDuration: "120 minutes",
        dilution: "250 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "2-5 minutes",
        dilution: "10-20 mL NS"
      },
      {
        name: "5-Fluorouracil",
        dosage: "2000",
        unit: "mg/m²",
        route: "IV continuous",
        day: "1-2",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46 hours continuous infusion",
        dilution: "Ambulatory pump",
        notes: "Reduced dose from standard 2400 mg/m²"
      }
    ],
    schedule: "Every 14 days",
    cycles: 12,
    mechanismOfAction: "Reduced-intensity antimetabolite therapy",
    responseRates: {
      overall: 25,
      progressionFreeSurvival: "5.8 months"
    }
  },
  {
    id: "crc-capecitabine-elderly",
    name: "Capecitabine (Elderly)",
    description: "Single-agent oral therapy for elderly patients",
    category: "metastatic",
    lineOfTherapy: "first-line",
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["Age ≥75 years", "Unable to tolerate combination therapy"],
      contraindications: ["DPD deficiency", "Severe renal impairment"]
    },
    drugs: [
      {
        name: "Capecitabine",
        dosage: "1000",
        unit: "mg/m²",
        route: "PO",
        day: "1-14 BID",
        drugClass: "chemotherapy",
        mechanismOfAction: "Oral fluoropyrimidine",
        notes: "Take with food and water, reduced dose from standard 1250 mg/m²"
      }
    ],
    schedule: "Every 21 days",
    cycles: 8,
    mechanismOfAction: "Oral fluoropyrimidine antimetabolite",
    responseRates: {
      overall: 18,
      progressionFreeSurvival: "4.2 months"
    }
  }
];