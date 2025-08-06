import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Clock, Pill, ChevronDown, BookOpen, Edit, Heart, Activity, Zap, Droplet, Users, FileText, Download, Printer } from "lucide-react";
import { Drug } from "@/types/regimens";
import { PrintableProtocol } from "@/components/PrintableProtocol";
import { usePrint } from "@/hooks/usePrint";
import { generateProtocolPDF } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";

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
  const { componentRef, printProtocol } = usePrint();
  const { toast } = useToast();

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
      setSelectedAgents(prev => [...prev, agent]);
    } else {
      setSelectedAgents(prev => prev.filter(a => a.name !== agent.name));
    }
  };

  const applyRecommendations = () => {
    setSelectedAgents(recommendations);
  };

  const clearSelections = () => {
    setSelectedAgents([]);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExportPDF = async () => {
    try {
      const protocolData = {
        selectedAgents,
        regimenName: drugNames.join(', '),
        patientWeight: weight,
        emetogenicRisk: emetogenicRiskLevel
      };
      
      await generateProtocolPDF(protocolData, 'printable-protocol');
      toast({
        title: "PDF Export Successful",
        description: "Your premedication protocol has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    try {
      printProtocol();
      toast({
        title: "Print Initiated",
        description: "Your browser's print dialog should open shortly.",
      });
    } catch (error) {
      console.error('Print failed:', error);
      toast({
        title: "Print Failed",
        description: "Unable to print protocol. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            Premedication & Supportive Care Protocol
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportPDF}
              disabled={selectedAgents.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              disabled={selectedAgents.length === 0}
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelections}>
              Clear All
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
            {emetogenicRiskLevel.toUpperCase()} Risk
          </Badge>
          <Badge variant="default" className="text-xs">
            {selectedAgents.length} Selected
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="categories">All Categories</TabsTrigger>
            <TabsTrigger value="selected">Selected Protocol</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Evidence-based recommendations for {drugNames.join(", ")} with {emetogenicRiskLevel} emetogenic risk.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 mb-4">
              <Button onClick={applyRecommendations} className="flex-1">
                Apply All Recommendations ({recommendations.length})
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
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            <p><strong>Dose:</strong> {agent.dosage} {agent.unit} {agent.route}</p>
                            <p><strong>Timing:</strong> {agent.timing}</p>
                            <p><strong>Indication:</strong> {agent.indication}</p>
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
                          <h3 className="text-lg">{category.name}</h3>
                          <p className="text-sm text-muted-foreground font-normal">
                            {category.description}
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
                                    <p><strong>Dose:</strong> {agent.dosage} {agent.unit} {agent.route}</p>
                                    <p><strong>Timing:</strong> {agent.timing}</p>
                                    <p><strong>Indication:</strong> {agent.indication}</p>
                                    <p className="text-muted-foreground">{agent.rationale}</p>
                                    {agent.drugSpecific && (
                                      <p className="text-xs"><strong>Specific for:</strong> {agent.drugSpecific.join(", ")}</p>
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

          <TabsContent value="selected" className="space-y-4">
            {/* Hidden printable version */}
            <div className="hidden">
              <div id="printable-protocol">
                <PrintableProtocol
                  ref={componentRef}
                  selectedAgents={selectedAgents}
                  regimenName={drugNames.join(', ')}
                  patientWeight={weight}
                  emetogenicRisk={emetogenicRiskLevel}
                  className="w-full"
                />
              </div>
            </div>
            
            {selectedAgents.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No agents selected. Choose from recommendations or browse categories to build your protocol.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <Alert className="flex-1 mr-4">
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Selected protocol for {drugNames.join(", ")} - {selectedAgents.length} agents
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleExportPDF}
                      disabled={selectedAgents.length === 0}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrint}
                      disabled={selectedAgents.length === 0}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>

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
                            {category.name} ({categoryAgents.length})
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
                                <p><strong>Dose:</strong> {agent.dosage} {agent.unit} {agent.route}</p>
                                <p><strong>Timing:</strong> {agent.timing}</p>
                                <p><strong>Indication:</strong> {agent.indication}</p>
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