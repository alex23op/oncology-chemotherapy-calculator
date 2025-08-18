import { Regimen } from "@/types/regimens";

// Cervical Cancer Regimens
export const cervicalCancerRegimens: Regimen[] = [
  // HSE/NCCP Regimens
  {
    id: "00716a",
    name: "Bevacizumab + Carboplatin (AUC5) + Paclitaxel 175 mg/m²",
    category: "advanced",
    description: "Cervical persistent/recurrent/metastatic, inoperable/refractory",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Bevacizumab", dosage: "15", unit: "mg/kg", route: "IV", day: "Day 1", administrationDuration: "90 min (first dose), then 60 min, then 30 min" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" }
    ]
  },
  {
    id: "00717a", 
    name: "Carboplatin (AUC5-7.5) + Paclitaxel 175 mg/m²",
    category: "advanced",
    description: "Cervical recurrent/metastatic",
    schedule: "Day 1 every 21 days", 
    cycles: 6,
    drugs: [
      { name: "Carboplatin", dosage: "AUC5-7.5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" }
    ]
  },
  {
    id: "00718a",
    name: "Cisplatin 75 mg/m² + Paclitaxel 175 mg/m²",
    category: "advanced",
    description: "Cervical recurrent/metastatic",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Cisplatin", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "2 h" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" }
    ]
  },
  {
    id: "00719a",
    name: "Cemiplimab 350 mg",
    category: "advanced", 
    description: "Cervical recurrent/metastatic post-platinum (PD-L1 ≥1%)",
    schedule: "Day 1 every 21 days",
    cycles: 999,
    drugs: [
      { name: "Cemiplimab", dosage: "350", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min" }
    ]
  },
  
  // NCCN/ESMO Regimens
  {
    id: "nccn-cervical-001",
    name: "Pembrolizumab + Paclitaxel + Carboplatin + Bevacizumab",
    category: "advanced",
    description: "Advanced cervical cancer PDL-1 CPS ≥1 (NCCN 1.2025/ESMO preferred first-line)",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Bevacizumab", dosage: "15", unit: "mg/kg", route: "IV", day: "Day 1", administrationDuration: "90 min (first dose)" }
    ]
  },
  {
    id: "esmo-cervical-002",
    name: "Tisotumab vedotin",
    category: "advanced",
    description: "Recurrent/metastatic post-chemotherapy (ESMO 2024 second-line)",
    schedule: "Day 1 every 21 days",
    cycles: 999,
    drugs: [
      { name: "Tisotumab vedotin", dosage: "2", unit: "mg/kg", route: "IV", day: "Day 1", administrationDuration: "30 min" }
    ]
  },
  {
    id: "nccn-cervical-003",
    name: "Cisplatin + Radiotherapy",
    category: "neoadjuvant",
    description: "Locally advanced cervical cancer with concurrent radiotherapy (NCCN 1.2025)",
    schedule: "Weekly during radiotherapy",
    cycles: 5,
    drugs: [
      { name: "Cisplatin", dosage: "40", unit: "mg/m²", route: "IV", day: "Weekly", administrationDuration: "1 h" }
    ]
  },
  {
    id: "nccn-cervical-004",
    name: "Atezolizumab + Bevacizumab + Chemotherapy",
    category: "metastatic",
    description: "Metastatic cervical cancer (NCCN update 2025 first-line)",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Atezolizumab", dosage: "1200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Bevacizumab", dosage: "15", unit: "mg/kg", route: "IV", day: "Day 1" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1" }
    ]
  }
];

