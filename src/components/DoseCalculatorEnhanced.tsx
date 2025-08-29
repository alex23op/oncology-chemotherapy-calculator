import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calculator, CalendarIcon, FileText, Edit, Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Regimen, Drug, Premedication } from "@/types/regimens";
import { usePrint } from '@/hooks/usePrint';
import { useDataPersistence } from '@/context/DataPersistenceContext';
import { calculateCompleteDose, DoseCalculationResult } from "@/utils/doseCalculations";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { logger } from '@/utils/logger';
import { ErrorBoundary } from "./ErrorBoundary";
import { sanitizeCNP, validateCNP } from "@/utils/cnp";
import { format, addDays, isValid } from "date-fns";
import { cn } from "@/lib/utils";

interface DoseCalculatorEnhancedProps {
  regimen: Regimen | null;
  bsa: number;
  weight: number;
  height: number;
  age: number;
  sex: string;
  creatinineClearance: number;
  biomarkerStatus?: Record<string, string>;
  currentMedications?: string[];
  onExport?: (calculations: EnhancedDoseCalculation[]) => void;
  onFinalize?: (data: any) => void;
  onGenerateSheet?: (data: any) => void;
  onGoToReview?: () => void;
}

interface EnhancedDoseCalculation extends DoseCalculationResult {
  drug: Drug;
  selected: boolean;
  notes: string;
  administrationDuration?: string;
  selectedSolventType?: string;
  selectedVolume?: number;
  solvent?: string;
  adjustmentNotes?: string;
  preparationInstructions?: string;
}

