import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, Clock, Pill } from "lucide-react";
import { PremedProtocol, standardPremedProtocols, getRecommendedProtocols } from "@/utils/premedProtocols";
import { Premedication } from "@/types/regimens";
import { useTranslation } from 'react-i18next';

interface PremedProtocolSelectorProps {
  drugNames: string[];
  selectedPremedications: Premedication[];
  onPremedSelectionsChange: (premedications: Premedication[]) => void;
  weight: number;
}

interface PremedWithSolvent extends Premedication {
  solvent?: string;
}

export const PremedProtocolSelector = ({
  drugNames,
  selectedPremedications,
  onPremedSelectionsChange,
  weight
}: PremedProtocolSelectorProps) => {
  const { t } = useTranslation();
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [solventSelections, setSolventSelections] = useState<Record<string, string>>({});
  const recommendedProtocols = getRecommendedProtocols(drugNames);
  const handleProtocolSelect = (protocol: PremedProtocol) => {
    const newSelections = [...selectedPremedications];
    
    protocol.premedications.forEach(premed => {
      const exists = newSelections.find(selected => selected.name === premed.name);
      if (!exists) {
        newSelections.push(premed);
      }
    });
    
    onPremedSelectionsChange(newSelections);
    setSelectedProtocols([...selectedProtocols, protocol.id]);
  };

  const handleIndividualPremedToggle = (premedication: Premedication, isSelected: boolean) => {
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

  const clearAllSelections = () => {
    onPremedSelectionsChange([]);
    setSelectedProtocols([]);
    setSolventSelections({});
  };

  const handleSolventChange = (premedName: string, solvent: string) => {
    const newSolventSelections = {
      ...solventSelections,
      [premedName]: solvent
    };
    setSolventSelections(newSolventSelections);

    // Update the selected premedications with solvent
    const updatedPremedications = selectedPremedications.map(premed => 
      premed.name === premedName 
        ? { ...premed, solvent: solvent || undefined } as PremedWithSolvent
        : premed
    );
    onPremedSelectionsChange(updatedPremedications);
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

  const groupedPremedications = standardPremedProtocols.reduce((acc, protocol) => {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Shield className="h-5 w-5" />
          {t('premedSelector.title')}
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {drugNames.map(drug => (
            <Badge key={drug} variant="outline" className="text-xs">
              {drug}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="protocols" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="protocols">{t('premedSelector.tabs.protocols')}</TabsTrigger>
            <TabsTrigger value="individual">{t('premedSelector.tabs.individual')}</TabsTrigger>
            <TabsTrigger value="solvents">{t('premedSelector.tabs.solvents')}</TabsTrigger>
            <TabsTrigger value="selected">{t('premedSelector.tabs.selected', { count: selectedPremedications.length })}</TabsTrigger>
          </TabsList>

          <TabsContent value="protocols" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {t('premedSelector.quickTip')}
              </p>
              <Button variant="outline" size="sm" onClick={clearAllSelections}>
                {t('premedSelector.clearAll')}
              </Button>
            </div>
            
            <div className="space-y-3">
              {recommendedProtocols.map(protocol => (
                <Card key={protocol.id} className="border-2 border-accent/20 bg-accent/5">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-foreground">{protocol.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{protocol.description}</p>
                      </div>
                      <Button
                        onClick={() => handleProtocolSelect(protocol)}
                        size="sm"
                        disabled={selectedProtocols.includes(protocol.id)}
                      >
                        {selectedProtocols.includes(protocol.id) ? t('premedSelector.added') : t('premedSelector.addProtocol')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-2">
                      {protocol.premedications.map((premed, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-background/60 rounded border">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${getCategoryColor(premed.category)}`}>
                              {getCategoryIcon(premed.category)}
                            </div>
                            <div>
                              <span className="font-medium">{premed.name}</span>
                              <span className="text-muted-foreground text-sm ml-2">
                                {premed.dosage} {premed.unit} {premed.route}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {premed.isRequired && (
                              <Badge variant="destructive" className="text-xs">{t('premedSelector.required')}</Badge>
                            )}
                            {premed.isStandard && (
                              <Badge variant="secondary" className="text-xs">{t('premedSelector.standard')}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('premedSelector.selectByCategory')}
            </p>
            
            {Object.entries(groupedPremedications).map(([category, premedications]) => (
              <Card key={category} className="border border-muted">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base capitalize flex items-center gap-2">
                    <div className={`p-2 rounded ${getCategoryColor(category)}`}>
                      {getCategoryIcon(category)}
                    </div>
                    {t(`premedSelector.categories.${category}`, { defaultValue: category.replace('_', ' ') })}
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
                                <Badge variant="destructive" className="text-xs">{t('premedSelector.required')}</Badge>
                              )}
                              {premed.isStandard && (
                                <Badge variant="secondary" className="text-xs">{t('premedSelector.standard')}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {premed.timing}
                            </p>
                              {premed.dilution && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <strong>{t('premedSelector.dilution')}:</strong> {premed.dilution}
                                </p>
                              )}
                              {premed.administrationDuration && (
                                <p className="text-xs text-muted-foreground">
                                  <strong>{t('premedSelector.duration')}:</strong> {premed.administrationDuration}
                                </p>
                              )}
                              {premed.notes && (
                                <p className="text-xs text-info mt-1">
                                  <strong>{t('premedSelector.note')}:</strong> {premed.notes}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="solvents" className="space-y-4">
            {selectedPremedications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('premedSelector.noneSelected')}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('premedSelector.selectSolvent')} each selected premedication:
                </p>
                
                {selectedPremedications.map((premed, idx) => (
                  <Card key={idx} className="border border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${getCategoryColor(premed.category)}`}>
                            {getCategoryIcon(premed.category)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{premed.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {premed.dosage} {premed.unit} {premed.route}
                            </p>
                          </div>
                        </div>
                        
                        <div className="min-w-[200px]">
                          <Label className="text-muted-foreground font-semibold text-sm">
                            {t('premedSelector.solvent')}
                          </Label>
                          <Select 
                            value={solventSelections[premed.name] || ''} 
                            onValueChange={(value) => handleSolventChange(premed.name, value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={t('doseCalculator.selectSolvent')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Normal Saline 0.9%">{t('doseCalculator.solvents.normalSaline')}</SelectItem>
                              <SelectItem value="Dextrose 5%">{t('doseCalculator.solvents.dextrose5')}</SelectItem>
                              <SelectItem value="Ringer Solution">{t('doseCalculator.solvents.ringer')}</SelectItem>
                            </SelectContent>
                          </Select>
                          {premed.dilution && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t('doseCalculator.protocolSuggest')}: {premed.dilution}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="selected" className="space-y-4">
            {selectedPremedications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('premedSelector.noneSelected')}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {t('premedSelector.reviewSelected')}
                  </p>
                  <Button variant="outline" size="sm" onClick={clearAllSelections}>
                    {t('premedSelector.clearAll')}
                  </Button>
                </div>
                
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
                          <div className="flex gap-1 mb-2">
                            {premed.isRequired && (
                              <Badge variant="destructive" className="text-xs">{t('premedSelector.required')}</Badge>
                            )}
                            {premed.isStandard && (
                              <Badge variant="secondary" className="text-xs">{t('premedSelector.standard')}</Badge>
                            )}
                            <Badge variant="outline" className="text-xs capitalize">
                              {t(`premedSelector.categories.${premed.category}`, { defaultValue: premed.category.replace('_', ' ') })}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {premed.timing}
                          </p>
                          {(premed.dilution || premed.administrationDuration) && (
                            <div className="bg-background/80 border rounded p-3 mt-2">
                                {premed.dilution && (
                                  <p className="text-sm"><strong>{t('premedSelector.dilution')}:</strong> {premed.dilution}</p>
                                )}
                                {premed.administrationDuration && (
                                  <p className="text-sm"><strong>{t('premedSelector.duration')}:</strong> {premed.administrationDuration}</p>
                                )}
                            </div>
                          )}
                          {premed.notes && (
                            <div className="bg-info/10 border border-info/20 rounded p-2 mt-2">
                                <p className="text-sm text-info"><strong>{t('premedSelector.note')}:</strong> {premed.notes}</p>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleIndividualPremedToggle(premed, false)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          {t('premedSelector.remove')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};