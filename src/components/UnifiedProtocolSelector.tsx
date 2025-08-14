import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, Clock, Pill, ChevronDown, BookOpen, Edit, Heart, Activity, Zap, Droplet, Users, FileText } from "lucide-react";
import { Drug } from "@/types/regimens";
import { useTranslation } from 'react-i18next';

interface UnifiedProtocolSelectorProps {
  drugNames: string[];
  drugs: Drug[];
  emetogenicRiskLevel: "high" | "moderate" | "low" | "minimal";
  selectedPremedications: any[];
  selectedAntiemetics: any[];
  onPremedSelectionsChange: (premedications: any[]) => void;
  onAntiemeticProtocolChange: (agents: any[]) => void;
  weight: number;
}

interface PremedAgent {
  name: string;
  category: string;
  class: string;
  dosage: string;
  unit: string;
  route: string;
  timing: string;
  indication: string;
  rationale: string;
  isRequired: boolean;
  isStandard: boolean;
  administrationDuration?: string;
  weightBased?: boolean;
  notes?: string;
  evidenceLevel?: string;
  drugSpecific?: string[];
  solvent?: string;
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  agents: PremedAgent[];
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
        drugSpecific: ["cisplatin", "carboplatin", "doxorubicin", "cyclophosphamide"]
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
        evidenceLevel: "IA"
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
        drugSpecific: ["cisplatin", "doxorubicin", "cyclophosphamide"]
      },
      {
        name: "Dexamethasone",
        category: "Corticosteroid",
        class: "Anti-inflammatory",
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        indication: "CINV prevention, antiemetic potentiation",
        rationale: "Synergistic antiemetic effect, reduces delayed emesis",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA"
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
        drugSpecific: ["cisplatin"]
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
        drugSpecific: ["irinotecan"]
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
        drugSpecific: ["irinotecan", "FOLFIRI"]
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
        drugSpecific: ["paclitaxel", "docetaxel", "carboplatin", "oxaliplatin"]
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
        drugSpecific: ["paclitaxel", "docetaxel", "carboplatin", "oxaliplatin"]
      },
      {
        name: "Dexamethasone",
        category: "Corticosteroid",
        class: "Anti-inflammatory",
        dosage: "20",
        unit: "mg",
        route: "IV",
        timing: "30-60 minutes before chemotherapy",
        indication: "Hypersensitivity reaction prevention",
        rationale: "Potent anti-inflammatory effect prevents severe hypersensitivity",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["paclitaxel", "docetaxel"]
      }
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
        evidenceLevel: "IIA"
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
        evidenceLevel: "IIB"
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
        drugSpecific: ["cisplatin"]
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
        drugSpecific: ["cisplatin"]
      },
      {
        name: "Mesna",
        category: "Uroprotectant",
        class: "Sulfhydryl Compound",
        dosage: "60% of cyclophosphamide dose",
        unit: "mg",
        route: "IV",
        timing: "Before, 4h, and 8h after cyclophosphamide",
        indication: "Hemorrhagic cystitis prevention",
        rationale: "Detoxifies acrolein metabolite preventing bladder toxicity",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["cyclophosphamide", "ifosfamide"]
      },
      {
        name: "Dexrazoxane",
        category: "Cardioprotectant",
        class: "Iron Chelator",
        dosage: "10:1 ratio to doxorubicin",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before doxorubicin",
        indication: "Cardiotoxicity prevention",
        rationale: "Prevents doxorubicin-induced cardiomyopathy in high cumulative doses",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIA",
        drugSpecific: ["doxorubicin"],
        notes: "Consider after cumulative dose >300 mg/m²"
      }
    ]
  },
  {
    id: "tumor_lysis",
    name: "Tumor Lysis Syndrome Prophylaxis",
    description: "Prevention of tumor lysis syndrome in high-risk patients",
    icon: Zap,
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    agents: [
      {
        name: "Allopurinol",
        category: "Xanthine Oxidase Inhibitor",
        class: "Uric Acid Reducer",
        dosage: "300",
        unit: "mg",
        route: "PO",
        timing: "Daily, start 24-48h before chemotherapy",
        indication: "Hyperuricemia prevention",
        rationale: "Prevents uric acid formation in high tumor burden patients",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IA",
        notes: "For intermediate TLS risk"
      },
      {
        name: "Rasburicase",
        category: "Urate Oxidase",
        class: "Uric Acid Metabolizer", 
        dosage: "0.2",
        unit: "mg/kg",
        route: "IV",
        timing: "Once daily x 1-5 days",
        indication: "Severe hyperuricemia treatment",
        rationale: "Rapidly metabolizes existing uric acid in high-risk TLS patients",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IA",
        notes: "For high TLS risk, contraindicated in G6PD deficiency"
      }
    ]
  },
  {
    id: "growth_factors",
    name: "Hematologic Growth Factors",
    description: "Support for bone marrow function and blood cell recovery",
    icon: Users,
    color: "bg-cyan-50 border-cyan-200 text-cyan-800",
    agents: [
      {
        name: "Pegfilgrastim",
        category: "G-CSF",
        class: "Granulocyte Colony Stimulating Factor",
        dosage: "6",
        unit: "mg",
        route: "SQ",
        timing: "24-72 hours after chemotherapy completion",
        indication: "Neutropenia prevention",
        rationale: "Reduces incidence and duration of severe neutropenia",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IA",
        notes: "Use when neutropenia risk >20%"
      },
      {
        name: "Filgrastim",
        category: "G-CSF",
        class: "Granulocyte Colony Stimulating Factor",
        dosage: "5",
        unit: "mcg/kg",
        route: "SQ",
        timing: "Daily starting 24-72h after chemotherapy until ANC recovery",
        indication: "Neutropenia prevention/treatment",
        rationale: "Stimulates neutrophil production and function",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IA"
      }
    ]
  },
  {
    id: "nutrition",
    name: "Nutritional and Vitamin Support",
    description: "Adjunctive amino acids and vitamins for supportive care",
    icon: BookOpen,
    color: "bg-teal-50 border-teal-200 text-teal-800",
    agents: [
      {
        name: "Arginine Sorbitol",
        category: "Amino Acid Solution",
        class: "Nutritional Support",
        dosage: "100",
        unit: "mL",
        route: "IV",
        timing: "During chemotherapy as prescribed",
        indication: "Nutritional support",
        rationale: "Adjunctive nutritional support in selected patients",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIA"
      },
      {
        name: "Aminosterin N-hepa",
        category: "Amino Acid Solution",
        class: "Nutritional Support",
        dosage: "250",
        unit: "mL",
        route: "IV",
        timing: "As prescribed",
        indication: "Parenteral nutrition support",
        rationale: "Amino acids for hepatic patients",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIB"
      },
      {
        name: "Aspatofort",
        category: "Hepatoprotective",
        class: "Amino acids",
        dosage: "1-2",
        unit: "amp",
        route: "IV",
        timing: "As prescribed",
        indication: "Hepatic support",
        rationale: "Supportive hepatic protection",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIB"
      },
      {
        name: "Vitamin B1 (Thiamine)",
        category: "Vitamin",
        class: "Water-soluble vitamin",
        dosage: "100",
        unit: "mg",
        route: "IV",
        timing: "Before/after chemotherapy",
        indication: "Vitamin supplementation",
        rationale: "Thiamine repletion",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIIA"
      },
      {
        name: "Vitamin B6 (Pyridoxine)",
        category: "Vitamin",
        class: "Water-soluble vitamin",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "As prescribed",
        indication: "Vitamin supplementation",
        rationale: "Pyridoxine supplementation",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIIA"
      },
      {
        name: "Vitamin C (Ascorbic Acid)",
        category: "Vitamin",
        class: "Antioxidant",
        dosage: "1-2",
        unit: "g",
        route: "IV",
        timing: "As prescribed",
        indication: "Vitamin supplementation",
        rationale: "Antioxidant support",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIIA"
      },
      {
        name: "Solu-Vit",
        category: "Multivitamin",
        class: "Parenteral Multivitamin",
        dosage: "1",
        unit: "vial",
        route: "IV",
        timing: "Added to infusion as prescribed",
        indication: "Multivitamin support",
        rationale: "Parenteral multivitamin preparation",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IIB"
      }
    ]
  }
];

