import { AntiemeticProtocol, AntiemeticAgent } from "@/types/emetogenicRisk";

// Standard Antiemetic Agents
export const standardAntiemeticAgents: Record<string, AntiemeticAgent> = {
  // NK1 Receptor Antagonists
  aprepitant_day1: {
    name: "Aprepitant",
    class: "NK1 Receptor Antagonist",
    mechanism: "Blocks substance P binding to NK1 receptors in CNS",
    dosage: "125",
    unit: "mg",
    route: "PO",
    timing: "1 hour before chemotherapy",
    indication: "both",
    evidenceLevel: "IA",
    notes: "Day 1 of 3-day regimen"
  },
  aprepitant_day2_3: {
    name: "Aprepitant",
    class: "NK1 Receptor Antagonist", 
    mechanism: "Blocks substance P binding to NK1 receptors in CNS",
    dosage: "80",
    unit: "mg",
    route: "PO",
    timing: "Once daily morning",
    duration: "Days 2-3",
    indication: "delayed",
    evidenceLevel: "IA",
    notes: "Days 2-3 of regimen for delayed CINV"
  },
  fosaprepitant: {
    name: "Fosaprepitant",
    class: "NK1 Receptor Antagonist",
    mechanism: "IV prodrug of aprepitant, blocks NK1 receptors",
    dosage: "150",
    unit: "mg",
    route: "IV",
    timing: "30 minutes before chemotherapy",
    indication: "both",
    evidenceLevel: "IA",
    notes: "Single-dose IV alternative to 3-day oral aprepitant"
  },
  
  // 5-HT3 Receptor Antagonists
  ondansetron: {
    name: "Ondansetron",
    class: "5-HT3 Receptor Antagonist",
    mechanism: "Blocks serotonin 5-HT3 receptors in gut and CNS",
    dosage: "8",
    unit: "mg",
    route: "IV",
    timing: "30 minutes before chemotherapy",
    indication: "acute",
    evidenceLevel: "IA",
    notes: "First-generation 5-HT3 antagonist"
  },
  granisetron: {
    name: "Granisetron",
    class: "5-HT3 Receptor Antagonist",
    mechanism: "Blocks serotonin 5-HT3 receptors with longer half-life",
    dosage: "1",
    unit: "mg",
    route: "IV",
    timing: "30 minutes before chemotherapy",
    indication: "acute",
    evidenceLevel: "IA",
    notes: "Longer duration of action than ondansetron"
  },
  palonosetron: {
    name: "Palonosetron",
    class: "5-HT3 Receptor Antagonist",
    mechanism: "Second-generation 5-HT3 antagonist with unique pharmacology",
    dosage: "0.25",
    unit: "mg",
    route: "IV",
    timing: "30 minutes before chemotherapy",
    indication: "both",
    evidenceLevel: "IA",
    notes: "Superior efficacy for delayed CINV vs first-generation agents"
  },
  
  // Corticosteroids
  dexamethasone_high_acute: {
    name: "Dexamethasone", 
    class: "Corticosteroid",
    mechanism: "Anti-inflammatory, enhances 5-HT3 and NK1 antagonist efficacy",
    dosage: "12",
    unit: "mg",
    route: "IV",
    timing: "30 minutes before chemotherapy",
    indication: "both",
    evidenceLevel: "IA",
    notes: "Day 1 dose for high emetogenic regimens"
  },
  dexamethasone_high_delayed: {
    name: "Dexamethasone",
    class: "Corticosteroid",
    mechanism: "Primary agent for delayed CINV prevention",
    dosage: "8",
    unit: "mg",
    route: "PO",
    timing: "Once daily morning",
    duration: "Days 2-4",
    indication: "delayed",
    evidenceLevel: "IA",
    notes: "Delayed CINV prevention for high emetogenic regimens"
  },
  dexamethasone_moderate: {
    name: "Dexamethasone",
    class: "Corticosteroid",
    mechanism: "Anti-inflammatory, enhances antiemetic efficacy",
    dosage: "8",
    unit: "mg",
    route: "IV",
    timing: "30 minutes before chemotherapy",
    indication: "acute",
    evidenceLevel: "IA", 
    notes: "Single dose for moderate emetogenic regimens"
  },
  
  // Dopamine Receptor Antagonists
  metoclopramide: {
    name: "Metoclopramide",
    class: "Dopamine Receptor Antagonist",
    mechanism: "Blocks dopamine receptors, enhances gastric motility",
    dosage: "10-20",
    unit: "mg",
    route: "IV",
    timing: "30 minutes before chemotherapy",
    indication: "acute",
    evidenceLevel: "IIB",
    notes: "Alternative antiemetic, watch for extrapyramidal effects"
  },
  prochlorperazine: {
    name: "Prochlorperazine",
    class: "Dopamine Receptor Antagonist",
    mechanism: "Blocks dopamine receptors in CTZ",
    dosage: "10",
    unit: "mg",
    route: "IV",
    timing: "As needed for breakthrough",
    indication: "acute",
    evidenceLevel: "IIB",
    notes: "Rescue antiemetic for breakthrough nausea"
  },
  
  // Atypical Antipsychotics
  olanzapine: {
    name: "Olanzapine",
    class: "Atypical Antipsychotic",
    mechanism: "Multi-receptor antagonist (5-HT3, 5-HT2C, D2, H1)",
    dosage: "10",
    unit: "mg",
    route: "PO",
    timing: "1 hour before chemotherapy",
    duration: "Days 1-4",
    indication: "both",
    evidenceLevel: "IA",
    notes: "Particularly effective for delayed CINV in high-risk regimens"
  },
  
  // Cannabinoids
  dronabinol: {
    name: "Dronabinol",
    class: "Cannabinoid",
    mechanism: "CB1 and CB2 receptor agonist",
    dosage: "5-10",
    unit: "mg",
    route: "PO",
    timing: "1-3 hours before chemotherapy",
    indication: "both",
    evidenceLevel: "IIB",
    notes: "Alternative for refractory CINV, may cause CNS effects"
  }
};

