export interface EmetogenicRiskLevel {
  level: "high" | "moderate" | "low" | "minimal";
  risk: string;
  description: string;
  timeframe: {
    acute: string;
    delayed: string;
  };
}

export interface AntiemeticAgent {
  name: string;
  class: string;
  mechanism: string;
  dosage: string;
  unit: string;
  route: string;
  timing: string;
  duration?: string;
  indication: "acute" | "delayed" | "both";
  evidenceLevel: "IA" | "IB" | "IC" | "IIA" | "IIB" | "IIIA" | "IIIB";
  notes?: string;
  category?: string;
  rationale?: string;
  administrationDuration?: string;
}

export interface AntiemeticProtocol {
  id: string;
  name: string;
  riskLevel: "high" | "moderate" | "low" | "minimal";
  indication: string[];
  agents: AntiemeticAgent[];
  clinicalRationale: string;
  acuteManagement: string;
  delayedManagement: string;
  guidelines: string[];
}

export interface EmetogenicClassification {
  drugName: string;
  riskLevel: "high" | "moderate" | "low" | "minimal";
  doseDependency?: {
    threshold: number;
    unit: string;
    higherRisk: "high" | "moderate" | "low";
  };
  notes?: string;
}

export const emetogenicRiskLevels: Record<string, EmetogenicRiskLevel> = {
  high: {
    level: "high",
    risk: ">90%",
    description: "High likelihood of emesis without antiemetic prophylaxis",
    timeframe: {
      acute: "0-24 hours: 90-100% without prophylaxis",
      delayed: "24-120 hours: 60-90% without prophylaxis"
    }
  },
  moderate: {
    level: "moderate", 
    risk: "30-90%",
    description: "Moderate likelihood of emesis without antiemetic prophylaxis",
    timeframe: {
      acute: "0-24 hours: 30-90% without prophylaxis",
      delayed: "24-120 hours: 10-30% without prophylaxis"
    }
  },
  low: {
    level: "low",
    risk: "10-30%",
    description: "Low likelihood of emesis without antiemetic prophylaxis",
    timeframe: {
      acute: "0-24 hours: 10-30% without prophylaxis", 
      delayed: "24-120 hours: <10% without prophylaxis"
    }
  },
  minimal: {
    level: "minimal",
    risk: "<10%",
    description: "Minimal likelihood of emesis without antiemetic prophylaxis",
    timeframe: {
      acute: "0-24 hours: <10% without prophylaxis",
      delayed: "24-120 hours: <5% without prophylaxis"
    }
  }
};

