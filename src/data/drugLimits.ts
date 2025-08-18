export interface DrugLimit {
  maxPerCycle?: number | { [key: string]: number };
  maxCumulative?: number;
  unit: string;
  gfrCap?: number;
  maxConcentration?: number;
  concentrationUnit?: string;
  warnings?: string;
  renalAdjustment?: {
    crclThreshold: number;
    adjustment: string;
  };
  hepaticAdjustment?: {
    bilirubinThreshold: number;
    adjustment: string;
  };
}

export const drugLimits: Record<string, DrugLimit> = {
  // Anthracyclines
  "Doxorubicin": {
    maxPerCycle: 75,
    maxCumulative: 550,
    unit: "mg/m²",
    warnings: "Monitor LVEF, cardiotoxicity risk. Lifetime cumulative dose limit."
  },
  "Epirubicin": {
    maxPerCycle: 120,
    maxCumulative: 900,
    unit: "mg/m²",
    warnings: "Monitor LVEF, cardiotoxicity risk. Consider dose reduction if prior anthracyclines."
  },
  "Daunorubicin": {
    maxPerCycle: 60,
    maxCumulative: 400,
    unit: "mg/m²",
    warnings: "Monitor LVEF, cardiotoxicity risk."
  },

  // Platinum compounds
  "Cisplatin": {
    maxPerCycle: 100,
    unit: "mg/m²",
    warnings: "Monitor renal function, hearing, neuropathy. Pre/post-hydration required.",
    renalAdjustment: {
      crclThreshold: 60,
      adjustment: "Reduce dose by 50% if CrCl 30-60 mL/min, avoid if <30 mL/min"
    }
  },
  "Carboplatin": {
    maxPerCycle: 7,
    unit: "AUC",
    gfrCap: 125,
    warnings: "Use Calvert formula: dose = AUC × (GFR + 25). Cap GFR at 125 mL/min."
  },
  "Oxaliplatin": {
    maxPerCycle: 130,
    maxCumulative: 850,
    unit: "mg/m²",
    warnings: "Monitor peripheral neuropathy. Use only Glucose 5% (D5W) for dilution."
  },

  // Taxanes
  "Paclitaxel": {
    maxPerCycle: {
      weekly: 80,
      q3w: 175,
      q14d: 80
    },
    unit: "mg/m²",
    maxConcentration: 1.2,
    concentrationUnit: "mg/mL",
    warnings: "Premedication required. Monitor neuropathy, hypersensitivity reactions."
  },
  "Docetaxel": {
    maxPerCycle: 100,
    unit: "mg/m²",
    warnings: "Premedication with dexamethasone required. Monitor fluid retention, neuropathy.",
    hepaticAdjustment: {
      bilirubinThreshold: 1.5,
      adjustment: "Reduce dose by 25% if bilirubin >1.5x ULN"
    }
  },
  "nab-Paclitaxel": {
    maxPerCycle: {
      weekly: 125,
      q3w: 260
    },
    unit: "mg/m²",
    warnings: "Monitor neuropathy. No premedication typically required."
  },
  "Cabazitaxel": {
    maxPerCycle: 25,
    unit: "mg/m²",
    warnings: "Premedication required. Monitor neutropenia, neuropathy."
  },

  // Antimetabolites
  "5-Fluorouracil": {
    maxPerCycle: {
      bolus: 600,
      continuous: 2600
    },
    unit: "mg/m²",
    warnings: "DPD testing recommended. Monitor mucositis, hand-foot syndrome."
  },
  "Capecitabine": {
    maxPerCycle: 2500,
    unit: "mg/m²/day",
    warnings: "Monitor hand-foot syndrome, diarrhea. Take with food.",
    renalAdjustment: {
      crclThreshold: 50,
      adjustment: "Reduce dose by 25% if CrCl 30-50 mL/min"
    }
  },
  "Gemcitabine": {
    maxPerCycle: 1200,
    unit: "mg/m²",
    warnings: "Monitor pulmonary toxicity, hemolytic uremic syndrome."
  },
  "Pemetrexed": {
    maxPerCycle: 500,
    unit: "mg/m²",
    warnings: "Folic acid and B12 supplementation required. Monitor renal function.",
    renalAdjustment: {
      crclThreshold: 45,
      adjustment: "Contraindicated if CrCl <45 mL/min"
    }
  },
  "Methotrexate": {
    maxPerCycle: {
      low: 100,
      intermediate: 1000,
      high: 8000
    },
    unit: "mg/m²",
    warnings: "Leucovorin rescue required for high doses. Monitor renal function, mucositis."
  },

  // Topoisomerase inhibitors
  "Irinotecan": {
    maxPerCycle: 180,
    unit: "mg/m²",
    warnings: "UGT1A1*28 testing recommended. Atropine premedication for cholinergic symptoms."
  },
  "Liposomal Irinotecan": {
    maxPerCycle: 70,
    unit: "mg/m²",
    warnings: "Monitor for delayed diarrhea. Premedication with corticosteroids."
  },
  "Topotecan": {
    maxPerCycle: {
      iv: 4,
      po: 2.3
    },
    unit: "mg/m²",
    warnings: "Monitor myelosuppression.",
    renalAdjustment: {
      crclThreshold: 60,
      adjustment: "Reduce dose by 25% if CrCl 40-60 mL/min"
    }
  },
  "Etoposide": {
    maxPerCycle: 500,
    unit: "mg/m²",
    warnings: "Monitor for secondary leukemia with prolonged use."
  },

  // Alkylating agents
  "Cyclophosphamide": {
    maxPerCycle: {
      low: 600,
      high: 4000
    },
    unit: "mg/m²",
    warnings: "Monitor for hemorrhagic cystitis. Mesna may be required for high doses."
  },
  "Ifosfamide": {
    maxPerCycle: 5000,
    unit: "mg/m²",
    warnings: "Mesna required. Monitor renal function, CNS toxicity."
  },

  // Immunotherapy (minimal limits, mainly for reference)
  "Pembrolizumab": {
    maxPerCycle: 200,
    unit: "mg",
    warnings: "Monitor for immune-related adverse events (irAEs)."
  },
  "Nivolumab": {
    maxPerCycle: 480,
    unit: "mg",
    warnings: "Monitor for immune-related adverse events (irAEs)."
  },
  "Atezolizumab": {
    maxPerCycle: 1200,
    unit: "mg",
    warnings: "Monitor for immune-related adverse events (irAEs)."
  },
  "Durvalumab": {
    maxPerCycle: 1500,
    unit: "mg",
    warnings: "Monitor for immune-related adverse events (irAEs)."
  },

  // Targeted therapy
  "Bevacizumab": {
    maxPerCycle: 15,
    unit: "mg/kg",
    warnings: "Monitor for bleeding, thrombosis, hypertension, proteinuria."
  },
  "Cetuximab": {
    maxPerCycle: {
      loading: 400,
      maintenance: 250
    },
    unit: "mg/m²",
    warnings: "Monitor for infusion reactions, skin toxicity. KRAS testing required."
  },
  "Trastuzumab": {
    maxPerCycle: {
      loading: 8,
      maintenance: 6
    },
    unit: "mg/kg",
    warnings: "Monitor LVEF. HER2 testing required."
  },

  // Other agents
  "Bleomycin": {
    maxPerCycle: 30,
    maxCumulative: 400,
    unit: "units",
    warnings: "Monitor for pulmonary fibrosis. Lifetime cumulative dose limit."
  },
  "Mitomycin C": {
    maxPerCycle: 20,
    maxCumulative: 60,
    unit: "mg/m²",
    warnings: "Monitor for hemolytic uremic syndrome, pulmonary toxicity."
  },
  "Vinblastine": {
    maxPerCycle: 6,
    unit: "mg/m²",
    warnings: "Monitor for neuropathy, myelosuppression."
  },
  "Vincristine": {
    maxPerCycle: 2,
    unit: "mg",
    warnings: "Dose cap at 2 mg regardless of BSA. Monitor for neuropathy."
  },
  "Vinorelbine": {
    maxPerCycle: 30,
    unit: "mg/m²",
    warnings: "Monitor for neuropathy, injection site reactions."
  }
};

