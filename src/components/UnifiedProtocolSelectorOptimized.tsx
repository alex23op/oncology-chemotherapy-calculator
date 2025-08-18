import React, { useState, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Droplet, 
  Heart, 
  Pill,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Regimen, Premedication } from '@/types/regimens';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { ErrorBoundary } from './ErrorBoundary';

// Enhanced premedication agent structure
interface EnhancedPremedAgent {
  name: string;
  category: string;
  class: string;
  dosage: string;
  unit: string;
  route: string;
  timing: string;
  indication: string;
  rationale?: string;
  isRequired: boolean;
  isStandard: boolean;
  administrationDuration?: string;
  weightBased?: boolean;
  notes?: string;
  evidenceLevel?: string;
  drugSpecific?: string[];
  solvent: string | null;
  customDosage?: string;
  isSelected?: boolean;
}

interface UnifiedProtocolSelectorProps {
  regimen: Regimen | null;
  onProtocolChange?: (protocol: {
    selectedPremedications: EnhancedPremedAgent[];
    customInstructions: string;
    antiemeticProtocol: string;
  }) => void;
  className?: string;
}

// Memoized premedication protocols
const PREMEDICATION_PROTOCOLS = {
  antiemetic: {
    id: "antiemetic",
    name: "Antiemetic Therapy",
    description: "Prevention and management of chemotherapy-induced nausea and vomiting",
    icon: Shield,
    color: "bg-green-50 border-green-200 text-green-800",
    agents: [
      {
        name: "Ondansetron",
        category: "5-HT3 Antagonist",
        class: "Serotonin Receptor Antagonist",
        dosage: "8",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        indication: "Prevention of acute CINV",
        rationale: "Blocks serotonin receptors in chemoreceptor trigger zone",
        isRequired: true,
        isStandard: true,
        administrationDuration: "2-5 minutes",
        evidenceLevel: "IA",
        solvent: "NS 50mL"
      },
      {
        name: "Granisetron",
        category: "5-HT3 Antagonist", 
        class: "Serotonin Receptor Antagonist",
        dosage: "1",
        unit: "mg",
        route: "IV",
        timing: "30 minutes before chemotherapy",
        indication: "Prevention of acute CINV (alternative to ondansetron)",
        rationale: "Longer half-life than ondansetron, effective for delayed emesis",
        isRequired: false,
        isStandard: true,
        administrationDuration: "2-5 minutes",
        evidenceLevel: "IA",
        solvent: "NS 50mL"
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
        solvent: "NS 50mL"
      },
      {
        name: "Aprepitant",
        category: "NK1 Antagonist",
        class: "Neurokinin Receptor Antagonist",
        dosage: "125",
        unit: "mg",
        route: "PO",
        timing: "1 hour before chemotherapy (Day 1), then 80mg PO daily x 2 days",
        indication: "Highly emetogenic regimens (HEC)",
        rationale: "Prevents both acute and delayed CINV, especially for highly emetogenic drugs",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["cisplatin", "doxorubicin", "cyclophosphamide"],
        solvent: null
      }
    ] as EnhancedPremedAgent[]
  },
  infusionReaction: {
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
        solvent: "NS 50mL"
      },
      {
        name: "Ranitidine",
        category: "H2 Blocker",
        class: "Histamine-2 Receptor Antagonist",
        dosage: "50",
        unit: "mg",
        route: "IV",
        timing: "30-60 minutes before chemotherapy",
        indication: "Additional histamine blockade",
        rationale: "Dual histamine receptor blockade for enhanced protection",
        isRequired: false,
        isStandard: true,
        evidenceLevel: "IIA",
        drugSpecific: ["paclitaxel", "docetaxel"],
        solvent: "NS 50mL"
      },
      {
        name: "Dexamethasone",
        category: "Corticosteroid",
        class: "Anti-inflammatory",
        dosage: "20",
        unit: "mg",
        route: "IV",
        timing: "30-60 minutes before chemotherapy",
        indication: "Anti-inflammatory, reaction prevention",
        rationale: "Reduces inflammatory component of hypersensitivity reactions",
        isRequired: true,
        isStandard: true,
        evidenceLevel: "IA",
        drugSpecific: ["paclitaxel", "docetaxel"],
        solvent: "NS 50mL"
      }
    ] as EnhancedPremedAgent[]
  },
  cholinergic: {
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
        solvent: "NS 10mL"
      }
    ] as EnhancedPremedAgent[]
  }
};

