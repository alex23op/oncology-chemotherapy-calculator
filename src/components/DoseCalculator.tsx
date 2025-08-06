import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Edit, Save, FileText, Download, Printer, FileCheck } from "lucide-react";
import { Regimen, Drug, Premedication } from "@/types/regimens";
import { UnifiedProtocolSelector } from "./UnifiedProtocolSelector";
import { EmetogenicRiskClassifier } from "./EmetogenicRiskClassifier";
import { ClinicalTreatmentSheet } from "./ClinicalTreatmentSheet";
import { AntiemeticAgent } from "@/types/emetogenicRisk";
import { TreatmentData, PatientInfo, CalculatedDrug } from "@/types/clinicalTreatment";
import { generateClinicalTreatmentPDF } from "@/utils/pdfExport";
import { usePrint } from "@/hooks/usePrint";
import { toast } from "sonner";

interface DoseCalculatorProps {
  regimen: Regimen | null;
  bsa: number;
  weight: number;
  height: number;
  age: number;
  sex: string;
  creatinineClearance: number;
  onExport?: (calculations: DoseCalculation[]) => void;
}

interface DoseCalculation {
  drug: Drug;
  calculatedDose: number;
  adjustedDose: number;
  finalDose: number;
  notes: string;
  selected: boolean;
  reductionPercentage: number;
}

