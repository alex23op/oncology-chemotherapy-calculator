import { Regimen } from "@/types/regimens";

export const lungCancerTargetedRegimens: Regimen[] = [
  {
    id: "lung-adagrasib-kras-g12c",
    name: "Adagrasib (KRAS G12C)",
    description: "KRAS G12C inhibitor for KRAS G12C-mutated NSCLC",
    category: "advanced",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "KRAS G12C",
        status: "mutated",
        testingMethod: "NGS",
        threshold: "G12C mutation detected",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["KRAS G12C mutation", "Prior platinum-based chemotherapy"],
      contraindications: ["Severe hepatic impairment", "QTc >470ms"]
    },
    drugs: [
      {
        name: "Adagrasib",
        dosage: "600",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "KRAS G12C inhibitor",
        monitoring: ["LFTs", "ECG", "CBC", "Electrolytes", "Drug interactions"],
        notes: "Twice daily with food, strong CYP3A inhibitor"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Covalent KRAS G12C inhibition",
    responseRates: {
      overall: 43,
      progressionFreeSurvival: "8.5 months"
    },
    drugInteractions: [
      {
        drug: "Strong CYP3A inhibitors",
        severity: "major",
        effect: "Increased adagrasib exposure",
        management: "Avoid or reduce dose to 300mg BID"
      },
      {
        drug: "Strong CYP3A inducers",
        severity: "major", 
        effect: "Decreased adagrasib exposure",
        management: "Avoid concurrent use"
      }
    ]
  },
  {
    id: "lung-sotorasib-kras-g12c",
    name: "Sotorasib (KRAS G12C)",
    description: "KRAS G12C inhibitor for KRAS G12C-mutated NSCLC",
    category: "advanced",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "KRAS G12C",
        status: "mutated",
        testingMethod: "NGS",
        threshold: "G12C mutation detected",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["KRAS G12C mutation", "Prior platinum-based chemotherapy"],
      contraindications: ["Severe hepatic impairment"]
    },
    drugs: [
      {
        name: "Sotorasib",
        dosage: "960",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "KRAS G12C inhibitor",
        monitoring: ["LFTs", "CBC", "Electrolytes", "Drug interactions"],
        notes: "Once daily without food (1 hour before or 2 hours after meals)"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Covalent KRAS G12C inhibition",
    responseRates: {
      overall: 37,
      progressionFreeSurvival: "6.8 months"
    }
  },
  {
    id: "lung-tepotinib-met-ex14",
    name: "Tepotinib (MET exon 14)",
    description: "MET inhibitor for MET exon 14 skipping NSCLC",
    category: "advanced",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "MET exon 14 skipping",
        status: "positive",
        testingMethod: "NGS/RT-PCR",
        threshold: "Exon 14 skipping mutation detected",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["MET exon 14 skipping mutation"],
      contraindications: ["Severe hepatic impairment", "QTc >470ms"]
    },
    drugs: [
      {
        name: "Tepotinib",
        dosage: "500",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "Selective MET inhibitor",
        monitoring: ["LFTs", "ECG", "CBC", "Pulmonary symptoms", "Renal function"],
        notes: "Once daily with food"
      }
    ],
    schedule: "Continuous 28-day cycles", 
    cycles: 999,
    mechanismOfAction: "Selective MET kinase inhibition",
    responseRates: {
      overall: 46,
      progressionFreeSurvival: "11.5 months"
    }
  },
  {
    id: "lung-capmatinib-met-ex14",
    name: "Capmatinib (MET exon 14)",
    description: "MET inhibitor for MET exon 14 skipping NSCLC",
    category: "advanced",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "MET exon 14 skipping",
        status: "positive",
        testingMethod: "NGS/RT-PCR",
        threshold: "Exon 14 skipping mutation detected",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["MET exon 14 skipping mutation"],
      contraindications: ["Severe hepatic impairment"]
    },
    drugs: [
      {
        name: "Capmatinib",
        dosage: "400",
        unit: "mg",
        route: "PO", 
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "Selective MET inhibitor",
        monitoring: ["LFTs", "CBC", "Pulmonary symptoms", "Renal function"],
        notes: "Twice daily with food"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Selective MET kinase inhibition",
    responseRates: {
      overall: 68,
      progressionFreeSurvival: "12.4 months"
    }
  },
  {
    id: "lung-osimertinib-egfr",
    name: "Osimertinib (EGFR-mutated)",
    description: "Third-generation EGFR TKI for EGFR-mutated NSCLC",
    category: "advanced",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "EGFR",
        status: "mutated",
        testingMethod: "NGS/PCR",
        required: true,
        turnaroundTime: "3-7 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["EGFR exon 19 deletion or L858R mutation"],
      contraindications: ["QTc >470ms", "Severe hepatic impairment"]
    },
    drugs: [
      {
        name: "Osimertinib",
        dosage: "80",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "Third-generation EGFR TKI",
        monitoring: ["ECG", "LFTs", "Pulmonary symptoms", "Ophthalmologic exams"],
        notes: "Once daily, can be taken with or without food"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Irreversible EGFR and T790M inhibition",
    responseRates: {
      overall: 80,
      progressionFreeSurvival: "18.9 months"
    }
  },
  {
    id: "lung-alectinib-alk",
    name: "Alectinib (ALK-rearranged)",
    description: "Second-generation ALK inhibitor for ALK+ NSCLC",
    category: "advanced",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "ALK",
        status: "positive",
        testingMethod: "IHC/FISH/NGS",
        required: true,
        turnaroundTime: "3-7 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["ALK rearrangement"],
      contraindications: ["Severe hepatic impairment", "Severe bradycardia"]
    },
    drugs: [
      {
        name: "Alectinib",
        dosage: "600",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "Second-generation ALK/RET inhibitor",
        monitoring: ["LFTs", "Heart rate", "CPK", "Pulmonary symptoms"],
        notes: "Twice daily with food"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "ALK kinase domain inhibition with CNS penetration",
    responseRates: {
      overall: 83,
      progressionFreeSurvival: "34.8 months"
    }
  },
  {
    id: "lung-sotorasib-krasg12c",
    name: "Sotorasib (KRAS G12C)",
    description: "KRAS G12C inhibitor for previously treated NSCLC",
    category: "advanced",
    lineOfTherapy: "second-line",
    biomarkerRequirements: [
      {
        name: "KRAS",
        status: "mutated",
        testingMethod: "NGS",
        threshold: "G12C mutation",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["KRAS G12C mutation"],
      contraindications: ["Severe hepatic impairment"]
    },
    drugs: [
      {
        name: "Sotorasib",
        dosage: "960",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "KRAS G12C inhibitor",
        monitoring: ["LFTs", "Pulmonary symptoms", "QTc interval"],
        notes: "Once daily, avoid with strong CYP3A inducers"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Irreversible KRAS G12C inhibition",
    responseRates: {
      overall: 37,
      progressionFreeSurvival: "6.8 months"
    }
  },
  {
    id: "lung-pembrolizumab-mono",
    name: "Pembrolizumab Monotherapy",
    description: "Anti-PD-1 monotherapy for high PD-L1 NSCLC",
    category: "advanced",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "PD-L1",
        status: "high",
        testingMethod: "IHC",
        threshold: "≥50% tumor proportion score",
        required: true,
        turnaroundTime: "24-48 hours"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["PD-L1 ≥50%", "No targetable mutations"],
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
    mechanismOfAction: "PD-1 pathway blockade enabling T-cell activation",
    responseRates: {
      overall: 45,
      progressionFreeSurvival: "10.3 months"
    }
  },
  {
    id: "lung-dabrafenib-trametinib",
    name: "Dabrafenib + Trametinib",
    description: "BRAF/MEK inhibitor combination for BRAF V600E NSCLC",
    category: "advanced",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "BRAF",
        status: "mutated",
        testingMethod: "NGS",
        threshold: "V600E mutation",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1],
      biomarkers: ["BRAF V600E mutation"],
      contraindications: ["LVEF <50%", "QTc >480ms"]
    },
    drugs: [
      {
        name: "Dabrafenib",
        dosage: "150",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "BRAF kinase inhibitor",
        monitoring: ["LVEF", "Skin exams", "LFTs", "Pyrexia"],
        notes: "Twice daily, 1 hour before or 2 hours after meals"
      },
      {
        name: "Trametinib",
        dosage: "2",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "MEK1/2 inhibitor",
        monitoring: ["LVEF", "Ophthalmologic exams", "Skin toxicity"],
        notes: "Once daily, 1 hour before or 2 hours after meals"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "Dual MAPK pathway inhibition",
    responseRates: {
      overall: 64,
      progressionFreeSurvival: "10.9 months"
    }
  },
  {
    id: "lung-capmatinib-met",
    name: "Capmatinib (MET Exon 14)",
    description: "MET inhibitor for MET exon 14 skipping mutations",
    category: "advanced",
    lineOfTherapy: "first-line",
    biomarkerRequirements: [
      {
        name: "MET",
        status: "mutated",
        testingMethod: "NGS",
        threshold: "Exon 14 skipping mutation",
        required: true,
        turnaroundTime: "7-14 days"
      }
    ],
    eligibilityCriteria: {
      ecogStatus: [0, 1, 2],
      biomarkers: ["MET exon 14 skipping mutation"],
      contraindications: ["Severe hepatic impairment"]
    },
    drugs: [
      {
        name: "Capmatinib",
        dosage: "400",
        unit: "mg",
        route: "PO",
        day: "1-28",
        drugClass: "targeted",
        mechanismOfAction: "Selective MET inhibitor",
        monitoring: ["LFTs", "Pulmonary symptoms", "Peripheral edema"],
        notes: "Twice daily with food"
      }
    ],
    schedule: "Continuous 28-day cycles",
    cycles: 999,
    mechanismOfAction: "MET kinase domain inhibition",
    responseRates: {
      overall: 68,
      progressionFreeSurvival: "12.4 months"
    }
  }
];