// Memoized premedication card component
const PremedCard = memo<{
  agent: EnhancedPremedAgent;
  isSelected: boolean;
  onSelect: (agent: EnhancedPremedAgent, selected: boolean) => void;
  onDosageChange: (agent: EnhancedPremedAgent, dosage: string) => void;
  t: any;
}>(({ agent, isSelected, onSelect, onDosageChange, t }) => {
  const handleSelectionChange = useCallback((checked: boolean) => {
    onSelect(agent, checked);
  }, [agent, onSelect]);

  const handleDosageChange = useCallback((value: string) => {
    onDosageChange(agent, value);
  }, [agent, onDosageChange]);

  const getEvidenceBadge = (level?: string) => {
    switch (level) {
      case "IA": return <Badge variant="default" className="text-xs">IA</Badge>;
      case "IIA": return <Badge variant="secondary" className="text-xs">IIA</Badge>;
      default: return null;
    }
  };

  return (
    <div className={`p-3 border rounded-lg transition-all ${
      isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
    }`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectionChange}
          className="mt-1"
          aria-label={`Select ${agent.name}`}
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{agent.name}</h4>
              {agent.isRequired && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
              {agent.evidenceLevel && getEvidenceBadge(agent.evidenceLevel)}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p><strong>Class:</strong> {agent.class}</p>
            <p><strong>Indication:</strong> {agent.indication}</p>
            {agent.rationale && (
              <p><strong>Rationale:</strong> {agent.rationale}</p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <Label className="text-xs font-medium">Dosage</Label>
              {isSelected ? (
                <Input
                  value={agent.customDosage || agent.dosage}
                  onChange={(e) => handleDosageChange(e.target.value)}
                  className="h-7 text-xs"
                  placeholder={agent.dosage}
                />
              ) : (
                <p className="font-medium">{agent.dosage} {agent.unit}</p>
              )}
            </div>
            <div>
              <Label className="text-xs font-medium">Route</Label>
              <p className="font-medium">{agent.route}</p>
            </div>
            <div>
              <Label className="text-xs font-medium">Timing</Label>
              <p className="font-medium text-xs">{agent.timing}</p>
            </div>
            <div>
              <Label className="text-xs font-medium">Duration</Label>
              <p className="font-medium">{agent.administrationDuration || 'N/A'}</p>
            </div>
          </div>

          {agent.solvent && (
            <div className="text-xs">
              <Label className="text-xs font-medium">Solvent</Label>
              <p className="font-medium">{agent.solvent}</p>
            </div>
          )}

          {agent.notes && (
            <Alert className="py-2">
              <AlertTriangle className="h-3 w-3" />
              <AlertDescription className="text-xs">{agent.notes}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
});

PremedCard.displayName = 'PremedCard';

const UnifiedProtocolSelectorCore: React.FC<UnifiedProtocolSelectorProps> = ({
  regimen,
  onProtocolChange,
  className
}) => {
  const { t } = useTranslation();
  const [selectedPremedications, setSelectedPremedications] = useState<EnhancedPremedAgent[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);

  // Memoized filtered agents based on regimen and search
  const filteredAgents = useMemo(() => {
    if (!regimen) return [];

    const regimenDrugs = regimen.drugs.map(drug => drug.name.toLowerCase());
    let allAgents: EnhancedPremedAgent[] = [];

    // Collect agents from all protocols
    Object.values(PREMEDICATION_PROTOCOLS).forEach(protocol => {
      allAgents.push(...protocol.agents);
    });

    // Filter by drug-specific requirements
    let relevantAgents = allAgents.filter(agent => {
      if (!agent.drugSpecific) return true;
      return agent.drugSpecific.some(drug => 
        regimenDrugs.some(regimenDrug => regimenDrug.includes(drug.toLowerCase()))
      );
    });

    // Filter by search term
    if (searchTerm) {
      relevantAgents = relevantAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.indication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      relevantAgents = relevantAgents.filter(agent =>
        agent.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return relevantAgents;
  }, [regimen, searchTerm, selectedCategory]);

  // Memoized protocol change handler
  const handleProtocolChange = useCallback(() => {
    onProtocolChange?.({
      selectedPremedications,
      customInstructions,
      antiemeticProtocol: selectedPremedications
        .filter(agent => agent.category.includes('5-HT3') || agent.category.includes('NK1'))
        .map(agent => agent.name)
        .join(' + ')
    });
  }, [selectedPremedications, customInstructions, onProtocolChange]);

  // Update protocol when selections change
  React.useEffect(() => {
    handleProtocolChange();
  }, [handleProtocolChange]);

  const handleAgentSelection = useCallback((agent: EnhancedPremedAgent, selected: boolean) => {
    setSelectedPremedications(prev => {
      if (selected) {
        const updatedAgent = { ...agent, isSelected: true };
        return [...prev.filter(a => a.name !== agent.name), updatedAgent];
      } else {
        return prev.filter(a => a.name !== agent.name);
      }
    });

    logger.info('Premedication selection changed', {
      agent: agent.name,
      selected,
      regimen: regimen?.name
    });
  }, [regimen]);

  const handleDosageChange = useCallback((agent: EnhancedPremedAgent, dosage: string) => {
    setSelectedPremedications(prev =>
      prev.map(a => a.name === agent.name ? { ...a, customDosage: dosage } : a)
    );
  }, []);

  const getSelectedCount = useMemo(() => selectedPremedications.length, [selectedPremedications]);

  const exportProtocol = useCallback(() => {
    const protocolData = {
      regimen: regimen?.name,
      selectedPremedications,
      customInstructions,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(protocolData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol-${regimen?.name || 'unknown'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Protocol exported successfully');
  }, [regimen, selectedPremedications, customInstructions]);

  if (!regimen) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          {t('protocolSelector.noRegimenSelected')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            {t('protocolSelector.title')} - {regimen.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {getSelectedCount} selected
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportProtocol}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search premedications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="antiemetic">Antiemetic</SelectItem>
              <SelectItem value="antihistamine">Antihistamine</SelectItem>
              <SelectItem value="corticosteroid">Corticosteroid</SelectItem>
              <SelectItem value="anticholinergic">Anticholinergic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Protocol Preview */}
        {showPreview && selectedPremedications.length > 0 && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-sm">Protocol Preview</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedPremedications.map((agent, index) => (
                <div key={agent.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-muted-foreground">
                    {agent.customDosage || agent.dosage} {agent.unit} {agent.route}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Premedication Categories */}
        <Tabs defaultValue="antiemetic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="antiemetic">Antiemetic</TabsTrigger>
            <TabsTrigger value="infusion">Infusion Reaction</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="antiemetic" className="mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                Antiemetic Therapy
              </h3>
              <div className="space-y-2">
                {PREMEDICATION_PROTOCOLS.antiemetic.agents.map((agent) => (
                  <PremedCard
                    key={agent.name}
                    agent={agent}
                    isSelected={selectedPremedications.some(a => a.name === agent.name)}
                    onSelect={handleAgentSelection}
                    onDosageChange={handleDosageChange}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="infusion" className="mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Infusion Reaction Prophylaxis
              </h3>
              <div className="space-y-2">
                {PREMEDICATION_PROTOCOLS.infusionReaction.agents.map((agent) => (
                  <PremedCard
                    key={agent.name}
                    agent={agent}
                    isSelected={selectedPremedications.some(a => a.name === agent.name)}
                    onSelect={handleAgentSelection}
                    onDosageChange={handleDosageChange}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Pill className="h-4 w-4 text-blue-600" />
                Other Premedications
              </h3>
              <div className="space-y-2">
                {PREMEDICATION_PROTOCOLS.cholinergic.agents.map((agent) => (
                  <PremedCard
                    key={agent.name}
                    agent={agent}
                    isSelected={selectedPremedications.some(a => a.name === agent.name)}
                    onSelect={handleAgentSelection}
                    onDosageChange={handleDosageChange}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Custom Instructions */}
        <div>
          <Label htmlFor="custom-instructions" className="text-sm font-medium">
            Custom Instructions
          </Label>
          <Textarea
            id="custom-instructions"
            placeholder="Add any special instructions or modifications to the protocol..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Summary */}
        {selectedPremedications.length > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Protocol Summary:</strong> {selectedPremedications.length} premedication(s) selected.
              {selectedPremedications.some(a => a.isRequired) && (
                <span className="text-destructive"> Includes required medications.</span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export const UnifiedProtocolSelectorOptimized: React.FC<UnifiedProtocolSelectorProps> = (props) => {
  return (
    <ErrorBoundary>
      <UnifiedProtocolSelectorCore {...props} />
    </ErrorBoundary>
  );
};