const DoseCalculatorCore: React.FC<DoseCalculatorEnhancedProps> = ({
  regimen,
  bsa,
  weight,
  height,
  age,
  sex,
  creatinineClearance,
  biomarkerStatus = {},
  currentMedications = [],
  onExport,
  onFinalize,
  onGenerateSheet
}) => {
  const { t } = useTranslation();
  const { state: persistedState } = useDataPersistence();
  
  // Use patient data from persistence context
  const patientData = persistedState.patientData;
  const effectiveBsa = patientData?.bsaCapEnabled ? Math.min(bsa, 2.0) : bsa;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedCalculations, setEditedCalculations] = useState<EnhancedDoseCalculation[]>([]);

  // Memoized calculations based on effective BSA
  const calculations = useMemo(() => {
    if (!regimen) return [];

    return regimen.drugs.map((drug): EnhancedDoseCalculation => {
      const result = calculateCompleteDose(
        drug,
        effectiveBsa,
        weight,
        age,
        creatinineClearance,
        regimen.schedule
      );

      return {
        ...result,
        drug,
        selected: true,
        notes: '',
        administrationDuration: drug.administrationDuration,
        selectedSolventType: drug.availableSolvents?.[0] || 'Normal Saline 0.9%',
        selectedVolume: drug.availableVolumes?.[0] || 100,
        solvent: drug.solvent || 'Normal Saline 0.9%'
      };
    });
  }, [regimen, effectiveBsa, weight, age, creatinineClearance]);

  // Initialize edited calculations when calculations change
  useEffect(() => {
    if (calculations.length > 0 && editedCalculations.length === 0) {
      setEditedCalculations([...calculations]);
    }
  }, [calculations, editedCalculations.length]);

  // Get current calculations (edited or original)
  const currentCalculations = isEditing ? editedCalculations : calculations;

  // Handle editing functions with bidirectional synchronization
  const handleEditCalculation = useCallback((index: number, field: string, value: any) => {
    setEditedCalculations(prev => {
      const updated = [...prev];
      const calc = { ...updated[index] };
      
      if (field === 'finalDose') {
        const finalDose = parseFloat(value) || 0;
        calc.finalDose = finalDose;
        // Calculate percentage from final dose: percentage = (1 - (finalDose / calculatedDose)) * 100
        if (calc.calculatedDose > 0) {
          calc.reductionPercentage = Math.round((1 - (finalDose / calc.calculatedDose)) * 100 * 10) / 10;
        }
        
        // Check for dose increase alert (>10% above calculated dose)
        if (finalDose > calc.calculatedDose * 1.1) {
          const increasePercentage = Math.round(((finalDose / calc.calculatedDose) - 1) * 100);
          toast.warning(
            `Atenție! Doza pentru ${calc.drug.name} este cu ${increasePercentage}% mai mare decât doza calculată. Verificați și confirmați dacă doza este corectă.`,
            {
              duration: 8000,
              action: {
                label: "Am înțeles",
                onClick: () => {}
              }
            }
          );
        }
      } else if (field === 'reductionPercentage') {
        const percentage = parseFloat(value) || 0;
        calc.reductionPercentage = percentage;
        // Calculate final dose from percentage: finalDose = calculatedDose * (1 - percentage / 100)
        calc.finalDose = Math.round(calc.calculatedDose * (1 - percentage / 100) * 10) / 10;
      } else if (field === 'solvent') {
        calc.solvent = value;
        calc.selectedSolventType = value;
      } else if (field === 'notes') {
        calc.notes = value;
      } else if (field === 'administrationDuration') {
        calc.administrationDuration = value;
      }
      
      updated[index] = calc;
      return updated;
    });
  }, []);

  const handleSaveEdits = useCallback(() => {
    setIsEditing(false);
    toast.success('Modificările au fost salvate cu succes');
  }, []);

  const handleCancelEdits = useCallback(() => {
    setEditedCalculations([...calculations]);
    setIsEditing(false);
  }, [calculations]);

  const handleGenerateSheet = useCallback(() => {
    if (!patientData) {
      toast.error('Vă rugăm să completați datele pacientului în secțiunea "Date pacient"');
      return;
    }

    if (!patientData.cnp) {
      toast.error('Vă rugăm să introduceți CNP-ul pacientului');
      return;
    }
    
    if (!patientData.fullName) {
      toast.error('Vă rugăm să introduceți numele pacientului');
      return;
    }

    if (!calculations.length) {
      toast.error('Nu există calcule de doze disponibile');
      return;
    }

    // Get supportive care data from persistence context
    const supportiveData = persistedState.supportiveData || {};
    const selectedAntiemetics = supportiveData.selectedAntiemetics || [];
    const selectedPremedications = supportiveData.selectedPremedications || [];
    const groupedPremedications = supportiveData.groupedPremedications || { groups: [], individual: [] };

    const treatmentData = {
      patient: {
        fullName: patientData.fullName,
        cnp: patientData.cnp,
        foNumber: patientData.foNumber,
        cycleNumber: patientData.cycleNumber || 1,
        treatmentDate: patientData.treatmentDate,
        nextCycleDate: patientData.nextCycleDate,
        age,
        weight,
        height,
        bsa: effectiveBsa,
        creatinineClearance,
        sex
      },
      regimen,
      calculatedDrugs: Array.isArray(currentCalculations) ? currentCalculations.map(calc => ({
        name: calc.drug.name, // Ensure drug name is properly transmitted
        ...calc.drug,
        calculatedDose: calc.calculatedDose,
        finalDose: calc.finalDose,
        adjustmentNotes: calc.adjustmentNotes,
        preparationInstructions: calc.preparationInstructions,
        administrationDuration: calc.administrationDuration || calc.drug.administrationDuration,
        solvent: calc.selectedSolventType || calc.solvent || 'Normal Saline 0.9%'
      })) : [],
      premedications: {
        antiemetics: selectedAntiemetics,
        infusionReactionProphylaxis: selectedPremedications.filter((p: Premedication) => 
          p.category === 'antihistamine' || p.name.toLowerCase().includes('allerg')
        ),
        gastroprotection: selectedPremedications.filter((p: Premedication) => 
          p.category === 'h2_blocker' || p.name.toLowerCase().includes('gastro')
        ),
        organProtection: selectedPremedications.filter((p: Premedication) => 
          p.category === 'corticosteroid' && p.name.toLowerCase().includes('protect')
        ),
        other: selectedPremedications.filter((p: Premedication) => 
          p.category === 'other' || 
          (!['antihistamine', 'h2_blocker'].includes(p.category) &&
           !p.name.toLowerCase().includes('allerg') &&
           !p.name.toLowerCase().includes('gastro') &&
           !p.name.toLowerCase().includes('protect'))
        )
      },
      solventGroups: groupedPremedications,
      clinicalNotes: "",
      preparingPharmacist: "",
      verifyingNurse: "",
      bsaCapEnabled: patientData.bsaCapEnabled,
      effectiveBsa
    };

    onGenerateSheet?.(treatmentData);
    toast.success('Fișa de tratament a fost generată cu succes');
  }, [patientData, currentCalculations, age, weight, height, effectiveBsa, creatinineClearance, sex, regimen, onGenerateSheet, persistedState.supportiveData, calculations]);

  if (!regimen) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          {t('doseCalculator.noRegimenSelected', 'Nu a fost selectat niciun regim')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calculator className="h-5 w-5" />
          {t('doseCalculator.title', 'Calcul Doze')} - {regimen.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Drug Calculations Summary - Remove patient details form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">
              {t('doseCalculator.drugCalculations', 'Calculele de doze')}
            </h3>
            <div className="flex items-center gap-2">
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdits}
                  className="flex items-center gap-1"
                >
                  Anulează
                </Button>
              )}
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={isEditing ? handleSaveEdits : () => setIsEditing(true)}
                className="flex items-center gap-1"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? 'Salvează' : 'Editează'}
              </Button>
            </div>
          </div>

          {currentCalculations.map((calc, index) => (
            <div key={`${calc.drug.name}-${index}`} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{calc.drug.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {calc.drug.dosage} {calc.drug.unit} • {calc.drug.route}
                    {calc.drug.day && ` • ${calc.drug.day}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">{t('doseCalculator.calculatedDose', 'Doză calculată')}</Label>
                  <p className="font-medium text-lg">
                    {calc.calculatedDose.toFixed(1)} mg
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reducere (%)</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={calc.reductionPercentage || 0}
                      onChange={(e) => handleEditCalculation(index, 'reductionPercentage', e.target.value)}
                      className="mt-1 h-8"
                      step="0.1"
                      placeholder="10, 25"
                      aria-label={`Introduceți procentul de reducere pentru ${calc.drug.name}`}
                    />
                  ) : (
                    <p className="font-medium">
                      {calc.reductionPercentage ? `Reducere: ${Math.abs(calc.reductionPercentage)}%` : '0%'}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('doseCalculator.finalDose', 'Doză finală')}</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={calc.finalDose}
                      onChange={(e) => handleEditCalculation(index, 'finalDose', e.target.value)}
                      className="mt-1 h-8"
                      min="0"
                      step="0.1"
                      aria-label={t('doseCalculator.finalDoseAria', 'Introduceți doza finală pentru {{drug}}', { drug: calc.drug.name })}
                    />
                  ) : (
                    <p className="font-medium text-lg text-accent">
                      {calc.finalDose.toFixed(1)} mg
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('doseCalculator.administrationDuration', 'Timp de administrare')}</Label>
                  {isEditing ? (
                    <Input
                      value={calc.administrationDuration || calc.drug.administrationDuration || ''}
                      onChange={(e) => handleEditCalculation(index, 'administrationDuration', e.target.value)}
                      className="mt-1 h-8"
                      placeholder={t('doseCalculator.administrationDurationPlaceholder', 'ex: 30 minute, 1-2 ore')}
                      aria-label={t('doseCalculator.administrationDurationAria', 'Introduceți timpul de administrare pentru {{drug}}', { drug: calc.drug.name })}
                    />
                  ) : (
                    <p className="font-medium">
                      {calc.administrationDuration || calc.drug.administrationDuration || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4 border-t">
          {/* Second Edit Button (shortcut) */}
          <div className="flex items-center gap-2">
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdits}
                className="flex items-center gap-1"
              >
                Anulează
              </Button>
            )}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={isEditing ? handleSaveEdits : () => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? 'Salvează' : 'Editează'}
            </Button>
          </div>
          
          <Button
            onClick={handleGenerateSheet}
            className="flex items-center gap-2"
            disabled={!patientData?.cnp || !patientData?.fullName || !currentCalculations.length}
          >
            <FileText className="h-4 w-4" />
            Generează fișa tratament
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const DoseCalculatorEnhanced: React.FC<DoseCalculatorEnhancedProps> = (props) => {
  return (
    <ErrorBoundary>
      <DoseCalculatorCore {...props} />
    </ErrorBoundary>
  );
};