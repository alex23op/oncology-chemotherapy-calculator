import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Info, Clock } from "lucide-react";
import { drugEmetogenicClassification, emetogenicRiskLevels } from "@/types/emetogenicRisk";
import { Drug } from "@/types/regimens";

interface EmetogenicRiskClassifierProps {
  drugs: Drug[];
  onRiskLevelChange?: (riskLevel: "high" | "moderate" | "low" | "minimal") => void;
}

export const EmetogenicRiskClassifier: React.FC<EmetogenicRiskClassifierProps> = ({ 
  drugs, 
  onRiskLevelChange 
}) => {
  const riskAssessment = useMemo(() => {
    type RiskLevel = "minimal" | "low" | "moderate" | "high";
    let highestRisk: RiskLevel = "minimal";
    const drugRisks: Array<{
      drug: Drug;
      riskLevel: RiskLevel;
      notes?: string;
    }> = [];

    drugs.forEach(drug => {
      const classification = drugEmetogenicClassification.find(
        d => drug.name.toLowerCase().includes(d.drugName.toLowerCase())
      );
      
      if (classification) {
        let drugRisk: RiskLevel = classification.riskLevel;
        let notes = classification.notes;
        
        // Check dose dependency
        if (classification.doseDependency && drug.dosage) {
          const dosage = parseFloat(drug.dosage);
          if (dosage >= classification.doseDependency.threshold) {
            drugRisk = classification.doseDependency.higherRisk;
            notes = `${notes || ''} (Dose ≥${classification.doseDependency.threshold}${classification.doseDependency.unit})`.trim();
          }
        }
        
        drugRisks.push({ drug, riskLevel: drugRisk, notes });
        
        // Update highest risk
        const riskHierarchy: Record<RiskLevel, number> = { 
          minimal: 0, 
          low: 1, 
          moderate: 2, 
          high: 3 
        };
        if (riskHierarchy[drugRisk] > riskHierarchy[highestRisk]) {
          highestRisk = drugRisk;
        }
      } else {
        // Unknown drug - default to low risk
        const lowRisk: RiskLevel = "low";
        drugRisks.push({ drug, riskLevel: lowRisk, notes: "Risk level not classified" });
        const riskHierarchy: Record<RiskLevel, number> = { 
          minimal: 0, 
          low: 1, 
          moderate: 2, 
          high: 3 
        };
        if (riskHierarchy[lowRisk] > riskHierarchy[highestRisk]) {
          highestRisk = lowRisk;
        }
      }
    });

    // Special combination rules
    const drugNames = drugs.map(d => d.name.toLowerCase());
    const hasAC = drugNames.some(d => d.includes('doxorubicin') || d.includes('adriamycin')) &&
                  drugNames.some(d => d.includes('cyclophosphamide'));
    
    if (hasAC) {
      highestRisk = "high" as RiskLevel;
    }

    return { overallRisk: highestRisk as RiskLevel, drugRisks };
  }, [drugs]);

  React.useEffect(() => {
    onRiskLevelChange?.(riskAssessment.overallRisk);
  }, [riskAssessment.overallRisk, onRiskLevelChange]);

  const getRiskIcon = (level: "high" | "moderate" | "low" | "minimal") => {
    switch (level) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "moderate": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "low": return <Info className="h-4 w-4 text-blue-500" />;
      case "minimal": return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getRiskBadgeVariant = (level: "high" | "moderate" | "low" | "minimal") => {
    switch (level) {
      case "high": return "destructive" as const;
      case "moderate": return "secondary" as const;
      case "low": return "outline" as const;
      case "minimal": return "default" as const;
    }
  };

  const overallRiskData = emetogenicRiskLevels[riskAssessment.overallRisk];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getRiskIcon(riskAssessment.overallRisk)}
          Emetogenic Risk Classification
        </CardTitle>
        <CardDescription>
          Assessment of nausea and vomiting risk based on chemotherapy regimen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Summary */}
        <Alert className={`border-l-4 ${
          (() => {
            switch (riskAssessment.overallRisk) {
              case 'high': return 'border-l-red-500 bg-red-50';
              case 'moderate': return 'border-l-orange-500 bg-orange-50';
              case 'low': return 'border-l-blue-500 bg-blue-50';
              case 'minimal': return 'border-l-green-500 bg-green-50';
              default: return 'border-l-green-500 bg-green-50';
            }
          })()
        }`}>
          <AlertDescription>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Overall Emetogenic Risk: </span>
              <Badge variant={getRiskBadgeVariant(riskAssessment.overallRisk)} className="text-sm">
                {riskAssessment.overallRisk.toUpperCase()} ({overallRiskData.risk})
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {overallRiskData.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span className="font-medium">Acute (0-24h):</span>
                <span>{overallRiskData.timeframe.acute}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span className="font-medium">Delayed (24-120h):</span>
                <span>{overallRiskData.timeframe.delayed}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Separator />

        {/* Individual Drug Risk Assessment */}
        <div>
          <h4 className="font-semibold mb-3">Individual Drug Risk Assessment</h4>
          <div className="space-y-2">
            {riskAssessment.drugRisks.map((drugRisk, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{drugRisk.drug.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {drugRisk.drug.dosage} {drugRisk.drug.unit}
                    </span>
                  </div>
                  {drugRisk.notes && (
                    <p className="text-xs text-muted-foreground">{drugRisk.notes}</p>
                  )}
                </div>
                <Badge variant={getRiskBadgeVariant(drugRisk.riskLevel)} className="text-xs">
                  {drugRisk.riskLevel.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Guidelines Reference */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Clinical Guidelines:</strong> Classification based on NCCN 2024, ASCO 2020, and MASCC/ESMO 2023 guidelines for antiemetic use in oncology. 
            Risk levels determine appropriate antiemetic prophylaxis strategies.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};