export const DoseCalculator = ({ regimen, bsa, weight, height, age, sex, creatinineClearance, onExport }: DoseCalculatorProps) => {
  const [calculations, setCalculations] = useState<DoseCalculation[]>([]);
  const [selectedPremedications, setSelectedPremedications] = useState<Premedication[]>([]);
  const [emetogenicRiskLevel, setEmetogenicRiskLevel] = useState<"high" | "moderate" | "low" | "minimal">("minimal");
  const [selectedAntiemetics, setSelectedAntiemetics] = useState<AntiemeticAgent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [patientId, setPatientId] = useState<string>('');
  const [cycleNumber, setCycleNumber] = useState<number>(1);
  const [treatmentDate, setTreatmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [showTreatmentSheet, setShowTreatmentSheet] = useState<boolean>(false);

  const { componentRef, printTreatmentSheet } = usePrint();

  useEffect(() => {
    console.log("DoseCalculator useEffect triggered - regimen:", regimen?.name, "bsa:", bsa);
    
    if (regimen && bsa > 0) {
      const newCalculations = regimen.drugs.map(drug => {
        let calculatedDose = 0;
        
        try {
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
        } catch (error) {
          console.error("Error calculating dose for drug:", drug.name, error);
          calculatedDose = 0;
        }

        return {
          drug,
          calculatedDose,
          adjustedDose: calculatedDose,
          finalDose: Math.round(calculatedDose * 10) / 10, // Round to 1 decimal
          notes: "",
          selected: true,
          reductionPercentage: 0
        };
      });
      
      console.log("Calculated doses:", newCalculations);
      setCalculations(newCalculations);
      
      // Initialize with existing regimen premedications if any
      setSelectedPremedications(regimen.premedications || []);
    } else {
      console.log("Clearing calculations - no regimen or invalid BSA");
      setCalculations([]);
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

  const handleDrugSelection = (index: number, selected: boolean) => {
    const updatedCalculations = [...calculations];
    updatedCalculations[index].selected = selected;
    setCalculations(updatedCalculations);
  };

  const handlePremedSelectionsChange = (premedications: Premedication[]) => {
    console.log("Premedications changed:", premedications);
    setSelectedPremedications(premedications);
  };

  const handleEmetogenicRiskChange = (riskLevel: "high" | "moderate" | "low" | "minimal") => {
    console.log("Emetogenic risk level changed:", riskLevel);
    setEmetogenicRiskLevel(riskLevel);
  };

  const handleAntiemeticProtocolChange = (agents: AntiemeticAgent[]) => {
    console.log("Antiemetic agents selected:", agents);
    setSelectedAntiemetics(agents);
  };

  const handlePercentageReduction = (index: number, percentage: string) => {
    const updatedCalculations = [...calculations];
    const reductionPercent = parseFloat(percentage) || 0;
    const reducedDose = updatedCalculations[index].calculatedDose * (1 - reductionPercent / 100);
    
    updatedCalculations[index].reductionPercentage = reductionPercent;
    updatedCalculations[index].adjustedDose = reducedDose;
    updatedCalculations[index].finalDose = Math.round(reducedDose * 10) / 10;
    setCalculations(updatedCalculations);
  };

  const getDoseReduction = (calculated: number, adjusted: number) => {
    if (calculated === 0) return 0;
    return Math.round(((calculated - adjusted) / calculated) * 100);
  };

  const prepareTreatmentData = (): TreatmentData => {
    if (!regimen) throw new Error('No regimen selected');

    const patient: PatientInfo = {
      patientId,
      weight,
      height,
      age,
      sex,
      bsa,
      creatinineClearance,
      cycleNumber,
      treatmentDate,
    };

    const calculatedDrugs: CalculatedDrug[] = calculations.map((calc) => ({
      ...calc.drug,
      calculatedDose: `${calc.calculatedDose.toFixed(1)} mg`,
      finalDose: `${calc.finalDose} mg`,
      adjustmentNotes: calc.notes,
      preparationInstructions: calc.drug.dilution,
    }));

    const categorizeAgent = (agent: any) => {
      const category = agent.category?.toLowerCase() || '';
      const indication = agent.indication?.toLowerCase() || '';
      
      if (category.includes('antiemetic') || indication.includes('nausea') || indication.includes('vomiting')) {
        return 'antiemetics';
      }
      if (category.includes('infusion') || indication.includes('reaction') || indication.includes('allergy')) {
        return 'infusionReactionProphylaxis';
      }
      if (category.includes('gastro') || indication.includes('gastro') || indication.includes('stomach')) {
        return 'gastroprotection';
      }
      if (category.includes('organ') || indication.includes('nephro') || indication.includes('kidney') || indication.includes('liver')) {
        return 'organProtection';
      }
      return 'other';
    };

    const premedications = {
      antiemetics: selectedAntiemetics.filter(agent => categorizeAgent(agent) === 'antiemetics').map(agent => ({
        ...agent,
        category: agent.category || 'antiemetic',
        dosage: agent.dosage || '',
        route: agent.route || '',
        timing: agent.timing || '',
      })),
      infusionReactionProphylaxis: selectedAntiemetics.filter(agent => categorizeAgent(agent) === 'infusionReactionProphylaxis').map(agent => ({
        ...agent,
        category: agent.category || 'infusion',
        dosage: agent.dosage || '',
        route: agent.route || '',
        timing: agent.timing || '',
      })),
      gastroprotection: selectedAntiemetics.filter(agent => categorizeAgent(agent) === 'gastroprotection').map(agent => ({
        ...agent,
        category: agent.category || 'gastro',
        dosage: agent.dosage || '',
        route: agent.route || '',
        timing: agent.timing || '',
      })),
      organProtection: selectedAntiemetics.filter(agent => categorizeAgent(agent) === 'organProtection').map(agent => ({
        ...agent,
        category: agent.category || 'organ',
        dosage: agent.dosage || '',
        route: agent.route || '',
        timing: agent.timing || '',
      })),
      other: selectedAntiemetics.filter(agent => categorizeAgent(agent) === 'other').map(agent => ({
        ...agent,
        category: agent.category || 'other',
        dosage: agent.dosage || '',
        route: agent.route || '',
        timing: agent.timing || '',
      })),
    };

    return {
      patient,
      regimen,
      calculatedDrugs,
      emetogenicRisk: {
        level: emetogenicRiskLevel,
        justification: `Based on ${regimen.name} regimen classification`,
        acuteRisk: emetogenicRiskLevel === 'high' ? '>90% risk of emesis' : 
                   emetogenicRiskLevel === 'moderate' ? '30-90% risk of emesis' : 
                   emetogenicRiskLevel === 'low' ? '10-30% risk of emesis' : '<10% risk of emesis',
        delayedRisk: emetogenicRiskLevel === 'high' ? '>90% risk of delayed emesis' : 
                     emetogenicRiskLevel === 'moderate' ? '30-90% risk of delayed emesis' : 
                     emetogenicRiskLevel === 'low' ? '10-30% risk of delayed emesis' : '<10% risk of delayed emesis',
      },
      premedications,
      clinicalNotes,
    };
  };

  const handleExportTreatmentPDF = async () => {
    try {
      console.log('Export PDF clicked', { patientId, calculations: calculations.length });
      if (!patientId.trim()) {
        toast.error('Please enter a Patient ID before exporting');
        return;
      }
      if (calculations.length === 0) {
        toast.error('No calculations available for export');
        return;
      }

      const treatmentData = prepareTreatmentData();
      await generateClinicalTreatmentPDF({
        ...treatmentData,
        elementId: 'clinical-treatment-sheet'
      });
      toast.success('Treatment protocol PDF generated successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export treatment protocol');
    }
  };

  const handlePrintTreatmentSheet = () => {
    if (!patientId.trim()) {
      toast.error('Please enter a Patient ID before printing');
      return;
    }
    printTreatmentSheet();
  };

  const handleGenerateTreatmentSheet = () => {
    console.log('Generate sheet clicked', { patientId, calculations: calculations.length });
    if (!patientId.trim()) {
      toast.error('Please enter a Patient ID to generate treatment sheet');
      return;
    }
    if (calculations.length === 0) {
      toast.error('No dose calculations available. Please ensure regimen is selected and patient data is entered.');
      return;
    }
    console.log('Setting showTreatmentSheet to true');
    setShowTreatmentSheet(true);
    toast.success('Treatment sheet generated successfully');
  };

  console.log("DoseCalculator rendering - regimen:", regimen?.name, "calculations:", calculations.length);

  if (!regimen) {
    console.log("No regimen selected, showing placeholder");
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
              variant="secondary"
              size="sm"
              onClick={handleGenerateTreatmentSheet}
              disabled={!patientId.trim() || calculations.length === 0}
            >
              <FileCheck className="h-4 w-4" />
              Generate Sheet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Export data clicked', { calculations: calculations.length });
                if (calculations.length === 0) {
                  toast.error('No calculations to export. Please select a regimen and enter patient data first.');
                  return;
                }
                onExport?.(calculations);
                toast.success('Data exported successfully');
              }}
            >
              <FileText className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Information for Treatment Sheet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <Label htmlFor="patientId">Patient ID *</Label>
            <Input
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter Patient ID"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cycleNumber">Cycle Number</Label>
            <Input
              id="cycleNumber"
              type="number"
              value={cycleNumber}
              onChange={(e) => setCycleNumber(parseInt(e.target.value) || 1)}
              min="1"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="treatmentDate">Treatment Date</Label>
            <Input
              id="treatmentDate"
              type="date"
              value={treatmentDate}
              onChange={(e) => setTreatmentDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

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

        {/* Emetogenic Risk Assessment */}
        <EmetogenicRiskClassifier
          drugs={regimen.drugs}
          onRiskLevelChange={handleEmetogenicRiskChange}
        />

        <Separator />

        {/* Unified Protocol Selection */}
        <UnifiedProtocolSelector
          drugNames={regimen.drugs.map(drug => drug.name)}
          drugs={regimen.drugs}
          emetogenicRiskLevel={emetogenicRiskLevel}
          selectedPremedications={selectedPremedications}
          selectedAntiemetics={selectedAntiemetics}
          onPremedSelectionsChange={handlePremedSelectionsChange}
          onAntiemeticProtocolChange={handleAntiemeticProtocolChange}
          weight={weight}
        />

        <Separator />

        <div>
          <h3 className="font-semibold text-foreground mb-3">Chemotherapy Drugs</h3>
          <div className="space-y-4">
             {calculations.map((calc, index) => (
               <div key={index} className={`border-2 rounded-lg p-5 space-y-4 transition-all ${
                 calc.selected ? "bg-primary/5 border-primary" : "bg-muted/30 border-muted"
               }`}>
                 <div className="flex items-start gap-4">
                   <div className="flex-shrink-0 mt-1">
                     <Checkbox
                       checked={calc.selected}
                       onCheckedChange={(checked) => handleDrugSelection(index, checked as boolean)}
                       className="h-5 w-5"
                     />
                   </div>
                   <div className="flex-1 space-y-4">
                     <div className="flex justify-between items-start">
                       <div>
                         <h4 className="font-bold text-xl text-foreground">{calc.drug.name}</h4>
                         <div className="flex gap-2 mt-2">
                           <Badge variant="outline" className="font-medium">{calc.drug.route}</Badge>
                           {calc.drug.day && <Badge variant="secondary" className="font-medium">{calc.drug.day}</Badge>}
                         </div>
                         <p className="text-sm text-muted-foreground mt-2 font-medium">
                           Standard Dose: <span className="text-foreground">{calc.drug.dosage} {calc.drug.unit}</span>
                         </p>
                       </div>
                     </div>

                     {(calc.drug.dilution || calc.drug.administrationDuration) && (
                       <div className="border-2 border-accent/30 bg-accent/10 rounded-lg p-4">
                         <h5 className="font-semibold text-accent mb-3">Preparation & Administration</h5>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {calc.drug.dilution && (
                             <div className="bg-background/70 p-3 rounded border">
                               <Label className="text-muted-foreground font-semibold text-sm">Diluent</Label>
                               <p className="text-foreground font-medium mt-1">{calc.drug.dilution}</p>
                             </div>
                           )}
                           {calc.drug.administrationDuration && (
                             <div className="bg-background/70 p-3 rounded border">
                               <Label className="text-muted-foreground font-semibold text-sm">Administration Duration</Label>
                               <p className="text-foreground font-medium mt-1">{calc.drug.administrationDuration}</p>
                             </div>
                           )}
                         </div>
                       </div>
                     )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Calculated Dose</Label>
                        <p className="font-medium text-lg">
                          {calc.calculatedDose.toFixed(1)} mg
                        </p>
                      </div>

                      <div>
                        <Label className="text-muted-foreground">Reduction %</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={calc.reductionPercentage}
                            onChange={(e) => handlePercentageReduction(index, e.target.value)}
                            className="mt-1"
                            step="1"
                            min="0"
                            max="100"
                            placeholder="0"
                          />
                        ) : (
                          <p className={`font-medium ${
                            calc.reductionPercentage > 0 ? "text-warning" : "text-success"
                          }`}>
                            {calc.reductionPercentage}%
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-muted-foreground">
                          {isEditing ? "Adjusted Dose" : "Final Dose"}
                        </Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={calc.adjustedDose.toFixed(1)}
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
                        <Label className="text-muted-foreground">Total Reduction</Label>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Notes */}
        <div>
          <Label htmlFor="clinicalNotes">Clinical Notes (Optional)</Label>
          <Textarea
            id="clinicalNotes"
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Add any clinical notes or special instructions..."
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Treatment Sheet Section */}
        {showTreatmentSheet && patientId.trim() && (
          <div className="space-y-4">
            <Separator />
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Clinical Treatment Sheet</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportTreatmentPDF}
                  disabled={!patientId.trim()}
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintTreatmentSheet}
                  disabled={!patientId.trim()}
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
            
            <div id="clinical-treatment-sheet" ref={componentRef}>
              <ClinicalTreatmentSheet 
                treatmentData={prepareTreatmentData()}
                className="bg-background"
              />
            </div>
          </div>
        )}

        {calculations.length > 0 && (
          <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
            <h4 className="font-medium text-accent mb-2">Important Reminders</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Verify patient weight and height before administration</li>
              <li>• Check for any contraindications or drug interactions</li>
              <li>• Consider dose modifications for organ dysfunction</li>
              <li>• Ensure appropriate premedications are given</li>
              <li>• Generate and review the clinical treatment sheet before proceeding</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};