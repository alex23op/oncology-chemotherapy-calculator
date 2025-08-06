import { Biomarker } from "@/types/regimens";

export interface BiomarkerPanel {
  cancerType: string;
  stage: string[];
  requiredBiomarkers: Biomarker[];
  recommendedBiomarkers: Biomarker[];
  testingGuidelines: string;
  turnaroundTime: string;
  tissueRequirements: string;
}

export const biomarkerPanels: BiomarkerPanel[] = [
  {
    cancerType: "breast",
    stage: ["advanced", "metastatic"],
    requiredBiomarkers: [
      {
        name: "ER/PR",
        status: "unknown",
        testingMethod: "IHC",
        threshold: "≥1% positive nuclei",
        required: true,
        turnaroundTime: "24-48 hours"
      },
      {
        name: "HER2",
        status: "unknown", 
        testingMethod: "IHC/FISH",
        threshold: "IHC 3+ or FISH amplified",
        required: true,
        turnaroundTime: "48-72 hours"
      }
    ],
    recommendedBiomarkers: [
      {
        name: "BRCA1/2",
        status: "unknown",
        testingMethod: "NGS",
        required: false,
        turnaroundTime: "7-14 days"
      },
      {
        name: "PIK3CA",
        status: "unknown",
        testingMethod: "NGS",
        required: false,
        turnaroundTime: "7-14 days"
      },
      {
        name: "MSI/MMR",
        status: "unknown",
        testingMethod: "IHC/PCR",
        required: false,
        turnaroundTime: "3-5 days"
      }
    ],
    testingGuidelines: "All metastatic breast cancers should have ER/PR and HER2 testing. Consider germline and somatic BRCA testing for all patients.",
    turnaroundTime: "2-14 days",
    tissueRequirements: "Formalin-fixed paraffin-embedded tissue block or 10-15 unstained slides"
  },
  {
    cancerType: "lung",
    stage: ["advanced", "metastatic"],
    requiredBiomarkers: [
      {
        name: "EGFR",
        status: "unknown",
        testingMethod: "NGS/PCR",
        required: true,
        turnaroundTime: "3-7 days"
      },
      {
        name: "ALK",
        status: "unknown",
        testingMethod: "IHC/FISH/NGS",
        required: true,
        turnaroundTime: "3-7 days"
      },
      {
        name: "ROS1",
        status: "unknown",
        testingMethod: "IHC/FISH/NGS",
        required: true,
        turnaroundTime: "3-7 days"
      },
      {
        name: "PD-L1",
        status: "unknown",
        testingMethod: "IHC",
        threshold: "≥50% for monotherapy, ≥1% for combination",
        required: true,
        turnaroundTime: "24-48 hours"
      }
    ],
    recommendedBiomarkers: [
      {
        name: "BRAF",
        status: "unknown",
        testingMethod: "NGS",
        required: false,
        turnaroundTime: "7-14 days"
      },
      {
        name: "KRAS",
        status: "unknown",
        testingMethod: "NGS",
        required: false,
        turnaroundTime: "7-14 days"
      },
      {
        name: "MET",
        status: "unknown",
        testingMethod: "NGS/IHC",
        required: false,
        turnaroundTime: "7-14 days"
      },
      {
        name: "RET",
        status: "unknown",
        testingMethod: "NGS",
        required: false,
        turnaroundTime: "7-14 days"
      },
      {
        name: "NTRK",
        status: "unknown",
        testingMethod: "NGS/IHC",
        required: false,
        turnaroundTime: "7-14 days"
      }
    ],
    testingGuidelines: "Comprehensive molecular profiling recommended for all advanced NSCLC. PD-L1 testing required for immunotherapy decisions.",
    turnaroundTime: "3-14 days",
    tissueRequirements: "Adequate tissue for NGS (>20% tumor content recommended)"
  },
  {
    cancerType: "colorectal",
    stage: ["advanced", "metastatic"],
    requiredBiomarkers: [
      {
        name: "RAS (KRAS/NRAS)",
        status: "unknown",
        testingMethod: "NGS/PCR",
        required: true,
        turnaroundTime: "3-7 days"
      },
      {
        name: "BRAF",
        status: "unknown",
        testingMethod: "NGS/IHC",
        required: true,
        turnaroundTime: "3-7 days"
      },
      {
        name: "MSI/MMR",
        status: "unknown",
        testingMethod: "IHC/PCR",
        required: true,
        turnaroundTime: "3-5 days"
      }
    ],
    recommendedBiomarkers: [
      {
        name: "HER2",
        status: "unknown",
        testingMethod: "IHC/FISH/NGS",
        required: false,
        turnaroundTime: "3-7 days"
      },
      {
        name: "NTRK",
        status: "unknown",
        testingMethod: "NGS/IHC",
        required: false,
        turnaroundTime: "7-14 days"
      }
    ],
    testingGuidelines: "RAS, BRAF, and MSI/MMR testing required for all metastatic colorectal cancers. HER2 testing for RAS wild-type tumors.",
    turnaroundTime: "3-14 days",
    tissueRequirements: "Formalin-fixed paraffin-embedded tissue with adequate tumor content"
  }
];

export const getBiomarkerPanel = (cancerType: string, stage: string): BiomarkerPanel | undefined => {
  return biomarkerPanels.find(panel => 
    panel.cancerType === cancerType && panel.stage.includes(stage)
  );
};