export const drugEmetogenicClassification: EmetogenicClassification[] = [
  // High Emetogenic Risk (>90%)
  { drugName: "Cisplatin", riskLevel: "high", doseDependency: { threshold: 50, unit: "mg/m²", higherRisk: "high" } },
  { drugName: "Mechlorethamine", riskLevel: "high" },
  { drugName: "Streptozocin", riskLevel: "high" },
  { drugName: "Dacarbazine", riskLevel: "high" },
  { drugName: "Carmustine", riskLevel: "high", doseDependency: { threshold: 250, unit: "mg/m²", higherRisk: "high" } },
  { drugName: "Cyclophosphamide", riskLevel: "high", doseDependency: { threshold: 1500, unit: "mg/m²", higherRisk: "high" } },
  { drugName: "Doxorubicin", riskLevel: "high", doseDependency: { threshold: 60, unit: "mg/m²", higherRisk: "high" }, notes: "When combined with cyclophosphamide (AC regimen)" },
  { drugName: "Epirubicin", riskLevel: "high", doseDependency: { threshold: 90, unit: "mg/m²", higherRisk: "high" }, notes: "When combined with cyclophosphamide" },

  // Moderate Emetogenic Risk (30-90%)
  { drugName: "Carboplatin", riskLevel: "moderate", notes: "AUC-dependent emetogenicity" },
  { drugName: "Oxaliplatin", riskLevel: "moderate" },
  { drugName: "Irinotecan", riskLevel: "moderate" },
  { drugName: "Doxorubicin", riskLevel: "moderate", doseDependency: { threshold: 60, unit: "mg/m²", higherRisk: "high" }, notes: "When used as single agent" },
  { drugName: "Epirubicin", riskLevel: "moderate", doseDependency: { threshold: 90, unit: "mg/m²", higherRisk: "high" }, notes: "When used as single agent" },
  { drugName: "Cyclophosphamide", riskLevel: "moderate", doseDependency: { threshold: 1500, unit: "mg/m²", higherRisk: "high" }, notes: "<1500 mg/m²" },
  { drugName: "Paclitaxel", riskLevel: "moderate", notes: "Especially with carboplatin combination" },
  { drugName: "Docetaxel", riskLevel: "moderate" },
  { drugName: "Methotrexate", riskLevel: "moderate", doseDependency: { threshold: 250, unit: "mg/m²", higherRisk: "moderate" } },

  // Low Emetogenic Risk (10-30%)
  { drugName: "Pemetrexed", riskLevel: "low" },
  { drugName: "Etoposide", riskLevel: "low" },
  { drugName: "5-Fluorouracil", riskLevel: "low" },
  { drugName: "Gemcitabine", riskLevel: "low" },
  { drugName: "Paclitaxel", riskLevel: "low", notes: "Weekly administration or as single agent" },
  { drugName: "Topotecan", riskLevel: "low" },
  { drugName: "Mitomycin", riskLevel: "low" },

  // Minimal Emetogenic Risk (<10%)
  { drugName: "Bevacizumab", riskLevel: "minimal" },
  { drugName: "Cetuximab", riskLevel: "minimal" },
  { drugName: "Panitumumab", riskLevel: "minimal" },
  { drugName: "Trastuzumab", riskLevel: "minimal" },
  { drugName: "Rituximab", riskLevel: "minimal" },
  { drugName: "Pembrolizumab", riskLevel: "minimal" },
  { drugName: "Vinorelbine", riskLevel: "minimal" },
  { drugName: "Capecitabine", riskLevel: "minimal" },
  { drugName: "Cemiplimab", riskLevel: "minimal" },
  { drugName: "Dostarlimab", riskLevel: "minimal" },
  { drugName: "Atezolizumab", riskLevel: "minimal" },
  { drugName: "Tisotumab vedotin", riskLevel: "low" }, 
  { drugName: "Lenvatinib", riskLevel: "low" },
  { drugName: "Actinomycin D", riskLevel: "moderate" },
  { drugName: "Vincristine", riskLevel: "minimal" },
  { drugName: "Olaparib", riskLevel: "minimal" },
  { drugName: "Niraparib", riskLevel: "low" },
  { drugName: "Rucaparib", riskLevel: "minimal" },
  
  // Additional lung cancer drugs
  { drugName: "Osimertinib", riskLevel: "low" },
  { drugName: "Alectinib", riskLevel: "minimal" },
  { drugName: "Repotrectinib", riskLevel: "low" },
  { drugName: "Adagrasib", riskLevel: "low" },
  { drugName: "Sotorasib", riskLevel: "low" },
  { drugName: "Tepotinib", riskLevel: "low" },
  { drugName: "Capmatinib", riskLevel: "low" },
  { drugName: "Dabrafenib", riskLevel: "low" },
  { drugName: "Trametinib", riskLevel: "low" },
  { drugName: "Nivolumab", riskLevel: "minimal" },
  { drugName: "Ipilimumab", riskLevel: "low" },
  { drugName: "Durvalumab", riskLevel: "minimal" },
  { drugName: "Ramucirumab", riskLevel: "minimal" },
  { drugName: "Lurbinectedin", riskLevel: "moderate" },
  { drugName: "Amivantamab", riskLevel: "low" },
  
  // Genitourinary Cancer Drugs
  { drugName: "Enfortumab vedotin", riskLevel: "low" },
  { drugName: "Avelumab", riskLevel: "minimal" },
  { drugName: "Sacituzumab govitecan", riskLevel: "moderate" },
  { drugName: "Bleomycin", riskLevel: "low" },
  { drugName: "Vinblastine", riskLevel: "low" },
  { drugName: "Ifosfamide", riskLevel: "moderate" },
  { drugName: "Cabazitaxel", riskLevel: "moderate" },
  { drugName: "Darolutamide", riskLevel: "low" },
  { drugName: "Enzalutamide", riskLevel: "low" },
  { drugName: "Talazoparib", riskLevel: "minimal" },
  { drugName: "Goserelin", riskLevel: "minimal" },
  { drugName: "Sunitinib", riskLevel: "moderate" },
  { drugName: "Pazopanib", riskLevel: "low" },
  { drugName: "Axitinib", riskLevel: "low" },
  { drugName: "Cabozantinib", riskLevel: "low" },
  { drugName: "Belzutifan", riskLevel: "low" },
  { drugName: "Prednisone", riskLevel: "minimal" }
];