import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle, Pill, Shield, Heart, Activity, Droplet, Beaker, ShoppingCart, User, X, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AVAILABLE_SOLVENTS, SolventType } from '@/types/solvents';
import type { PremedAgent, PremedSolventGroup, GroupedPremedications } from '@/types/clinicalTreatment';
import { SolventGroupManager } from './SolventGroupManager';

interface UnifiedProtocolSelectorProps {
  drugNames: string[];
  emetogenicRisk: "high" | "moderate" | "low" | "minimal";
  selectedAgents?: LocalPremedAgent[];
  onSelectionChange?: (agents: LocalPremedAgent[]) => void;
  onGroupingChange?: (groupedPremedications: GroupedPremedications) => void;
  patientWeight?: number;
}

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
        dosage: "12",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        indication: "CINV prevention, antiemetic potentiation",
        rationale: "Synergistic antiemetic effect, reduces delayed emesis",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
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
        drugSpecific: ["paclitaxel", "docetaxel"],
        solvent: null
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
    name: "Electrolyte & Metabolic Support",
    description: "Electrolyte replacement and metabolic support agents",
    icon: Beaker,
    color: "bg-cyan-50 border-cyan-200 text-cyan-800",
    agents: [
      {
        name: "Magnesium Sulfate",
        category: "Electrolyte Replacement",
        class: "Mineral Supplement",
        dosage: "1-2",
        unit: "g",
        route: "IV",
        timing: "Pre- and post-platinum therapy",
        indication: "Hypomagnesemia prevention/treatment",
        rationale: "Prevents platinum-induced hypomagnesemia and associated symptoms",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIA",
        notes: "Monitor serum Mg levels",
        solvent: null
      },
      {
        name: "Leucovorin",
        category: "Folate Analog",
        class: "Antidote/Rescue Agent",
        dosage: "20",
        unit: "mg/m²",
        route: "IV",
        timing: "24 hours after methotrexate",
        indication: "Methotrexate rescue",
        rationale: "Bypasses methotrexate-induced folate antagonism",
        isRequired: false,
        isStandard: false,
        evidenceLevel: "IA",
        notes: "Dose depends on MTX level and clearance",
        solvent: null
      }
    ]
  }
];

export default function UnifiedProtocolSelector({
  drugNames = [],
  emetogenicRisk,
  selectedAgents = [],
  onSelectionChange,
  onGroupingChange,
  patientWeight
}: UnifiedProtocolSelectorProps) {
  const { t } = useTranslation();
  const [localSelectedAgents, setLocalSelectedAgents] = useState<LocalPremedAgent[]>(selectedAgents);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("categories");
  const [groupedPremedications, setGroupedPremedications] = useState<GroupedPremedications>({
    groups: [],
    individual: []
  });

  // Notify parent component when selection changes
  useEffect(() => {
    onSelectionChange?.(localSelectedAgents);
  }, [localSelectedAgents, onSelectionChange]);

  // Update grouped medications when selection changes
  useEffect(() => {
    const updatedGrouped = {
      ...groupedPremedications,
      individual: localSelectedAgents.filter(agent => 
        !groupedPremedications.groups.some(group => 
          group.medications.some(med => med.name === agent.name)
        )
      )
    };
    setGroupedPremedications(updatedGrouped);
    onGroupingChange?.(updatedGrouped);
  }, [localSelectedAgents, groupedPremedications.groups, onGroupingChange]);


  const handleAgentToggle = useCallback((agent: LocalPremedAgent, isSelected: boolean) => {
    setLocalSelectedAgents(prev => {
      if (isSelected) {
        return [...prev, { ...agent, solvent: null }];
      } else {
        return prev.filter(a => a.name !== agent.name);
      }
    });
  }, []);


  const clearAllSelections = useCallback(() => {
    setLocalSelectedAgents([]);
    setGroupedPremedications({ groups: [], individual: [] });
    toast.success(t('unifiedSelector.selectionsCleared'));
  }, [t]);

  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const isAgentSelected = useCallback((agentName: string) => {
    return localSelectedAgents.some(agent => agent.name === agentName);
  }, [localSelectedAgents]);

  const validateGrouping = useCallback(() => {
    // Validation logic for PEV groups
    const errors: string[] = [];
    
    groupedPremedications.groups.forEach((group, index) => {
      if (!group.solvent) {
        errors.push(t('unifiedSelector.errors.groupNeedsSolvent', { groupNumber: index + 1 }));
      }
      if (group.medications.length === 0) {
        errors.push(t('unifiedSelector.errors.groupNeedsMedications', { groupNumber: index + 1 }));
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }
    
    return true;
  }, [groupedPremedications, t]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {t('unifiedSelector.tabs.categories')}
          </TabsTrigger>
          <TabsTrigger value="grouping" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t('unifiedSelector.tabs.grouping')}
          </TabsTrigger>
          <TabsTrigger value="selected" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('unifiedSelector.tabs.selected')} ({localSelectedAgents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {premedCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleCategoryExpansion(category.id)}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.name}
                  </div>
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              
              {expandedCategories.has(category.id) && (
                <CardContent className="space-y-3">
                  {category.agents.map((agent) => (
                    <div
                      key={agent.name}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isAgentSelected(agent.name)}
                          onCheckedChange={(checked) => 
                            handleAgentToggle(agent, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">
                            <strong>{agent.dosage} {agent.unit}</strong> {agent.route} - {agent.timing}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <em>{agent.indication}</em>
                          </div>
                          {agent.rationale && (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              <strong>{t('unifiedSelector.rationale')}:</strong> {agent.rationale}
                            </div>
                          )}
                          {agent.notes && (
                            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                              <strong>{t('unifiedSelector.notes')}:</strong> {agent.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={agent.isRequired ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {agent.isRequired ? t('unifiedSelector.required') : t('unifiedSelector.optional')}
                        </Badge>
                        {agent.evidenceLevel && (
                          <Badge variant="outline" className="text-xs">
                            {agent.evidenceLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}</TabsContent>


        <TabsContent value="grouping" className="space-y-4">
        <SolventGroupManager
          selectedAgents={localSelectedAgents}
          groupedPremedications={groupedPremedications}
          onGroupingChange={(newGrouping) => {
            setGroupedPremedications(newGrouping);
            onGroupingChange?.(newGrouping);
          }}
        />
        </TabsContent>

        <TabsContent value="selected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {t('unifiedSelector.selected.title')} ({localSelectedAgents.length})
              </CardTitle>
              <CardDescription>
                {t('unifiedSelector.selected.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {localSelectedAgents.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {t('unifiedSelector.selected.noAgents')}
                </p>
              ) : (
                <div className="space-y-3">
                  {localSelectedAgents.map((agent) => (
                    <div
                      key={agent.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {agent.dosage} {agent.unit} {agent.route} - {agent.indication}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAgentToggle(agent, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    onClick={clearAllSelections}
                    variant="outline"
                    className="w-full"
                  >
                    {t('unifiedSelector.selected.clearAll')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