// Endometrial Cancer Regimens
export const endometrialCancerRegimens: Regimen[] = [
  // HSE/NCCP Regimens
  {
    id: "00720a",
    name: "Carboplatin (AUC5) + Paclitaxel 175 mg/m²",
    category: "adjuvant",
    description: "Endometrial carcinoma adjuvant treatment",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" }
    ]
  },
  {
    id: "00721a",
    name: "Doxorubicin 60 mg/m² + Cisplatin 50 mg/m²",
    category: "advanced",
    description: "Endometrial carcinoma advanced/recurrent",
    schedule: "Day 1 every 28 days",
    cycles: 6,
    drugs: [
      { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "15 min" },
      { name: "Cisplatin", dosage: "50", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "2 h" }
    ]
  },
  
  // NCCN/ESMO Regimens
  {
    id: "nccn-endometrial-001",
    name: "Dostarlimab + Carboplatin + Paclitaxel",
    category: "advanced",
    description: "Advanced/recurrent dMMR/MSI-H endometrial cancer (NCCN 1.2023/ESMO 2024 preferred first-line)",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Dostarlimab", dosage: "500", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min", notes: "500 mg q3w x4 cycles, then 1000 mg q6w" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" }
    ]
  },
  {
    id: "nccn-endometrial-002",
    name: "Pembrolizumab + Carboplatin + Paclitaxel",
    category: "advanced",
    description: "Stage III/IV or recurrent endometrial cancer (NCCN 2025 category 1)",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min" },
      { name: "Carboplatin", dosage: "AUC6", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" }
    ]
  },
  {
    id: "esmo-endometrial-003",
    name: "Lenvatinib + Pembrolizumab",
    category: "advanced",
    description: "Advanced non-MSI-H/pMMR endometrial cancer (ESMO 2024 second-line)",
    schedule: "Lenvatinib daily + Pembrolizumab every 21 days",
    cycles: 999,
    drugs: [
      { name: "Lenvatinib", dosage: "20", unit: "mg", route: "PO", day: "Daily" },
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min" }
    ]
  }
];

