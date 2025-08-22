import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Clock, Shield, AlertTriangle, BookOpen, Pill } from "lucide-react";
import { 
  getRecommendedAntiemeticProtocols, 
  allAntiemeticProtocols,
  standardAntiemeticAgents 
} from "@/data/antiemeticProtocols";
import { AntiemeticProtocol, AntiemeticAgent } from "@/types/emetogenicRisk";
import { Drug } from "@/types/regimens";
import { useTSafe } from '@/i18n/tSafe';

interface AntiemeticProtocolSelectorProps {
  drugs: Drug[];
  riskLevel: "high" | "moderate" | "low" | "minimal";
  onProtocolChange?: (selectedAgents: AntiemeticAgent[]) => void;
}

export const AntiemeticProtocolSelector: React.FC<AntiemeticProtocolSelectorProps> = ({
  drugs,
  riskLevel,
  onProtocolChange
}) => {
  const tSafe = useTSafe();
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [selectedIndividualAgents, setSelectedIndividualAgents] = useState<string[]>([]);
  const [customizationMode, setCustomizationMode] = useState<"protocol" | "individual">("protocol");

  const recommendedProtocols = useMemo(() => {
    const drugNames = drugs.map(d => d.name);
    return getRecommendedAntiemeticProtocols(drugNames);
  }, [drugs]);

  const protocolsByRisk = useMemo(() => {
    return allAntiemeticProtocols.filter(p => p.riskLevel === riskLevel);
  }, [riskLevel]);

  const selectedAgents = useMemo(() => {
    if (customizationMode === "protocol" && selectedProtocol) {
      const protocol = allAntiemeticProtocols.find(p => p.id === selectedProtocol);
      return protocol?.agents || [];
    } else {
      return selectedIndividualAgents.map(agentKey => standardAntiemeticAgents[agentKey]).filter(Boolean);
    }
  }, [customizationMode, selectedProtocol, selectedIndividualAgents]);

  React.useEffect(() => {
    onProtocolChange?.(selectedAgents);
  }, [selectedAgents, onProtocolChange]);

  const getEvidenceBadge = (level: string) => {
    const colors = {
      "IA": "bg-green-100 text-green-800",
      "IB": "bg-green-100 text-green-700", 
      "IC": "bg-blue-100 text-blue-800",
      "IIA": "bg-yellow-100 text-yellow-800",
      "IIB": "bg-orange-100 text-orange-800",
      "IIIA": "bg-red-100 text-red-700",
      "IIIB": "bg-red-100 text-red-800"
    };
    return `${colors[level as keyof typeof colors] || colors["IIB"]} text-xs px-2 py-1 rounded`;
  };

  const handleProtocolSelect = (protocolId: string) => {
    setSelectedProtocol(protocolId);
    setCustomizationMode("protocol");
  };

  const handleIndividualAgentToggle = (agentKey: string) => {
    setSelectedIndividualAgents(prev => 
      prev.includes(agentKey)
        ? prev.filter(key => key !== agentKey)
        : [...prev, agentKey]
    );
    setCustomizationMode("individual");
  };

  const renderProtocolCard = (protocol: AntiemeticProtocol, isRecommended = false) => (
    <Card 
      key={protocol.id} 
      className={`cursor-pointer transition-all ${
        selectedProtocol === protocol.id 
          ? 'ring-2 ring-primary' 
          : 'hover:shadow-md'
      } ${isRecommended ? 'border-primary' : ''}`}
      onClick={() => handleProtocolSelect(protocol.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              {isRecommended && <Shield className="h-4 w-4 text-primary" />}
              {protocol.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {protocol.indication.join(", ")}
            </CardDescription>
          </div>
          <Badge variant={selectedProtocol === protocol.id ? "default" : "outline"} className="text-xs">
            {protocol.riskLevel.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agents Summary */}
        <div>
          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Pill className="h-3 w-3" />
            {tSafe('antiemeticSelector.agentsLabel', `Agents (${protocol.agents.length})`, { count: protocol.agents.length })}
          </h5>
          <div className="flex flex-wrap gap-1">
            {protocol.agents.map((agent, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {agent.name} {agent.dosage}{agent.unit}
              </Badge>
            ))}
          </div>
        </div>

        {/* Management Summary */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto font-normal">
              <span className="text-sm">{tSafe('antiemeticSelector.viewDetails', 'View Clinical Details')}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div>
              <h6 className="font-medium text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tSafe('antiemeticSelector.acuteManagement', 'Acute Management')}
              </h6>
              <p className="text-xs">{protocol.acuteManagement}</p>
            </div>
            <div>
              <h6 className="font-medium text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tSafe('antiemeticSelector.delayedManagement', 'Delayed Management')}
              </h6>
              <p className="text-xs">{protocol.delayedManagement}</p>
            </div>
            <div>
              <h6 className="font-medium text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {tSafe('antiemeticSelector.rationale', 'Rationale')}
              </h6>
              <p className="text-xs">{protocol.clinicalRationale}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                <strong>{tSafe('antiemeticSelector.guidelinesLabel', 'Guidelines:')}</strong> {protocol.guidelines.join(", ")}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );

  const renderAgentCard = (agentKey: string, agent: AntiemeticAgent) => (
    <Card 
      key={agentKey}
      className={`cursor-pointer transition-all ${
        selectedIndividualAgents.includes(agentKey) 
          ? 'ring-2 ring-primary' 
          : 'hover:shadow-sm'
      }`}
      onClick={() => handleIndividualAgentToggle(agentKey)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selectedIndividualAgents.includes(agentKey)}
                onChange={() => {}}
              />
              <h5 className="font-medium text-sm">{agent.name}</h5>
            </div>
            <p className="text-xs text-muted-foreground">{agent.class}</p>
          </div>
          <span className={getEvidenceBadge(agent.evidenceLevel)}>
            {agent.evidenceLevel}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">{tSafe('clinicalSheet.dose', 'Dose')}:</span> {agent.dosage} {agent.unit}
            </div>
            <div>
              <span className="font-medium">{tSafe('printableProtocol.route', 'Route')}:</span> {agent.route}
            </div>
            <div>
              <span className="font-medium">{tSafe('printableProtocol.timing', 'Timing')}:</span> {agent.timing}
            </div>
            <div>
              <span className="font-medium">{tSafe('clinicalSheet.indication', 'Indication')}:</span> {agent.indication}
            </div>
          </div>
          
          {agent.duration && (
            <div>
              <span className="font-medium">{tSafe('printableProtocol.duration', 'Duration')}:</span> {agent.duration}
            </div>
          )}
          
          <div>
            <span className="font-medium">{tSafe('antiemeticSelector.mechanismLabel', 'Mechanism:')}</span> {agent.mechanism}
          </div>
          
          {agent.notes && (
            <div className="mt-2 p-2 bg-muted rounded text-xs">
              <strong>{tSafe('antiemeticSelector.noteLabel', 'Note:')}</strong> {agent.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader>
<CardTitle className="flex items-center gap-2">
  <Shield className="h-5 w-5" />
  {tSafe('antiemeticSelector.title', 'Antiemetic Protocol Selection')}
</CardTitle>
<CardDescription>
  {tSafe('antiemeticSelector.description', `Evidence-based antiemetic prophylaxis for ${riskLevel} emetogenic risk regimens`, { riskLevel })}
</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommended" className="space-y-4">
<TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="recommended">{tSafe('antiemeticSelector.tabs.recommended', 'Recommended')}</TabsTrigger>
  <TabsTrigger value="all-protocols">{tSafe('antiemeticSelector.tabs.all', 'All Protocols')}</TabsTrigger>
  <TabsTrigger value="individual">{tSafe('antiemeticSelector.tabs.individual', 'Individual Agents')}</TabsTrigger>
</TabsList>

          <TabsContent value="recommended" className="space-y-4">
            {recommendedProtocols.length > 0 ? (
              <>
<Alert>
  <AlertTriangle className="h-4 w-4" />
  <AlertDescription>
    {tSafe('antiemeticSelector.alerts.recommended', 'Protocols specifically recommended for your current regimen based on evidence-based guidelines.')}
  </AlertDescription>
</Alert>
                <div className="grid gap-4">
                  {recommendedProtocols.map(protocol => renderProtocolCard(protocol, true))}
                </div>
              </>
            ) : (
<Alert>
  <AlertDescription>
    {tSafe('antiemeticSelector.alerts.none', 'No specific protocols recommended for this combination. Please review all protocols or select individual agents.')}
  </AlertDescription>
</Alert>
            )}
          </TabsContent>

          <TabsContent value="all-protocols" className="space-y-4">
            <div className="grid gap-4">
              {protocolsByRisk.map(protocol => renderProtocolCard(protocol))}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
<Alert>
  <AlertDescription>
    {tSafe('antiemeticSelector.individualHelper', 'Select individual antiemetic agents to create a custom protocol. Evidence levels: IA (highest), IB, IC, IIA, IIB, IIIA, IIIB (lowest).')}
  </AlertDescription>
</Alert>
            <div className="grid gap-3">
              {Object.entries(standardAntiemeticAgents).map(([key, agent]) => 
                renderAgentCard(key, agent)
              )}
            </div>
          </TabsContent>
        </Tabs>

        {selectedAgents.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h4 className="font-semibold mb-3">{tSafe('antiemeticSelector.summaryTitle', 'Selected Antiemetic Protocol Summary')}</h4>
              <div className="space-y-2">
                {selectedAgents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {agent.dosage} {agent.unit} {agent.route} - {agent.timing}
                        {agent.duration && ` (${agent.duration})`}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {agent.indication}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};