export const checkDoseLimit = (drugName: string, calculatedDose: number, schedule?: string): {
  isExceeded: boolean;
  warning?: string;
  suggestedAction?: string;
} => {
  const limit = drugLimits[drugName];
  if (!limit) {
    return { isExceeded: false };
  }

  let maxDose: number;
  
  if (typeof limit.maxPerCycle === 'number') {
    maxDose = limit.maxPerCycle;
  } else if (typeof limit.maxPerCycle === 'object' && schedule) {
    const scheduleKey = schedule.toLowerCase().includes('weekly') ? 'weekly' : 
                      schedule.toLowerCase().includes('q3w') ? 'q3w' :
                      schedule.toLowerCase().includes('q14d') ? 'q14d' : 'q3w';
    maxDose = limit.maxPerCycle[scheduleKey] || Object.values(limit.maxPerCycle)[0];
  } else {
    return { isExceeded: false };
  }

  if (calculatedDose > maxDose) {
    return {
      isExceeded: true,
      warning: `Doza calculată de ${drugName} (${calculatedDose.toFixed(1)} ${limit.unit}) depășește limita recomandată de ${maxDose} ${limit.unit}`,
      suggestedAction: limit.warnings || "Verificați doza și considerați reducerea sau consultați ghidurile locale"
    };
  }

  return { isExceeded: false };
};
