import { Regimen } from "@/types/regimens";

export const breastCancerTargetedRegimens: Regimen[] = [
  {
    id: "breast-tcph-adj",
    name: "TCPH (Adjuvant HER2+)",
    description: "Docetaxel, Carboplatin, Trastuzumab, Pertuzumab for adjuvant HER2+ breast cancer",
    category: "adjuvant",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "HER2",
        status: "positive",
        testingMethod: "IHC/FISH",
        threshold: "IHC 3+ or FISH amplified",
        required: true,
        turnaroundTime: "48-72 hours"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["HER2 positive"],
      contraindications: ["LVEF <50%", "Severe hearing impairment"]
    },
    drugs: [
      {
        name: "Docetaxel",
        dosage: "75",
        unit: "mg/m²",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "Microtubule stabilizer",
        administrationDuration: "60 minutes",
        dilution: "250-500 mL NS or D5W"
      },
      {
        name: "Carboplatin",
        dosage: "AUC 6",
        unit: "mg",
        route: "IV",
        day: "1",
        drugClass: "chemotherapy",
        mechanismOfAction: "DNA crosslinking agent",
        administrationDuration: "30-60 minutes",
        dilution: "250-500 mL D5W"
      },
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
        name: "Pertuzumab",
        dosage: "840 mg loading, then 420 mg",
        unit: "mg",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "HER2 dimerization inhibitor",
        administrationDuration: "60 minutes first dose, then 30 minutes",
        monitoring: ["LVEF", "Diarrhea"]
      }
    ],
    premedications: [
      {
        name: "Dexamethasone",
        dosage: "8",
        unit: "mg",
        route: "PO",
        timing: "12h and 6h before, then day of treatment",
        category: "corticosteroid",
        indication: "Hypersensitivity prevention",
        isRequired: true,
        isStandard: true
      }
    ],
    schedule: "Every 21 days",
    cycles: 6,
    mechanismOfAction: "Dual HER2 blockade with chemotherapy backbone",
    responseRates: {
      overall: 85,
      progressionFreeSurvival: "Not reached at 5 years"
    }
  },
  {
    id: "breast-tdm1-met",
    name: "T-DM1 (Metastatic HER2+)",
    description: "Trastuzumab emtansine for HER2+ metastatic breast cancer",
    category: "metastatic",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "HER2",
        status: "positive",
        testingMethod: "IHC/FISH",
        threshold: "IHC 3+ or FISH amplified",
        required: true,
        turnaroundTime: "48-72 hours"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["HER2 positive"],
      contraindications: ["LVEF <50%", "Severe peripheral neuropathy"]
    },
    drugs: [
      {
        name: "Trastuzumab emtansine (T-DM1)",
        dosage: "3.6",
        unit: "mg/kg",
        route: "IV",
        day: "1",
        drugClass: "targeted",
        mechanismOfAction: "HER2-targeted antibody-drug conjugate",
        administrationDuration: "90 minutes first dose, then 30 minutes",
        monitoring: ["LVEF", "LFTs", "Platelet count", "Peripheral neuropathy"]
      }
    ],
    schedule: "Every 21 days",
    cycles: 999,
    mechanismOfAction: "HER2-targeted delivery of cytotoxic DM1",
    responseRates: {
      overall: 44,
      progressionFreeSurvival: "9.6 months"
    }
  },
  {
    id: "breast-palbociclib-fulv",
    name: "Palbociclib + Fulvestrant",
    description: "CDK4/6 inhibitor with fulvestrant for HR+ metastatic breast cancer",
    category: "metastatic",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "ER",
        status: "positive",
        testingMethod: "IHC",
        threshold: "≥1% positive nuclei",
        required: true,
        turnaroundTime: "24-48 hours"
      },
      {
        name: "HER2",
        status: "negative",
        testingMethod: "IHC/FISH",
        required: true,
        turnaroundTime: "48-72 hours"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["ER positive", "HER2 negative"],
      contraindications: ["ANC <1000", "Severe hepatic impairment"]
    },
    drugs: [
      {
        name: "Palbociclib",
        dosage: "125",
        unit: "mg",
        route: "PO",
        day: "1-21",
        drugClass: "targeted",
        mechanismOfAction: "CDK4/6 inhibitor",
        monitoring: ["CBC with differential", "LFTs"],
        notes: "Take with food, 7 days off between cycles"
      },
      {
        name: "Fulvestrant",
        dosage: "500",
        unit: "mg",
        route: "IM",
        day: "1, 15 (cycle 1), then day 1",
        drugClass: "hormone",
        mechanismOfAction: "Selective estrogen receptor degrader",
        administrationDuration: "1-2 minutes per injection site",
        notes: "Administer as two 250mg injections"
      }
    ],
    schedule: "28-day cycles",
    cycles: 999,
    mechanismOfAction: "Cell cycle arrest via CDK4/6 inhibition with ER degradation",
    responseRates: {
      overall: 25,
      progressionFreeSurvival: "9.5 months"
    }
  },
  {
    id: "breast-olaparib-brca",
    name: "Olaparib (BRCA-mutated)",
    description: "PARP inhibitor for BRCA-mutated metastatic breast cancer",
    category: "metastatic",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "BRCA1/2",
        status: "mutated",
        testingMethod: "NGS",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["BRCA1 or BRCA2 germline mutation"],
      contraindications: ["Pregnancy", "Severe bone marrow suppression"]
    },
    drugs: [
      {
        name: "Olaparib",
        dosage: "300",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "PARP1/2 inhibitor",
        monitoring: ["CBC", "MCV", "Renal function"],
        notes: "Twice daily dosing, avoid with strong CYP3A inhibitors"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Synthetic lethality in BRCA-deficient tumors",
    responseRates: {
      overall: 60,
      progressionFreeSurvival: "7.0 months"
    }
  },
  {
    id: "breast-pembrolizumab-chemo-tnbc",
    name: "Pembrolizumab + Chemotherapy (TNBC)",
    description: "Immunotherapy with nab-paclitaxel for triple-negative breast cancer",
    category: "metastatic",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "ER",
        status: "negative",
        testingMethod: "IHC",
        threshold: "<1% positive nuclei",
        required: true,
        turnaroundTime: "24-48 hours"
      },
      {
        name: "PR",
        status: "negative",
        testingMethod: "IHC",
        threshold: "<1% positive nuclei",
        required: true,
        turnaroundTime: "24-48 hours"
      },
      {
        name: "HER2",
        status: "negative",
        testingMethod: "IHC/FISH",
        required: true,
        turnaroundTime: "48-72 hours"
      },
      {
        name: "PD-L1",
        status: "positive",
        testingMethod: "IHC",
        threshold: "CPS ≥10",
        required: true,
        turnaroundTime: "48-72 hours"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["Triple-negative", "PD-L1 CPS ≥10"],
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
        monitoring: ["Immune-related AEs", "Thyroid function", "LFTs"]
      },
      {
        name: "Nab-paclitaxel",
        dosage: "100",
        unit: "mg/m²",
        route: "IV",
        day: "1, 8, 15",
        drugClass: "chemotherapy",
        mechanismOfAction: "Microtubule stabilizer",
        administrationDuration: "30 minutes",
        monitoring: ["Neuropathy", "CBC"]
      }
    ],
    schedule: "Every 21 days",
    cycles: 999,
    mechanismOfAction: "Immune checkpoint inhibition with chemotherapy sensitization",
    responseRates: {
      overall: 53,
      progressionFreeSurvival: "9.7 months"
    }
  }
];