// Gestational Trophoblastic Neoplasia Regimens
export const gtnRegimens: Regimen[] = [
  {
    id: "nccn-gtn-001",
    name: "Methotrexate (single-agent)",
    category: "adjuvant",
    description: "Low-risk GTN, WHO score ≤6 (NCCN 3.2025/ESMO preferred low-risk)",
    schedule: "8-day or 5-day regimen",
    cycles: 12,
    drugs: [
      { name: "Methotrexate", dosage: "0.4-1.0", unit: "mg/kg", route: "IM/IV", day: "Days 1, 3, 5, 7", administrationDuration: "Push" }
    ]
  },
  {
    id: "nccn-gtn-002",
    name: "EMA-CO",
    category: "advanced",
    description: "High-risk GTN, WHO score ≥7 (NCCN/ESMO standard high-risk)",
    schedule: "Weekly alternating EMA/CO",
    cycles: 8,
    drugs: [
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-2", administrationDuration: "1 h" },
      { name: "Methotrexate", dosage: "300", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "12 h infusion" },
      { name: "Actinomycin D", dosage: "0.5", unit: "mg", route: "IV", day: "Days 1-2", administrationDuration: "Push" },
      { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV", day: "Day 8", administrationDuration: "1 h" },
      { name: "Vincristine", dosage: "1", unit: "mg/m²", route: "IV", day: "Day 8", administrationDuration: "Push", notes: "Max 2 mg" }
    ]
  },
  {
    id: "nccn-gtn-003",
    name: "EMA/EP",
    category: "advanced",
    description: "Refractory high-risk GTN (NCCN 2025 for resistant disease)",
    schedule: "Alternating weekly",
    cycles: 6,
    drugs: [
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Days 1-2", administrationDuration: "1 h" },
      { name: "Methotrexate", dosage: "300", unit: "mg/m²", route: "IV", day: "Day 1" },
      { name: "Actinomycin D", dosage: "0.5", unit: "mg", route: "IV", day: "Days 1-2" },
      { name: "Cisplatin", dosage: "75", unit: "mg/m²", route: "IV", day: "Day 8", administrationDuration: "2 h" },
      { name: "Etoposide", dosage: "100", unit: "mg/m²", route: "IV", day: "Day 8" }
    ]
  },
  {
    id: "esmo-gtn-004",
    name: "Actinomycin D (single-agent)",
    category: "adjuvant",
    description: "Low-risk GTN, methotrexate resistance (ESMO 2024 alternative)",
    schedule: "Pulse or 5-day regimen",
    cycles: 10,
    drugs: [
      { name: "Actinomycin D", dosage: "1.25", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "Push", notes: "Pulse dose every 2 weeks" }
    ]
  }
];

// Ovarian, Fallopian Tube & Primary Peritoneal Cancer Regimens
export const ovarianCancerRegimens: Regimen[] = [
  // HSE/NCCP Regimens
  {
    id: "00722a",
    name: "Carboplatin (AUC5-6) + Paclitaxel 175 mg/m²",
    category: "adjuvant",
    description: "Ovarian carcinoma first-line treatment",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Carboplatin", dosage: "AUC5-6", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" }
    ]
  },
  {
    id: "00723a",
    name: "Carboplatin (AUC5) + Gemcitabine 1000 mg/m²",
    category: "advanced",
    description: "Ovarian carcinoma recurrent platinum-sensitive",
    schedule: "Days 1, 8 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Gemcitabine", dosage: "1000", unit: "mg/m²", route: "IV", day: "Days 1, 8", administrationDuration: "30 min" }
    ]
  },
  
  // NCCN/ESMO Regimens
  {
    id: "nccn-ovarian-001",
    name: "Carboplatin + Paclitaxel + Bevacizumab",
    category: "advanced",
    description: "First-line advanced ovarian cancer (NCCN 3.2025/ESMO preferred front-line)",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Carboplatin", dosage: "AUC5-6", unit: "AUC", route: "IV", day: "Day 1", administrationDuration: "60 min" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1", administrationDuration: "3 h" },
      { name: "Bevacizumab", dosage: "15", unit: "mg/kg", route: "IV", day: "Day 1", administrationDuration: "90 min (first dose)" }
    ]
  },
  {
    id: "nccn-ovarian-002",
    name: "Olaparib maintenance",
    category: "adjuvant",
    description: "BRCA mutated ovarian cancer post-platinum response (NCCN/ESMO category 1 maintenance)",
    schedule: "Continuous daily",
    cycles: 24,
    drugs: [
      { name: "Olaparib", dosage: "300", unit: "mg", route: "PO", day: "Twice daily" }
    ]
  },
  {
    id: "nccn-ovarian-003",
    name: "Niraparib maintenance",
    category: "adjuvant",
    description: "HRD+ or all ovarian cancer post-platinum (NCCN 2025 post-platinum maintenance)",
    schedule: "Continuous daily",
    cycles: 36,
    drugs: [
      { name: "Niraparib", dosage: "200-300", unit: "mg", route: "PO", day: "Daily", notes: "Dose based on baseline weight/platelet count" }
    ]
  },
  {
    id: "esmo-ovarian-004",
    name: "Pembrolizumab + Chemotherapy",
    category: "advanced",
    description: "dMMR advanced ovarian cancer (ESMO 2024 first-line)",
    schedule: "Day 1 every 21 days",
    cycles: 6,
    drugs: [
      { name: "Pembrolizumab", dosage: "200", unit: "mg", route: "IV", day: "Day 1", administrationDuration: "30 min" },
      { name: "Carboplatin", dosage: "AUC5", unit: "AUC", route: "IV", day: "Day 1" },
      { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV", day: "Day 1" }
    ]
  },
  {
    id: "nccn-ovarian-005",
    name: "Rucaparib maintenance",
    category: "adjuvant", 
    description: "BRCAm platinum-sensitive recurrent ovarian cancer (NCCN update)",
    schedule: "Continuous daily",
    cycles: 999,
    drugs: [
      { name: "Rucaparib", dosage: "600", unit: "mg", route: "PO", day: "Twice daily" }
    ]
  }
];

export const gynaecologyRegimens = [
  ...cervicalCancerRegimens,
  ...endometrialCancerRegimens,
  ...gtnRegimens,
  ...ovarianCancerRegimens
];