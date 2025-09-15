import { useMemo } from 'react';
import { Pill, AlertTriangle, Droplet, Shield, Heart, Activity, Zap } from 'lucide-react';
import { PremedAgent } from '@/types/clinicalTreatment';

interface LocalPremedAgent extends PremedAgent {
  administrationDuration?: string;
  weightBased?: boolean;
  notes?: string;
  evidenceLevel?: string;
  drugSpecific?: string[];
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  agents: LocalPremedAgent[];
}

const premedCategories: CategoryData[] = [
  {
    id: "cinv",
    name: "Antiemetic Agents for CINV",
    description: "5-HT3 RAs, NK1 RAs, corticosteroids, olanzapine for chemotherapy-induced nausea/vomiting",
    icon: Pill,
    color: "bg-blue-50 border-blue-200 text-blue-800",
    agents: [
      {
        name: "Ondansetron",
        category: "5-HT3 Receptor Antagonist",
        class: "Serotonin Antagonist",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        indication: "Acute CINV prevention",
        rationale: "First-line agent for acute emesis prevention in moderate to high emetogenic regimens",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["cisplatin", "carboplatin", "doxorubicin", "cyclophosphamide"],
        solvent: null
      },
      {
        name: "Granisetron",
        category: "5-HT3 Receptor Antagonist", 
        class: "Serotonin Antagonist",
        dosage: "1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        indication: "Acute CINV prevention",
        rationale: "Alternative 5-HT3 antagonist with longer half-life",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IA",
        solvent: null
      },
      {
        name: "Aprepitant",
        category: "NK1 Receptor Antagonist",
        class: "Neurokinin-1 Antagonist",
        dosage: "125",
        unit: "mg",
        route: "PO",
        timing: "1 hour before chemotherapy (Day 1), then 80mg PO Days 2-3",
        indication: "Delayed CINV prevention",
        rationale: "Essential for delayed emesis prevention in highly emetogenic regimens",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["cisplatin", "doxorubicin", "cyclophosphamide"],
        solvent: null
      },
      {
        name: "Dexamethasone",
        category: "Corticosteroid",
        class: "Anti-inflammatory",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        indication: "CINV prevention, hypersensitivity reaction prevention",
        rationale: "Synergistic antiemetic effect, reduces delayed emesis, and prevents severe hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["paclitaxel", "docetaxel", "carboplatin", "oxaliplatin", "cisplatin", "doxorubicin", "cyclophosphamide"],
        solvent: null
      },
      {
        name: "Olanzapine",
        category: "Atypical Antipsychotic",
        class: "Dopamine/Serotonin Antagonist", 
        dosage: "10",
        unit: "mg",
        route: "PO",
        timing: "1 hour before chemotherapy, continue daily x 4 days",
        indication: "Breakthrough CINV, highly emetogenic regimens",
        rationale: "Highly effective for refractory CINV, multiple receptor antagonism",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIA",
        drugSpecific: ["cisplatin"],
        solvent: null
      }
    ]
  },
  {
    id: "cholinergic",
    name: "Cholinergic Syndrome Management",
    description: "Agents for managing cholinergic symptoms from specific chemotherapy agents",
    icon: AlertTriangle,
    color: "bg-orange-50 border-orange-200 text-orange-800",
    agents: [
      {
        name: "Atropine",
        category: "Anticholinergic",
        class: "Muscarinic Antagonist",
        dosage: "0.25-1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before irinotecan",
        indication: "Cholinergic syndrome prevention",
        rationale: "Prevents acute cholinergic symptoms (diarrhea, cramping, diaphoresis) from irinotecan",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["irinotecan"],
        solvent: null
      }
    ]
  },
  {
    id: "diarrhea",
    name: "Diarrhea Control Agents",
    description: "Management of delayed diarrhea from specific chemotherapy regimens",
    icon: Droplet,
    color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    agents: [
      {
        name: "Loperamide",
        category: "Antidiarrheal",
        class: "Opioid Receptor Agonist",
        dosage: "4",
        unit: "mg",
        route: "PO",
        timing: "At first sign of loose stool, then 2mg after each loose stool (max 16mg/day)",
        indication: "Delayed diarrhea management",
        rationale: "Standard treatment for irinotecan-induced delayed diarrhea",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIA",
        drugSpecific: ["irinotecan", "FOLFIRI"],
        solvent: null
      }
    ]
  },
  {
    id: "infusion_reaction",
    name: "Infusion Reaction Prophylaxis", 
    description: "Prevention of hypersensitivity and infusion reactions",
    icon: Shield,
    color: "bg-red-50 border-red-200 text-red-800",
    agents: [
      {
        name: "Diphenhydramine",
        category: "Antihistamine (H1)",
        class: "Histamine Antagonist",
        dosage: "25-50",
        unit: "mg",
        route: "IV",
        timing: "30-60 minutes before chemotherapy",
        indication: "Hypersensitivity reaction prevention",
        rationale: "Prevents type I hypersensitivity reactions to taxanes and platinum agents",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["paclitaxel", "docetaxel", "carboplatin", "oxaliplatin"],
        solvent: null
      },
      {
        name: "Famotidine",
        category: "H2 Receptor Blocker",
        class: "Histamine Antagonist",
        dosage: "20",
        unit: "mg",
        route: "IV",
        timing: "30-60 minutes before chemotherapy",
        indication: "Hypersensitivity reaction prevention",
        rationale: "H2 blockade reduces severity of hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["paclitaxel", "docetaxel", "carboplatin", "oxaliplatin"],
        solvent: null
      },
    ]
  },
  {
    id: "gastroprotection",
    name: "Gastroprotection",
    description: "Gastric protection when using steroids or gastric irritant chemotherapy",
    icon: Heart,
    color: "bg-green-50 border-green-200 text-green-800",
    agents: [
      {
        name: "Omeprazole",
        category: "Proton Pump Inhibitor",
        class: "Gastric Acid Suppressor",
        dosage: "20",
        unit: "mg",
        route: "PO",
        timing: "Daily while receiving steroids",
        indication: "Gastric ulcer prevention",
        rationale: "Prevents steroid-induced gastric ulceration",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIA",
        solvent: null
      },
      {
        name: "Famotidine",
        category: "H2 Receptor Blocker",
        class: "Histamine Antagonist",
        dosage: "20",
        unit: "mg",
        route: "PO",
        timing: "Twice daily",
        indication: "Gastric acid reduction",
        rationale: "Alternative gastroprotection for patients intolerant to PPIs",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      }
    ]
  },
  {
    id: "organ_protection",
    name: "Organ-Protective Agents",
    description: "Nephroprotection, cardioprotection, and uroprotection agents",
    icon: Activity,
    color: "bg-purple-50 border-purple-200 text-purple-800",
    agents: [
      {
        name: "Furosemide",
        category: "Diuretic",
        class: "Loop Diuretic",
        dosage: "20-40",
        unit: "mg",
        route: "IV",
        timing: "After cisplatin infusion",
        indication: "Nephroprotection",
        rationale: "Promotes diuresis to reduce cisplatin nephrotoxicity",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIA",
        drugSpecific: ["cisplatin"],
        solvent: null
      },
      {
        name: "Mannitol",
        category: "Osmotic Diuretic",
        class: "Diuretic",
        dosage: "12.5",
        unit: "g",
        route: "IV",
        timing: "Before and after cisplatin",
        indication: "Nephroprotection",
        rationale: "Osmotic diuresis reduces cisplatin concentration in renal tubules",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIA",
        drugSpecific: ["cisplatin"],
        solvent: null
      },
      {
        name: "Mesna",
        category: "Uroprotectant",
        class: "Thiol Compound",
        dosage: "400",
        unit: "mg/m²",
        route: "IV",
        timing: "0, 4, and 8 hours after cyclophosphamide",
        indication: "Hemorrhagic cystitis prevention",
        rationale: "Neutralizes acrolein metabolite of cyclophosphamide in bladder",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["cyclophosphamide", "ifosfamide"],
        solvent: null
      },
      {
        name: "Dexrazoxane",
        category: "Cardioprotectant",
        class: "Iron Chelator",
        dosage: "300",
        unit: "mg/m²",
        route: "IV",
        timing: "30 minutes before doxorubicin",
        indication: "Cardiomyopathy prevention",
        rationale: "Prevents doxorubicin-induced cardiomyopathy by iron chelation",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIA",
        drugSpecific: ["doxorubicin"],
        notes: "Consider after cumulative dose ≥300 mg/m²",
        solvent: null
      }
    ]
  },
  {
    id: "electrolyte",
    name: "Electrolyte & Nutritional Support",
    description: "Vitamins, minerals, and electrolyte supplementation during chemotherapy",
    icon: Zap,
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    agents: [
      {
        name: "Magnesium Sulfate",
        category: "Electrolyte Supplement",
        class: "Mineral Supplement",
        dosage: "1-2",
        unit: "g",
        route: "IV",
        timing: "Before oxaliplatin to prevent neuropathy",
        indication: "Neuropathy prevention, hypomagnesemia",
        rationale: "May reduce oxaliplatin-induced peripheral neuropathy severity",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIB",
        drugSpecific: ["oxaliplatin"],
        solvent: null
      },
      {
        name: "Calcium Gluconate",
        category: "Electrolyte Supplement",
        class: "Mineral Supplement",
        dosage: "1",
        unit: "g",
        route: "IV",
        timing: "Before oxaliplatin",
        indication: "Neuropathy prevention",
        rationale: "Theoretical benefit for oxaliplatin neuropathy prevention",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIB",
        drugSpecific: ["oxaliplatin"],
        solvent: null
      },
      {
        name: "Vitamin B12",
        category: "Vitamin Supplement",
        class: "Water-soluble Vitamin",
        dosage: "1000",
        unit: "μg",
        route: "IM",
        timing: "Before and during pemetrexed cycle",
        indication: "Folate pathway support",
        rationale: "Essential supplementation to reduce pemetrexed toxicity",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["pemetrexed"],
        solvent: null
      },
      {
        name: "Folic Acid",
        category: "Vitamin Supplement",
        class: "Water-soluble Vitamin",
        dosage: "5",
        unit: "mg",
        route: "PO",
        timing: "Daily starting 1 week before pemetrexed",
        indication: "Folate pathway support",
        rationale: "Mandatory supplementation to prevent severe pemetrexed toxicity",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["pemetrexed"],
        solvent: null
      }
    ]
  },
  {
    id: "nutritional_supplements",
    name: "Suplimente nutritive",
    description: "Vitamine și suplimente pentru suportul nutrițional în timpul chimioterapiei",
    icon: Zap,
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    agents: [
      {
        name: "Vitamina B1 (fiolă)",
        category: "Supliment vitaminic",
        class: "Vitamina hidrosolubilă",
        dosage: "100",
        unit: "mg",
        route: "IV",
        timing: "Per protocol",
        indication: "Suport metabolic, deficiență vitamina B1",
        rationale: "Esențială pentru metabolismul carbohidraților și funcția neurologică",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      },
      {
        name: "Vitamina B6 (fiolă)",
        category: "Supliment vitaminic",
        class: "Vitamina hidrosolubilă",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "Per protocol",
        indication: "Suport metabolic, deficiență vitamina B6",
        rationale: "Important pentru metabolismul aminoacizilor și sinteza neurotransmițătorilor",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      },
      {
        name: "Vitamina C (fiolă)",
        category: "Supliment vitaminic",
        class: "Vitamina hidrosolubilă",
        dosage: "500",
        unit: "mg",
        route: "IV",
        timing: "Per protocol",
        indication: "Suport antioxidant, vindecarea rănilor",
        rationale: "Antioxidant puternic, suportă sistemul imunitar și sinteza colagenului",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      },
      {
        name: "Solu-Vit (fiolă)",
        category: "Complex vitaminic",
        class: "Multivitamine",
        dosage: "1",
        unit: "fiolă",
        route: "IV",
        timing: "Per protocol",
        indication: "Suport vitaminic complex",
        rationale: "Complex de vitamine pentru suportul general al organismului",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      },
      {
        name: "Aspatofort",
        category: "Hepatoprotector",
        class: "Aminoacid",
        dosage: "Per protocol",
        unit: "",
        route: "IV",
        timing: "Per protocol",
        indication: "Protecția hepatică",
        rationale: "Suport pentru funcția hepatică în timpul chimioterapiei",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      },
      {
        name: "Aminosteril N-Hepa",
        category: "Supliment aminoacizi",
        class: "Aminoacizi",
        dosage: "Per protocol",
        unit: "",
        route: "IV",
        timing: "Per protocol",
        indication: "Suport nutrițional hepatic",
        rationale: "Aminoacizi specializați pentru suportul funcției hepatice",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      },
      {
        name: "Arginina Sorbitol",
        category: "Supliment aminoacizi",
        class: "Aminoacid + Sorbitol",
        dosage: "Per protocol",
        unit: "",
        route: "IV",
        timing: "Per protocol",
        indication: "Suport metabolic și cicatrizare",
        rationale: "Suportă sinteza proteinelor și procesele de vindeccare",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      },
      {
        name: "Hepa-Merz",
        category: "Hepatoprotector",
        class: "L-ornitină L-aspartat",
        dosage: "Per protocol",
        unit: "",
        route: "IV",
        timing: "Per protocol",
        indication: "Protecția hepatică, detoxifiere",
        rationale: "Suportă detoxifierea hepatică și funcția metabolică",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIB",
        solvent: null
      }
    ]
  }
];

export const useAvailableMedications = () => {
  return useMemo(() => {
    const allMedications: LocalPremedAgent[] = [];
    const categoriesWithMedications = premedCategories.map(category => ({
      ...category,
      medications: category.agents
    }));

    // Flatten all medications
    premedCategories.forEach(category => {
      allMedications.push(...category.agents);
    });

    return {
      categories: categoriesWithMedications,
      allMedications,
      searchMedications: (searchTerm: string) => {
        if (!searchTerm.trim()) return categoriesWithMedications;
        
        const filteredCategories = categoriesWithMedications.map(category => ({
          ...category,
          medications: category.medications.filter(med => 
            med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })).filter(category => category.medications.length > 0);

        return filteredCategories;
      }
    };
  }, []);
};