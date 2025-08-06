import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Clock, Pill, ChevronDown, BookOpen, Edit } from "lucide-react";
import { PremedProtocol, standardPremedProtocols, getRecommendedProtocols } from "@/utils/premedProtocols";
import { getRecommendedAntiemeticProtocols, allAntiemeticProtocols, standardAntiemeticAgents } from "@/data/antiemeticProtocols";
import { Premedication } from "@/types/regimens";
import { AntiemeticAgent, AntiemeticProtocol } from "@/types/emetogenicRisk";
import { Drug } from "@/types/regimens";

interface UnifiedProtocolSelectorProps {
  drugNames: string[];
  drugs: Drug[];
  emetogenicRiskLevel: "high" | "moderate" | "low" | "minimal";
  selectedPremedications: Premedication[];
  selectedAntiemetics: AntiemeticAgent[];
  onPremedSelectionsChange: (premedications: Premedication[]) => void;
  onAntiemeticProtocolChange: (agents: AntiemeticAgent[]) => void;
  weight: number;
}

interface ProtocolBundle {
  id: string;
  name: string;
  description: string;
  premedications: Premedication[];
  antiemetics: AntiemeticAgent[];
  indication: string[];
  isRecommended: boolean;
  rationale: string;
}

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
  const [selectionMode, setSelectionMode] = useState<"bundles" | "individual">("bundles");
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);

  // Get recommended protocols
  const recommendedPremedProtocols = useMemo(() => getRecommendedProtocols(drugNames), [drugNames]);
  const recommendedAntiemeticProtocols = useMemo(() => getRecommendedAntiemeticProtocols(drugNames), [drugNames]);
  
  // Create unified protocol bundles
  const protocolBundles = useMemo((): ProtocolBundle[] => {
    const bundles: ProtocolBundle[] = [];
    
    // Create bundles by combining premedication and antiemetic protocols
    recommendedPremedProtocols.forEach(premedProtocol => {
      recommendedAntiemeticProtocols.forEach(antiemeticProtocol => {
        // Check if protocols are compatible
        const isCompatible = premedProtocol.indication.some(indication => 
          antiemeticProtocol.indication.some(antiInd => 
            indication.toLowerCase().includes(antiInd.toLowerCase()) ||
            antiInd.toLowerCase().includes(indication.toLowerCase())
          )
        );
        
        if (isCompatible) {
          bundles.push({
            id: `${premedProtocol.id}_${antiemeticProtocol.id}`,
            name: `${premedProtocol.name} + ${antiemeticProtocol.name}`,
            description: `Combined protocol: ${premedProtocol.description} with ${antiemeticProtocol.acuteManagement}`,
            premedications: premedProtocol.premedications,
            antiemetics: antiemeticProtocol.agents,
            indication: [...premedProtocol.indication, ...antiemeticProtocol.indication],
            isRecommended: true,
            rationale: `${premedProtocol.description}. ${antiemeticProtocol.clinicalRationale}`
          });
        }
      });
    });

    // Add standalone antiemetic protocols for high/moderate risk
    if (emetogenicRiskLevel === "high" || emetogenicRiskLevel === "moderate") {
      const protocolsByRisk = allAntiemeticProtocols.filter(p => p.riskLevel === emetogenicRiskLevel);
      protocolsByRisk.forEach(protocol => {
        bundles.push({
          id: `antiemetic_only_${protocol.id}`,
          name: `${protocol.name} (Antiemetic Only)`,
          description: protocol.acuteManagement,
          premedications: [],
          antiemetics: protocol.agents,
          indication: protocol.indication,
          isRecommended: recommendedAntiemeticProtocols.some(rec => rec.id === protocol.id),
          rationale: protocol.clinicalRationale
        });
      });
    }

    // Add standalone premedication protocols
    recommendedPremedProtocols.forEach(protocol => {
      bundles.push({
        id: `premed_only_${protocol.id}`,
        name: `${protocol.name} (Premedication Only)`,
        description: protocol.description,
        premedications: protocol.premedications,
        antiemetics: [],
        indication: protocol.indication,
        isRecommended: true,
        rationale: protocol.description
      });
    });

    return bundles.filter((bundle, index, arr) => 
      arr.findIndex(b => b.id === bundle.id) === index
    );
  }, [recommendedPremedProtocols, recommendedAntiemeticProtocols, emetogenicRiskLevel]);

  // Group individual agents by category
  const groupedPremedications = useMemo(() => {
    return standardPremedProtocols.reduce((acc, protocol) => {
      protocol.premedications.forEach(premed => {
        if (!acc[premed.category]) {
          acc[premed.category] = [];
        }
        const exists = acc[premed.category].find(p => p.name === premed.name);
        if (!exists) {
          acc[premed.category].push(premed);
        }
      });
      return acc;
    }, {} as Record<string, Premedication[]>);
  }, []);

  const handleBundleSelect = (bundle: ProtocolBundle) => {
    setSelectedBundleId(bundle.id);
    setSelectionMode("bundles");
    
    // Apply the bundle selections
    onPremedSelectionsChange(bundle.premedications);
    onAntiemeticProtocolChange(bundle.antiemetics);
  };

  const handleIndividualPremedToggle = (premedication: Premedication, isSelected: boolean) => {
    setSelectionMode("individual");
    setSelectedBundleId(null);
    
    let newSelections = [...selectedPremedications];
    
    if (isSelected) {
      const exists = newSelections.find(selected => selected.name === premedication.name);
      if (!exists) {
        newSelections.push(premedication);
      }
    } else {
      newSelections = newSelections.filter(selected => selected.name !== premedication.name);
    }
    
    onPremedSelectionsChange(newSelections);
  };

  const handleIndividualAntiemeticToggle = (agentKey: string, agent: AntiemeticAgent, isSelected: boolean) => {
    setSelectionMode("individual");
    setSelectedBundleId(null);
    
    let newSelections = [...selectedAntiemetics];
    
    if (isSelected) {
      const exists = newSelections.find(selected => selected.name === agent.name);
      if (!exists) {
        newSelections.push(agent);
      }
    } else {
      newSelections = newSelections.filter(selected => selected.name !== agent.name);
    }
    
    onAntiemeticProtocolChange(newSelections);
  };

  const clearAllSelections = () => {
    onPremedSelectionsChange([]);
    onAntiemeticProtocolChange([]);
    setSelectedBundleId(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "antiemetic": return <Pill className="h-4 w-4" />;
      case "corticosteroid": return <Shield className="h-4 w-4" />;
      case "antihistamine": return <AlertTriangle className="h-4 w-4" />;
      case "h2_blocker": return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "antiemetic": return "bg-info/10 text-info border-info/20";
      case "corticosteroid": return "bg-warning/10 text-warning border-warning/20";
      case "antihistamine": return "bg-destructive/10 text-destructive border-destructive/20";
      case "h2_blocker": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

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

  const totalSelections = selectedPremedications.length + selectedAntiemetics.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Shield className="h-5 w-5" />
          Premedication & Antiemetic Protocols
        </CardTitle>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {drugNames.map(drug => (
              <Badge key={drug} variant="outline" className="text-xs">
                {drug}
              </Badge>
            ))}
            <Badge variant="secondary" className="text-xs">
              {emetogenicRiskLevel.toUpperCase()} Risk
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={clearAllSelections}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="bundles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bundles">Protocol Bundles</TabsTrigger>
            <TabsTrigger value="individual">Individual Selection</TabsTrigger>
            <TabsTrigger value="selected">Selected ({totalSelections})</TabsTrigger>
          </TabsList>

          <TabsContent value="bundles" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Evidence-based protocol combinations tailored to your regimen and emetogenic risk level.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {protocolBundles.map(bundle => (
                <Card 
                  key={bundle.id} 
                  className={`cursor-pointer transition-all border-2 ${
                    selectedBundleId === bundle.id 
                      ? "border-primary bg-primary/5" 
                      : bundle.isRecommended 
                        ? "border-accent/20 bg-accent/5 hover:border-accent/40" 
                        : "border-muted hover:border-muted-foreground/20"
                  }`}
                  onClick={() => handleBundleSelect(bundle)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-foreground flex items-center gap-2">
                          {bundle.isRecommended && <Shield className="h-4 w-4 text-primary" />}
                          {bundle.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{bundle.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={selectedBundleId === bundle.id ? "default" : "outline"}
                      >
                        {selectedBundleId === bundle.id ? "Selected" : "Select Bundle"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {bundle.premedications.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          Premedications ({bundle.premedications.length})
                        </h5>
                        <div className="grid gap-2">
                          {bundle.premedications.map((premed, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-background/60 rounded border">
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded ${getCategoryColor(premed.category)}`}>
                                  {getCategoryIcon(premed.category)}
                                </div>
                                <div>
                                  <span className="font-medium text-sm">{premed.name}</span>
                                  <span className="text-muted-foreground text-xs ml-2">
                                    {premed.dosage} {premed.unit} {premed.route}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {premed.isRequired && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {bundle.antiemetics.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Pill className="h-3 w-3" />
                          Antiemetics ({bundle.antiemetics.length})
                        </h5>
                        <div className="grid gap-2">
                          {bundle.antiemetics.map((agent, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-background/60 rounded border">
                              <div>
                                <span className="font-medium text-sm">{agent.name}</span>
                                <span className="text-muted-foreground text-xs ml-2">
                                  {agent.dosage} {agent.unit} {agent.route} - {agent.timing}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {agent.evidenceLevel}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto font-normal">
                          <span className="text-sm">View Clinical Rationale</span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="bg-muted/50 p-3 rounded text-sm">
                          <p>{bundle.rationale}</p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-6">
            <Alert>
              <AlertDescription>
                Create a custom protocol by selecting individual premedications and antiemetic agents.
              </AlertDescription>
            </Alert>
            
            {/* Premedications Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Premedications
              </h3>
              {Object.entries(groupedPremedications).map(([category, premedications]) => (
                <Card key={category} className="border border-muted mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base capitalize flex items-center gap-2">
                      <div className={`p-2 rounded ${getCategoryColor(category)}`}>
                        {getCategoryIcon(category)}
                      </div>
                      {category.replace('_', ' ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {premedications.map((premed, idx) => {
                      const isSelected = selectedPremedications.some(selected => selected.name === premed.name);
                      return (
                        <div key={idx} className={`border rounded-lg p-3 transition-all ${
                          isSelected ? "bg-primary/5 border-primary" : "bg-muted/30 border-muted"
                        }`}>
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleIndividualPremedToggle(premed, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{premed.name}</h4>
                                  <p className="text-sm text-muted-foreground">{premed.indication}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{premed.dosage} {premed.unit}</p>
                                  <Badge variant="outline" className="text-xs">{premed.route}</Badge>
                                </div>
                              </div>
                              <div className="flex gap-1 mb-2">
                                {premed.isRequired && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                                {premed.isStandard && (
                                  <Badge variant="secondary" className="text-xs">Standard</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {premed.timing}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Antiemetics Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Antiemetic Agents
              </h3>
              <div className="grid gap-3">
                {Object.entries(standardAntiemeticAgents).map(([agentKey, agent]) => {
                  const isSelected = selectedAntiemetics.some(selected => selected.name === agent.name);
                  return (
                    <Card 
                      key={agentKey}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-sm'
                      }`}
                      onClick={() => handleIndividualAntiemeticToggle(agentKey, agent, !isSelected)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={isSelected}
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
                              <span className="font-medium">Dose:</span> {agent.dosage} {agent.unit}
                            </div>
                            <div>
                              <span className="font-medium">Route:</span> {agent.route}
                            </div>
                            <div>
                              <span className="font-medium">Timing:</span> {agent.timing}
                            </div>
                            <div>
                              <span className="font-medium">Indication:</span> {agent.indication}
                            </div>
                          </div>
                          
                          {agent.duration && (
                            <div>
                              <span className="font-medium">Duration:</span> {agent.duration}
                            </div>
                          )}
                          
                          <div>
                            <span className="font-medium">Mechanism:</span> {agent.mechanism}
                          </div>
                          
                          {agent.notes && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              <strong>Note:</strong> {agent.notes}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="selected" className="space-y-4">
            {totalSelections === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No protocols selected. Use the other tabs to select protocol bundles or individual agents.
              </div>
            ) : (
              <div className="space-y-6">
                {selectedPremedications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Selected Premedications ({selectedPremedications.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedPremedications.map((premed, idx) => (
                        <Card key={idx} className="border-2 border-primary bg-primary/5">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded ${getCategoryColor(premed.category)}`}>
                                {getCategoryIcon(premed.category)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold text-lg">{premed.name}</h4>
                                    <p className="text-sm text-muted-foreground">{premed.indication}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg text-primary">{premed.dosage} {premed.unit}</p>
                                    <Badge variant="secondary">{premed.route}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <Clock className="h-4 w-4 inline mr-1" />
                                  {premed.timing}
                                </p>
                                {(premed.dilution || premed.administrationDuration) && (
                                  <div className="bg-background/80 border rounded p-3 mt-2">
                                    {premed.dilution && (
                                      <p className="text-sm"><strong>Dilution:</strong> {premed.dilution}</p>
                                    )}
                                    {premed.administrationDuration && (
                                      <p className="text-sm"><strong>Duration:</strong> {premed.administrationDuration}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleIndividualPremedToggle(premed, false)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAntiemetics.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Selected Antiemetics ({selectedAntiemetics.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedAntiemetics.map((agent, index) => (
                        <Card key={index} className="border-2 border-primary bg-primary/5">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-lg">{agent.name}</div>
                                <div className="text-sm text-muted-foreground mb-1">{agent.class}</div>
                                <div className="text-sm">
                                  <strong>Dose:</strong> {agent.dosage} {agent.unit} {agent.route} - {agent.timing}
                                  {agent.duration && ` (${agent.duration})`}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  <strong>Mechanism:</strong> {agent.mechanism}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {agent.indication}
                                </Badge>
                                <span className={getEvidenceBadge(agent.evidenceLevel)}>
                                  {agent.evidenceLevel}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleIndividualAntiemeticToggle('', agent, false)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};