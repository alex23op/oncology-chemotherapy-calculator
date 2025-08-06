import { Regimen } from "@/types/regimens";

export const colorectalTargetedRegimens: Regimen[] = [
  {
    id: "crc-folfiri-cetuximab",
    name: "FOLFIRI + Cetuximab",
    description: "FOLFIRI with anti-EGFR therapy for RAS wild-type metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "RAS (KRAS/NRAS)",
        status: "wild-type",
        testingMethod: "NGS/PCR",
        required: true,
        turnaroundTime: "3-7 days"
      },
      {
        name: "BRAF",
        status: "wild-type",
        testingMethod: "NGS",
        required: true,
        turnaroundTime: "3-7 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["RAS wild-type", "BRAF wild-type", "Left-sided primary preferred"],
      contraindications: ["Severe skin reactions to EGFR inhibitors"]
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
        dilution: "250-500 mL D5W or NS"
      },
      {
        name: "Fluorouracil",
        dosage: "400",
        unit: "mg/m²",
        route: "IV bolus",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite"
      },
      {
        name: "Fluorouracil",
        dosage: "2400",
        unit: "mg/m²",
        route: "IV",
        day: "1-3",
        drugClass: "chemotherapy",
        mechanismOfAction: "Antimetabolite",
        administrationDuration: "46-hour infusion"
      },
      {
        name: "Cetuximab",
        dosage: "500",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "Anti-EGFR monoclonal antibody",
        administrationDuration: "120 minutes first dose, then 60 minutes",
        monitoring: ["Skin toxicity", "Hypomagnesemia", "Infusion reactions"]
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
        indication: "Infusion reaction prevention",
        isRequired: true,
        isStandard: true
      }
    ],
    schedule: "Every 14 days",
    cycles: 999,
    mechanismOfAction: "EGFR pathway inhibition with cytotoxic chemotherapy",
    responseRates: {
      overall: 62,
      progressionFreeSurvival: "11.4 months"
    }
  },
  {
    id: "crc-encorafenib-cetuximab",
    name: "Encorafenib + Cetuximab",
    description: "BRAF/EGFR inhibition for BRAF V600E metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "BRAF",
        status: "mutated",
        testingMethod: "NGS/IHC",
        threshold: "V600E mutation",
        required: true,
        turnaroundTime: "3-7 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["BRAF V600E mutation"],
      contraindications: ["QTc >480ms", "Severe skin reactions"]
    },
    drugs: [
      {
        name: "Encorafenib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "BRAF kinase inhibitor",
        monitoring: ["LVEF", "Ophthalmologic exams", "QTc", "LFTs"],
        notes: "Once daily with food"
      },
      {
        name: "Cetuximab",
        dosage: "500",
        unit: "mg/m²",
        route: "IV",
        day: "1, 15",
        drugClass: "targeted",
        mechanismOfAction: "Anti-EGFR monoclonal antibody",
        administrationDuration: "120 minutes first dose, then 60 minutes",
        monitoring: ["Skin toxicity", "Hypomagnesemia", "Infusion reactions"]
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
        indication: "Infusion reaction prevention",
        isRequired: true,
        isStandard: true
      }
    ],
    schedule: "28-day cycles",
    cycles: 999,
    mechanismOfAction: "Dual BRAF and EGFR inhibition",
    responseRates: {
      overall: 20,
      progressionFreeSurvival: "4.3 months"
    }
  },
  {
    id: "crc-pembrolizumab-msi",
    name: "Pembrolizumab (MSI-H/dMMR)",
    description: "Anti-PD-1 therapy for microsatellite instability-high colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "MSI/MMR",
        status: "high",
        testingMethod: "IHC/PCR",
        threshold: "MSI-H or dMMR",
        required: true,
        turnaroundTime: "3-5 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["MSI-H or dMMR"],
      contraindications: ["Active autoimmune disease", "Severe pulmonary disease"]
    },
    drugs: [
      {
        name: "Pembrolizumab",
        dosage: "200",
        unit: "mg",
        route: "IV",
        day: "1",
        drugClass: "immunotherapy",
        mechanismOfAction: "PD-1 checkpoint inhibitor",
        administrationDuration: "30 minutes",
        monitoring: ["Immune-related AEs", "Thyroid function", "LFTs", "Pneumonitis"]
      }
    ],
    schedule: "Every 21 days",
    cycles: 35,
    mechanismOfAction: "PD-1 pathway blockade in mismatch repair deficient tumors",
    responseRates: {
      overall: 44,
      progressionFreeSurvival: "16.5 months"
    }
  },
  {
    id: "crc-trastuzumab-lapatinib-her2",
    name: "Trastuzumab + Lapatinib",
    description: "Dual HER2 blockade for HER2-amplified metastatic colorectal cancer",
    category: "metastatic",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "HER2",
        status: "amplified",
        testingMethod: "IHC/FISH/NGS",
        threshold: "IHC 3+ or FISH amplified",
        required: true,
        turnaroundTime: "3-7 days"
      },
      {
        name: "RAS (KRAS/NRAS)",
        status: "wild-type",
        testingMethod: "NGS/PCR",
        required: true,
        turnaroundTime: "3-7 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["HER2 amplified", "RAS wild-type"],
      contraindications: ["LVEF <50%", "Severe hepatic impairment"]
    },
    drugs: [
      {
        name: "Trastuzumab",
        dosage: "8 mg/kg loading, then 6 mg/kg",
        unit: "mg/kg",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "HER2 receptor antagonist",
        administrationDuration: "90 minutes first dose, then 30 minutes",
        monitoring: ["LVEF", "Infusion reactions"]
      },
      {
        name: "Lapatinib",
        dosage: "1000",
        unit: "mg",
        route: "PO",
        day: "1-21",
        drugClass: "targeted",
        mechanismOfAction: "Dual EGFR/HER2 TKI",
        monitoring: ["LVEF", "LFTs", "Diarrhea"],
        notes: "Once daily on empty stomach, 1 hour before or after meals"
      }
    ],
    schedule: "Every 21 days",
    cycles: 999,
    mechanismOfAction: "Dual HER2 pathway inhibition",
    responseRates: {
      overall: 30,
      progressionFreeSurvival: "5.4 months"
    }
  },
  {
    id: "crc-larotrectinib-ntrk",
    name: "Larotrectinib (NTRK-fusion)",
    description: "TRK inhibitor for NTRK fusion-positive solid tumors",
    category: "metastatic",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "NTRK",
        status: "positive",
        testingMethod: "NGS/IHC",
        threshold: "NTRK1/2/3 fusion",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["NTRK fusion positive"],
      contraindications: ["Strong CYP3A inhibitors"]
    },
    drugs: [
      {
        name: "Larotrectinib",
        dosage: "100",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "Selective TRK inhibitor",
        monitoring: ["LFTs", "Neurologic symptoms", "Dizziness"],
        notes: "Twice daily, can be taken with or without food"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Selective TRKA/B/C kinase inhibition",
    responseRates: {
      overall: 75,
      progressionFreeSurvival: "28.3 months"
    }
  }
];