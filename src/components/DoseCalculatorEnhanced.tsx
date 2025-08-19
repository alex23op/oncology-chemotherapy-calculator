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
import { Regimen, Drug } from "@/types/regimens";
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
  
  // Patient and treatment details state
  const [patientName, setPatientName] = useState<string>("");
  const [patientCNP, setPatientCNP] = useState<string>("");
  const [cycleNumber, setCycleNumber] = useState<string>("");
  const [observationNumber, setObservationNumber] = useState<string>("");
  const [administrationDate, setAdministrationDate] = useState<Date>(new Date());
  const [nextCycleDate, setNextCycleDate] = useState<Date | undefined>(undefined);
  const [bsaCapEnabled, setBsaCapEnabled] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCalculations, setEditedCalculations] = useState<EnhancedDoseCalculation[]>([]);

  // Calculate effective BSA (with cap if enabled)
  const effectiveBsa = useMemo(() => {
    return bsaCapEnabled ? Math.min(bsa, 2.0) : bsa;
  }, [bsa, bsaCapEnabled]);

  // Calculate next cycle date automatically
  const calculatedNextCycleDate = useMemo(() => {
    if (!regimen || !administrationDate || !isValid(administrationDate)) return null;
    
    const schedule = regimen.schedule.toLowerCase();
    let daysToAdd = 14; // Default: 2 weeks
    
    if (schedule.includes("3 weeks") || schedule.includes("21 days")) {
      daysToAdd = 21;
    } else if (schedule.includes("4 weeks") || schedule.includes("28 days")) {
      daysToAdd = 28;
    } else if (schedule.includes("weekly") || schedule.includes("7 days")) {
      daysToAdd = 7;
    }
    
    return addDays(administrationDate, daysToAdd);
  }, [regimen, administrationDate]);

  // Update next cycle date when calculated date changes
  useEffect(() => {
    if (calculatedNextCycleDate && !nextCycleDate) {
      setNextCycleDate(calculatedNextCycleDate);
    }
  }, [calculatedNextCycleDate]);

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

  // Validation functions
  const handleCNPChange = useCallback((value: string) => {
    const sanitized = sanitizeCNP(value);
    setPatientCNP(sanitized);
    
    if (sanitized && !validateCNP(sanitized).isValid) {
      toast.error(t('doseCalculator.invalidCNP', 'Vă rugăm să introduceți un CNP valid de 13 cifre'));
    }
  }, [t]);

  const validateCycleNumber = useCallback((cycle: string): boolean => {
    if (!regimen || !cycle) return true;
    const cycleNum = parseInt(cycle, 10);
    if (isNaN(cycleNum) || cycleNum < 1) return false;
    
    const cycles = regimen.cycles;
    if (typeof cycles === "number") {
      return cycleNum <= cycles;
    } else if (typeof cycles === "string") {
      if (cycles.includes("-")) {
        const parts = cycles.split("-");
        if (parts.length === 2) {
          const maxCycle = parseInt(parts[1], 10);
          if (!isNaN(maxCycle)) {
            return cycleNum <= maxCycle;
          }
        }
      }
      return true;
    }
    return true;
  }, [regimen]);

  const handleCycleNumberChange = useCallback((value: string) => {
    setCycleNumber(value);
    if (value && !validateCycleNumber(value)) {
      toast.error(t('doseCalculator.invalidCycle', 'Număr ciclu invalid pentru regim'));
    }
  }, [validateCycleNumber, t]);

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
    if (!patientCNP) {
      toast.error('Vă rugăm să introduceți CNP-ul pacientului');
      return;
    }
    
    if (!patientName) {
      toast.error('Vă rugăm să introduceți numele pacientului');
      return;
    }

    if (!calculations.length) {
      toast.error('Nu există calcule de doze disponibile');
      return;
    }

    const treatmentData = {
      patient: {
        fullName: patientName,
        cnp: patientCNP,
        foNumber: observationNumber,
        cycleNumber: parseInt(cycleNumber) || 1,
        treatmentDate: administrationDate.toISOString(),
        nextCycleDate: nextCycleDate?.toISOString(),
        age,
        weight,
        height,
        bsa: effectiveBsa,
        creatinineClearance,
        sex
      },
      regimen,
      calculatedDrugs: Array.isArray(currentCalculations) ? currentCalculations.map(calc => ({
        ...calc.drug,
        calculatedDose: calc.calculatedDose,
        finalDose: calc.finalDose,
        adjustmentNotes: calc.adjustmentNotes,
        preparationInstructions: calc.preparationInstructions,
        administrationDuration: calc.administrationDuration || calc.drug.administrationDuration,
        solvent: calc.selectedSolventType || calc.solvent || 'Normal Saline 0.9%'
      })) : [],
      premedications: {
        antiemetics: [],
        infusionReactionProphylaxis: [],
        gastroprotection: [],
        organProtection: [],
        other: []
      },
      solventGroups: { groups: [], individual: [] },
      clinicalNotes: "",
      preparingPharmacist: "",
      verifyingNurse: "",
      administrationDate,
      nextCycleDate,
      bsaCapEnabled,
      effectiveBsa
    };

    onGenerateSheet?.(treatmentData);
    toast.success('Fișa de tratament a fost generată cu succes');
  }, [patientCNP, patientName, currentCalculations, observationNumber, cycleNumber, age, weight, height, effectiveBsa, creatinineClearance, sex, regimen, administrationDate, nextCycleDate, bsaCapEnabled, onGenerateSheet]);

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
        {/* Patient Details Form */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-primary">
            {t('doseCalculator.patientDetailsTitle', 'Detalii Pacient și Tratament')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <Label htmlFor="patientName">
                {t('doseCalculator.fullNameLabel', 'Nume și prenume')} *
              </Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t('doseCalculator.fullNamePlaceholder', 'Introduceți numele complet')}
                className="mt-1"
                required
              />
            </div>

            {/* CNP */}
            <div>
              <Label htmlFor="cnp">
                {t('doseCalculator.cnpLabel', 'CNP')} *
              </Label>
              <Input
                id="cnp"
                value={patientCNP}
                onChange={(e) => handleCNPChange(e.target.value)}
                placeholder={t('doseCalculator.cnpPlaceholder', 'Introduceți CNP-ul de 13 cifre')}
                className="mt-1"
                maxLength={13}
                required
              />
              {patientCNP && !validateCNP(patientCNP).isValid && (
                <p className="text-sm text-destructive mt-1">
                  {t('doseCalculator.invalidCNP', 'Vă rugăm să introduceți un CNP valid de 13 cifre')}
                </p>
              )}
            </div>

            {/* Observation Number */}
            <div>
              <Label htmlFor="observationNumber">
                {t('doseCalculator.foNumberLabel', 'Număr F.O.')} *
              </Label>
              <Input
                id="observationNumber"
                value={observationNumber}
                onChange={(e) => setObservationNumber(e.target.value)}
                placeholder={t('doseCalculator.foNumberPlaceholder', 'Introduceți numărul foii de observație')}
                className="mt-1"
                required
              />
            </div>

            {/* Cycle Number */}
            <div>
              <Label htmlFor="cycleNumber">
                {t('doseCalculator.cycleLabel', 'Număr ciclu')} *
              </Label>
              <Input
                id="cycleNumber"
                type="number"
                value={cycleNumber}
                onChange={(e) => handleCycleNumberChange(e.target.value)}
                placeholder="1"
                className="mt-1"
                min="1"
                required
              />
              {regimen && (
                <p className="text-sm text-muted-foreground mt-1">
                  Total cicluri: {regimen.cycles}
                </p>
              )}
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Administration Date */}
            <div>
              <Label>
                {t('doseCalculator.treatmentDateLabel', 'Data administrării')} *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !administrationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {administrationDate ? format(administrationDate, "dd/MM/yyyy") : "Selectați data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={administrationDate}
                    onSelect={(date) => date && setAdministrationDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Next Cycle Date */}
            <div>
              <Label>
                {t('doseCalculator.nextCycleDateLabel', 'Data următorului ciclu')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !nextCycleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextCycleDate ? format(nextCycleDate, "dd/MM/yyyy") : "Selectați data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={nextCycleDate}
                    onSelect={setNextCycleDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {calculatedNextCycleDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Sugerat automat: {format(calculatedNextCycleDate, "dd/MM/yyyy")}
                </p>
              )}
            </div>
          </div>

          {/* BSA Cap Option */}
          <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
            <Checkbox
              id="bsaCapEnabled"
              checked={bsaCapEnabled}
              onCheckedChange={(checked) => setBsaCapEnabled(checked === true)}
            />
            <Label htmlFor="bsaCapEnabled" className="text-sm">
              Aplică prag BSA 2.0 m²
            </Label>
            <div className="ml-auto text-sm text-muted-foreground">
              BSA calculată: {bsa.toFixed(2)} m² | 
              BSA folosită: {effectiveBsa.toFixed(2)} m²
            </div>
          </div>
        </div>

        {/* Drug Calculations Summary */}
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

              {/* Solvent and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">{t('doseCalculator.solvent', 'Solvent')}</Label>
                  {isEditing ? (
                    <select
                      value={calc.solvent || 'Soluție NaCl 0.9% 250ml'}
                      onChange={(e) => handleEditCalculation(index, 'solvent', e.target.value)}
                      className="w-full mt-1 h-8 px-3 rounded-md border border-input bg-background text-sm"
                      aria-label={t('doseCalculator.solventAria', 'Selectați solventul pentru {{drug}}', { drug: calc.drug.name })}
                    >
                      <option value="Soluție glucoză 5% 100ml">{t('doseCalculator.solventGlucose100', 'Soluție glucoză 5% 100ml')}</option>
                      <option value="Soluție glucoză 5% 250ml">{t('doseCalculator.solventGlucose250', 'Soluție glucoză 5% 250ml')}</option>
                      <option value="Soluție glucoză 5% 500ml">{t('doseCalculator.solventGlucose500', 'Soluție glucoză 5% 500ml')}</option>
                      <option value="Soluție NaCl 0.9% 100ml">{t('doseCalculator.solventNaCl100', 'Soluție NaCl 0.9% 100ml')}</option>
                      <option value="Soluție NaCl 0.9% 250ml">{t('doseCalculator.solventNaCl250', 'Soluție NaCl 0.9% 250ml')}</option>
                      <option value="Soluție NaCl 0.9% 500ml">{t('doseCalculator.solventNaCl500', 'Soluție NaCl 0.9% 500ml')}</option>
                      <option value="Water for Injection">{t('doseCalculator.solventWater', 'Apă pentru preparate injectabile')}</option>
                    </select>
                  ) : (
                    <p className="font-medium mt-1">
                      {calc.solvent || 'Soluție NaCl 0.9% 250ml'}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('doseCalculator.notes', 'Note')}</Label>
                  {isEditing ? (
                    <Input
                      value={calc.notes || ''}
                      onChange={(e) => handleEditCalculation(index, 'notes', e.target.value)}
                      className="mt-1 h-8"
                      placeholder={t('doseCalculator.notesPlaceholder', 'Adăugați note pentru ajustarea dozei...')}
                      aria-label={t('doseCalculator.notesAria', 'Adăugați note pentru {{drug}}', { drug: calc.drug.name })}
                    />
                  ) : (
                    <p className="font-medium mt-1">
                      {calc.notes || '-'}
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
            disabled={!patientCNP || !patientName || !currentCalculations.length}
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