export const highEmetogenicProtocols: AntiemeticProtocol[] = [
  {
    id: "cisplatin_standard",
    name: "Cisplatin-Based High Emetogenic Protocol",
    riskLevel: "high",
    indication: ["cisplatin", "AC regimen", "cyclophosphamide >1500mg/m²"],
    agents: [
      standardAntiemeticAgents.fosaprepitant,
      standardAntiemeticAgents.palonosetron,
      standardAntiemeticAgents.dexamethasone_high_acute,
      standardAntiemeticAgents.dexamethasone_high_delayed
    ],
    clinicalRationale: "Triple therapy with NK1 antagonist, 5-HT3 antagonist, and corticosteroid provides optimal prevention for both acute and delayed CINV in high emetogenic regimens. Palonosetron preferred over first-generation 5-HT3 antagonists due to superior delayed CINV prevention.",
    acuteManagement: "Fosaprepitant 150mg IV + Palonosetron 0.25mg IV + Dexamethasone 12mg IV given 30 minutes before chemotherapy",
    delayedManagement: "Dexamethasone 8mg PO daily on days 2-4. Consider adding olanzapine 10mg PO daily x 4 days for high-risk patients.",
    guidelines: ["NCCN 2024", "ASCO 2020", "MASCC/ESMO 2023"]
  },
  {
    id: "ac_regimen_standard", 
    name: "AC Regimen High Emetogenic Protocol",
    riskLevel: "high",
    indication: ["doxorubicin + cyclophosphamide", "epirubicin + cyclophosphamide"],
    agents: [
      standardAntiemeticAgents.aprepitant_day1,
      standardAntiemeticAgents.aprepitant_day2_3,
      standardAntiemeticAgents.ondansetron,
      standardAntiemeticAgents.dexamethasone_high_acute,
      standardAntiemeticAgents.dexamethasone_high_delayed
    ],
    clinicalRationale: "AC regimens have >90% emetogenic risk requiring aggressive prophylaxis. Three-day aprepitant regimen provides sustained NK1 blockade for delayed CINV prevention. Anthracycline-cyclophosphamide combinations are among the most emetogenic regimens.",
    acuteManagement: "Aprepitant 125mg PO + Ondansetron 8mg IV + Dexamethasone 12mg IV given before chemotherapy",
    delayedManagement: "Aprepitant 80mg PO days 2-3 + Dexamethasone 8mg PO days 2-4",
    guidelines: ["NCCN 2024", "ASCO 2020", "MASCC/ESMO 2023"]
  },
  {
    id: "high_enhanced_olanzapine",
    name: "Enhanced High Emetogenic Protocol with Olanzapine",
    riskLevel: "high",
    indication: ["high-risk patients", "previous CINV breakthrough", "young patients"],
    agents: [
      standardAntiemeticAgents.fosaprepitant,
      standardAntiemeticAgents.palonosetron,
      standardAntiemeticAgents.dexamethasone_high_acute,
      standardAntiemeticAgents.olanzapine
    ],
    clinicalRationale: "Four-drug regimen for highest risk patients or those with history of breakthrough CINV. Olanzapine provides multi-receptor antagonism and has shown superior efficacy in preventing delayed CINV compared to standard triple therapy.",
    acuteManagement: "Fosaprepitant 150mg IV + Palonosetron 0.25mg IV + Dexamethasone 12mg IV + Olanzapine 10mg PO",
    delayedManagement: "Olanzapine 10mg PO daily days 2-4 (replaces delayed dexamethasone)",
    guidelines: ["NCCN 2024 Category 1", "ASCO 2020 emerging evidence"]
  }
];

