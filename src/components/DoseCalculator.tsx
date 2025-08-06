import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Edit, Save, FileText } from "lucide-react";
import { Regimen, Drug } from "@/types/regimens";

interface DoseCalculatorProps {
  regimen: Regimen | null;
  bsa: number;
  weight: number;
  creatinineClearance: number;
  onExport?: (calculations: DoseCalculation[]) => void;
}

interface DoseCalculation {
  drug: Drug;
  calculatedDose: number;
  adjustedDose: number;
  finalDose: number;
  notes: string;
}

export const DoseCalculator = ({ regimen, bsa, weight, creatinineClearance, onExport }: DoseCalculatorProps) => {
  const [calculations, setCalculations] = useState<DoseCalculation[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (regimen && bsa > 0) {
      const newCalculations = regimen.drugs.map(drug => {
        let calculatedDose = 0;
        
        if (drug.unit === "mg/m²") {
          calculatedDose = parseFloat(drug.dosage) * bsa;
        } else if (drug.unit === "mg/kg") {
          calculatedDose = parseFloat(drug.dosage) * weight;
        } else if (drug.dosage.includes("AUC")) {
          // Calvert formula for carboplatin: Dose = AUC × (GFR + 25)
          const aucValue = parseFloat(drug.dosage.replace("AUC ", ""));
          calculatedDose = aucValue * (creatinineClearance + 25);
        } else {
          calculatedDose = parseFloat(drug.dosage) || 0;
        }

        return {
          drug,
          calculatedDose,
          adjustedDose: calculatedDose,
          finalDose: Math.round(calculatedDose * 10) / 10, // Round to 1 decimal
          notes: ""
        };
      });
      
      setCalculations(newCalculations);
    }
  }, [regimen, bsa, weight, creatinineClearance]);

  const handleDoseAdjustment = (index: number, newDose: string) => {
    const updatedCalculations = [...calculations];
    const dose = parseFloat(newDose) || 0;
    updatedCalculations[index].adjustedDose = dose;
    updatedCalculations[index].finalDose = Math.round(dose * 10) / 10;
    setCalculations(updatedCalculations);
  };

  const handleNotesChange = (index: number, notes: string) => {
    const updatedCalculations = [...calculations];
    updatedCalculations[index].notes = notes;
    setCalculations(updatedCalculations);
  };

  const getDoseReduction = (calculated: number, adjusted: number) => {
    if (calculated === 0) return 0;
    return Math.round(((calculated - adjusted) / calculated) * 100);
  };

  if (!regimen) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Select a cancer type and regimen to calculate doses.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Calculator className="h-5 w-5" />
              Dose Calculations
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {regimen.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? "Save" : "Edit"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport?.(calculations)}
            >
              <FileText className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">BSA:</span>
            <span className="font-medium">{bsa} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight:</span>
            <span className="font-medium">{weight} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CrCl:</span>
            <span className="font-medium">{creatinineClearance} mL/min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Schedule:</span>
            <span className="font-medium">{regimen.schedule}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cycles:</span>
            <span className="font-medium">{regimen.cycles}</span>
          </div>
        </div>

        {regimen.premedications && regimen.premedications.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-foreground mb-3">Premedications</h3>
              <div className="space-y-3">
                {regimen.premedications.map((premedication, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-muted/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{premedication.name}</h4>
                        <p className="text-sm text-muted-foreground">{premedication.timing}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{premedication.dosage} {premedication.unit}</p>
                        <Badge variant="outline" className="mt-1">{premedication.route}</Badge>
                      </div>
                    </div>
                    {premedication.dilution && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Dilution:</strong> {premedication.dilution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-4">
          {calculations.map((calc, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground">{calc.drug.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {calc.drug.route}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Standard: {calc.drug.dosage} {calc.drug.unit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Calculated Dose</Label>
                  <p className="font-medium text-lg">
                    {calc.calculatedDose.toFixed(1)} mg
                  </p>
                </div>

                <div>
                  <Label className="text-muted-foreground">
                    {isEditing ? "Adjusted Dose" : "Final Dose"}
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={calc.adjustedDose}
                      onChange={(e) => handleDoseAdjustment(index, e.target.value)}
                      className="mt-1"
                      step="0.1"
                    />
                  ) : (
                    <p className="font-medium text-lg text-accent">
                      {calc.finalDose} mg
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Dose Reduction</Label>
                  <p className={`font-medium ${
                    getDoseReduction(calc.calculatedDose, calc.adjustedDose) > 0 
                      ? "text-warning" 
                      : "text-success"
                  }`}>
                    {getDoseReduction(calc.calculatedDose, calc.adjustedDose)}%
                  </p>
                </div>
              </div>

              {isEditing && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <Input
                    placeholder="Add notes for dose adjustment..."
                    value={calc.notes}
                    onChange={(e) => handleNotesChange(index, e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              {calc.notes && !isEditing && (
                <div className="bg-muted/50 p-2 rounded text-sm">
                  <strong>Notes:</strong> {calc.notes}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                {calc.drug.dilution && (
                  <div>
                    <strong>Dilution:</strong> {calc.drug.dilution}
                  </div>
                )}
                {calc.drug.administrationDuration && (
                  <div>
                    <strong>Administration:</strong> {calc.drug.administrationDuration}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {calculations.length > 0 && (
          <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
            <h4 className="font-medium text-accent mb-2">Important Reminders</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Verify patient weight and height before administration</li>
              <li>• Check for any contraindications or drug interactions</li>
              <li>• Consider dose modifications for organ dysfunction</li>
              <li>• Ensure appropriate premedications are given</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};