export const UnifiedProtocolSelector = ({
  drugNames,
  drugs,
  emetogenicRiskLevel,
  selectedPremedications,
  selectedAntiemetics,
  onPremedSelectionsChange,
  onAntiemeticProtocolChange,
  weight
}: UnifiedProtocolSelectorProps) => {
  const [selectedAgents, setSelectedAgents] = useState<PremedAgent[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["cinv"]);
  const [solventSelections, setSolventSelections] = useState<Record<string, string>>({});
  const { t } = useTranslation();

  // Notify parent component when selected agents change
  useEffect(() => {
    onAntiemeticProtocolChange(selectedAgents);
  }, [selectedAgents, onAntiemeticProtocolChange]);

  // Get recommendations based on drugs and emetogenic risk
  const recommendations = useMemo(() => {
    const recs: PremedAgent[] = [];
    
    premedCategories.forEach(category => {
      category.agents.forEach(agent => {
        // Check if agent is recommended for current drugs
        const isRecommendedForDrugs = !agent.drugSpecific || 
          agent.drugSpecific.some(drug => 
            drugNames.some(drugName => 
              drugName.toLowerCase().includes(drug.toLowerCase()) ||
              drug.toLowerCase().includes(drugName.toLowerCase())
            )
          );

        // Check emetogenic risk requirements
        const isRecommendedForRisk = 
          (category.id === "cinv" && (emetogenicRiskLevel === "high" || emetogenicRiskLevel === "moderate")) ||
          category.id !== "cinv";

        if (isRecommendedForDrugs && isRecommendedForRisk) {
          recs.push(agent);
        }
      });
    });

    return recs;
  }, [drugNames, emetogenicRiskLevel]);

  const handleAgentToggle = (agent: PremedAgent, isSelected: boolean) => {
    if (isSelected) {
      const agentWithSolvent = { ...agent, solvent: solventSelections[agent.name] };
      setSelectedAgents(prev => [...prev, agentWithSolvent]);
    } else {
      setSelectedAgents(prev => prev.filter(a => a.name !== agent.name));
    }
  };

  const handleSolventChange = (agentName: string, solvent: string) => {
    const newSolventSelections = {
      ...solventSelections,
      [agentName]: solvent
    };
    setSolventSelections(newSolventSelections);

    // Update the selected agents with solvent
    setSelectedAgents(prev => 
      prev.map(agent => 
        agent.name === agentName 
          ? { ...agent, solvent: solvent || undefined }
          : agent
      )
    );
  };

  const applyRecommendations = () => {
    setSelectedAgents(recommendations);
  };

  const clearSelections = () => {
    setSelectedAgents([]);
    setSolventSelections({});
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            {t('unifiedSelector.title')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearSelections}>
              {t('premedSelector.clearAll')}
            </Button>
          </div>
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {drugNames.map(drug => (
            <Badge key={drug} variant="outline" className="text-xs">
              {drug}
            </Badge>
          ))}
          <Badge variant="secondary" className="text-xs">
            {t('unifiedSelector.riskBadge', { level: emetogenicRiskLevel.toUpperCase() })}
          </Badge>
          <Badge variant="default" className="text-xs">
            {t('unifiedSelector.selectedCount', { count: selectedAgents.length })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">{t('unifiedSelector.tabs.recommendations')}</TabsTrigger>
            <TabsTrigger value="categories">{t('unifiedSelector.tabs.categories')}</TabsTrigger>
            <TabsTrigger value="solvents">{t('unifiedSelector.tabs.solvents')}</TabsTrigger>
            <TabsTrigger value="selected">{t('unifiedSelector.tabs.selected')}</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('unifiedSelector.recommendationsDesc', { drugs: drugNames.join(", "), risk: emetogenicRiskLevel })}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 mb-4">
              <Button onClick={applyRecommendations} className="flex-1">
                {t('unifiedSelector.applyAll', { count: recommendations.length })}
              </Button>
            </div>

            <div className="grid gap-3">
              {recommendations.map((agent, idx) => {
                const isSelected = selectedAgents.some(a => a.name === agent.name);
                const category = premedCategories.find(cat => 
                  cat.agents.some(a => a.name === agent.name)
                );
                
                return (
                  <Card key={idx} className={`border-2 transition-all ${
                    isSelected ? "border-primary bg-primary/5" : "border-muted"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleAgentToggle(agent, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{agent.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {agent.category}
                            </Badge>
                            {agent.evidenceLevel && (
                              <Badge variant="secondary" className="text-xs">
                                {agent.evidenceLevel}
                              </Badge>
                            )}
                            {agent.isRequired && (
                              <Badge variant="destructive" className="text-xs">
                                {t('premedSelector.required')}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            <p><strong>{t('clinicalSheet.dose')}:</strong> {agent.dosage} {agent.unit} {agent.route}</p>
                            <p><strong>{t('printableProtocol.timing')}:</strong> {agent.timing}</p>
                            <p><strong>{t('clinicalSheet.indication')}:</strong> {agent.indication}</p>
                            <p className="text-muted-foreground">{agent.rationale}</p>
                            {agent.notes && (
                              <p className="text-xs text-orange-600 font-medium">{agent.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {premedCategories.map(category => {
              const Icon = category.icon;
              const isExpanded = expandedCategories.includes(category.id);
              
              return (
                <Card key={category.id} className="border">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${category.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-lg">{t(`unifiedSelector.categories.${category.id}.name`, { defaultValue: category.name })}</h3>
                          <p className="text-sm text-muted-foreground font-normal">
                            {t(`unifiedSelector.categories.${category.id}.description`, { defaultValue: category.description })}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`} />
                    </CardTitle>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-3">
                      {category.agents.map((agent, idx) => {
                        const isSelected = selectedAgents.some(a => a.name === agent.name);
                        
                        return (
                          <Card key={idx} className={`border ${
                            isSelected ? "border-primary bg-primary/5" : "border-muted"
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => handleAgentToggle(agent, checked as boolean)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{agent.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {agent.class}
                                    </Badge>
                                    {agent.evidenceLevel && (
                                      <Badge variant="secondary" className="text-xs">
                                        {agent.evidenceLevel}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <p><strong>{t('clinicalSheet.dose')}:</strong> {agent.dosage} {agent.unit} {agent.route}</p>
                                    <p><strong>{t('printableProtocol.timing')}:</strong> {agent.timing}</p>
                                    <p><strong>{t('clinicalSheet.indication')}:</strong> {agent.indication}</p>
                                    <p className="text-muted-foreground">{agent.rationale}</p>
                                    {agent.drugSpecific && (
                                      <p className="text-xs"><strong>{t('unifiedSelector.specificFor')}:</strong> {agent.drugSpecific.join(", ")}</p>
                                    )}
                                    {agent.notes && (
                                      <p className="text-xs text-orange-600 font-medium">{agent.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="solvents" className="space-y-4">
            {selectedAgents.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {t('unifiedSelector.noAgentsForSolvents')}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('unifiedSelector.selectSolventDesc')}
                </p>
                
                {selectedAgents.map((agent, idx) => (
                  <Card key={idx} className="border border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold">{agent.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {agent.dosage} {agent.unit} {agent.route}
                            </p>
                          </div>
                        </div>
                        
                        <div className="min-w-[200px]">
                          <Label className="text-muted-foreground font-semibold text-sm">
                            {t('unifiedSelector.solvent')}
                          </Label>
                          <Select 
                            value={solventSelections[agent.name] || ''} 
                            onValueChange={(value) => handleSolventChange(agent.name, value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={t('doseCalculator.selectSolvent')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Normal Saline 0.9%">{t('doseCalculator.solvents.normalSaline')}</SelectItem>
                              <SelectItem value="Dextrose 5%">{t('doseCalculator.solvents.dextrose5')}</SelectItem>
                              <SelectItem value="Ringer Solution">{t('doseCalculator.solvents.ringer')}</SelectItem>
                              <SelectItem value="Water for Injection">{t('doseCalculator.solvents.waterForInjection')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="selected" className="space-y-4">
            {selectedAgents.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {t('unifiedSelector.emptySelected')}
                </AlertDescription>
              </Alert>
            ) : (
              <>
              <Alert className="mb-4">
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  {t('unifiedSelector.selectedHeader', { drugs: drugNames.join(", "), count: selectedAgents.length })}
                </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {premedCategories.map(category => {
                    const categoryAgents = selectedAgents.filter(agent => 
                      category.agents.some(catAgent => catAgent.name === agent.name)
                    );

                    if (categoryAgents.length === 0) return null;

                    const Icon = category.icon;

                    return (
                      <Card key={category.id} className="border">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <div className={`p-2 rounded ${category.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            {t(`unifiedSelector.categories.${category.id}.name`, { defaultValue: category.name })} ({categoryAgents.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {categoryAgents.map((agent, idx) => (
                            <div key={idx} className="border rounded p-3 bg-muted/30">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{agent.name}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAgentToggle(agent, false)}
                                  className="h-6 w-6 p-0"
                                >
                                  ×
                                </Button>
                              </div>
                              <div className="text-sm space-y-1">
                                <p><strong>{t('clinicalSheet.dose')}:</strong> {agent.dosage} {agent.unit} {agent.route}</p>
                                <p><strong>{t('printableProtocol.timing')}:</strong> {agent.timing}</p>
                                <p><strong>{t('clinicalSheet.indication')}:</strong> {agent.indication}</p>
                                {agent.notes && (
                                  <p className="text-xs text-orange-600 font-medium">{agent.notes}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};