export const moderateEmetogenicProtocols: AntiemeticProtocol[] = [
  {
    id: "carboplatin_standard",
    name: "Carboplatin/Moderate Emetogenic Protocol",
    riskLevel: "moderate",
    indication: ["carboplatin", "oxaliplatin", "irinotecan", "docetaxel", "paclitaxel + carboplatin"],
    agents: [
      standardAntiemeticAgents.palonosetron,
      standardAntiemeticAgents.dexamethasone_moderate
    ],
    clinicalRationale: "Dual therapy with 5-HT3 antagonist and corticosteroid provides adequate protection for moderate emetogenic regimens. Palonosetron preferred for its superior delayed CINV efficacy compared to first-generation 5-HT3 antagonists.",
    acuteManagement: "Palonosetron 0.25mg IV + Dexamethasone 8mg IV given 30 minutes before chemotherapy",
    delayedManagement: "No routine delayed prophylaxis recommended for moderate emetogenic regimens unless patient-specific risk factors present",
    guidelines: ["NCCN 2024", "ASCO 2020", "MASCC/ESMO 2023"]
  },
  {
    id: "moderate_enhanced_nk1",
    name: "Enhanced Moderate Protocol with NK1 Antagonist", 
    riskLevel: "moderate",
    indication: ["high-risk moderate patients", "previous breakthrough CINV", "combination moderate regimens"],
    agents: [
      standardAntiemeticAgents.fosaprepitant,
      standardAntiemeticAgents.palonosetron,
      standardAntiemeticAgents.dexamethasone_moderate
    ],
    clinicalRationale: "Triple therapy for moderate emetogenic regimens in high-risk patients or those with history of breakthrough CINV. NK1 antagonist addition provides enhanced delayed CINV protection.",
    acuteManagement: "Fosaprepitant 150mg IV + Palonosetron 0.25mg IV + Dexamethasone 8mg IV",
    delayedManagement: "No routine delayed therapy required with single-dose fosaprepitant",
    guidelines: ["NCCN 2024 Category 2A", "Clinical judgment based"]
  }
];

export const lowEmetogenicProtocols: AntiemeticProtocol[] = [
  {
    id: "low_single_agent",
    name: "Low Emetogenic Single Agent Protocol",
    riskLevel: "low", 
    indication: ["pemetrexed", "etoposide", "5-fluorouracil", "gemcitabine", "weekly paclitaxel"],
    agents: [
      standardAntiemeticAgents.dexamethasone_moderate
    ],
    clinicalRationale: "Single-agent dexamethasone provides adequate prophylaxis for low emetogenic regimens. Adding 5-HT3 antagonists is not routinely recommended unless patient-specific risk factors present.",
    acuteManagement: "Dexamethasone 8mg IV or PO given before chemotherapy",
    delayedManagement: "No routine delayed prophylaxis recommended",
    guidelines: ["NCCN 2024", "ASCO 2020"]
  },
  {
    id: "low_enhanced_5ht3",
    name: "Enhanced Low Emetogenic Protocol",
    riskLevel: "low",
    indication: ["high-risk low patients", "previous CINV with low agents", "patient anxiety"],
    agents: [
      standardAntiemeticAgents.ondansetron,
      standardAntiemeticAgents.dexamethasone_moderate
    ],
    clinicalRationale: "Dual therapy for low emetogenic regimens in patients with risk factors for CINV including age <50 years, history of CINV, anxiety, or motion sickness.",
    acuteManagement: "Ondansetron 8mg IV + Dexamethasone 8mg IV given before chemotherapy",
    delayedManagement: "No delayed prophylaxis recommended",
    guidelines: ["NCCN 2024 Category 2B", "Patient-specific factors"]
  }
];

export const minimalEmetogenicProtocols: AntiemeticProtocol[] = [
  {
    id: "minimal_no_prophylaxis",
    name: "Minimal Emetogenic - No Routine Prophylaxis",
    riskLevel: "minimal",
    indication: ["bevacizumab", "cetuximab", "trastuzumab", "immunotherapy", "vinorelbine", "capecitabine"],
    agents: [],
    clinicalRationale: "Minimal emetogenic agents have <10% risk of CINV. Routine antiemetic prophylaxis is not recommended. Rescue antiemetics should be available for breakthrough symptoms.",
    acuteManagement: "No routine prophylaxis recommended",
    delayedManagement: "No routine prophylaxis recommended",
    guidelines: ["NCCN 2024", "ASCO 2020"]
  },
  {
    id: "minimal_rescue_available",
    name: "Minimal Emetogenic - PRN Rescue Protocol",
    riskLevel: "minimal",
    indication: ["patient anxiety", "previous CINV with minimal agents", "patient preference"],
    agents: [
      standardAntiemeticAgents.prochlorperazine,
      standardAntiemeticAgents.metoclopramide
    ],
    clinicalRationale: "For patients receiving minimal emetogenic therapy who experience breakthrough CINV or have high anxiety. Rescue agents should be readily available.",
    acuteManagement: "No prophylaxis, rescue agents available PRN",
    delayedManagement: "PRN rescue antiemetics for breakthrough symptoms",
    guidelines: ["Clinical judgment", "Patient preference"]
  }
];

export const allAntiemeticProtocols: AntiemeticProtocol[] = [
  ...highEmetogenicProtocols,
  ...moderateEmetogenicProtocols, 
  ...lowEmetogenicProtocols,
  ...minimalEmetogenicProtocols
];

// Helper function to get recommended protocols based on regimen drugs
export const getRecommendedAntiemeticProtocols = (drugNames: string[]): AntiemeticProtocol[] => {
  const recommendedProtocols: AntiemeticProtocol[] = [];
  const lowerDrugNames = drugNames.map(name => name.toLowerCase());
  
  // Check for high emetogenic combinations
  const hasAC = lowerDrugNames.some(drug => drug.includes('doxorubicin') || drug.includes('adriamycin')) &&
                lowerDrugNames.some(drug => drug.includes('cyclophosphamide'));
  
  const hasCisplatin = lowerDrugNames.some(drug => drug.includes('cisplatin'));
  
  if (hasAC) {
    recommendedProtocols.push(...highEmetogenicProtocols.filter(p => p.indication.includes('AC regimen')));
  }
  
  if (hasCisplatin) {
    recommendedProtocols.push(...highEmetogenicProtocols.filter(p => p.indication.includes('cisplatin')));
  }
  
  // Check for moderate emetogenic drugs
  const hasCarboplatin = lowerDrugNames.some(drug => drug.includes('carboplatin'));
  const hasOxaliplatin = lowerDrugNames.some(drug => drug.includes('oxaliplatin'));
  const hasIrinotecan = lowerDrugNames.some(drug => drug.includes('irinotecan'));
  
  if (hasCarboplatin || hasOxaliplatin || hasIrinotecan) {
    recommendedProtocols.push(...moderateEmetogenicProtocols.filter(p => p.id === 'carboplatin_standard'));
  }
  
  // Check for low emetogenic drugs
  const hasPemetrexed = lowerDrugNames.some(drug => drug.includes('pemetrexed'));
  const hasEtoposide = lowerDrugNames.some(drug => drug.includes('etoposide'));
  const hasFluorouracil = lowerDrugNames.some(drug => drug.includes('fluorouracil') || drug.includes('5-fu'));
  
  if (hasPemetrexed || hasEtoposide || hasFluorouracil) {
    recommendedProtocols.push(...lowEmetogenicProtocols.filter(p => p.id === 'low_single_agent'));
  }
  
  // Always include enhanced options
  if (recommendedProtocols.length === 0) {
    recommendedProtocols.push(minimalEmetogenicProtocols[0]);
  }
  
  return recommendedProtocols;
};