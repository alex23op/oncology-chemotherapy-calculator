import React, { useState, useEffect, useMemo, useCallback, useReducer } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calculator, Edit, Save, AlertTriangle, CheckCircle, Undo2, History, Calendar as CalendarIcon } from "lucide-react";
import { Regimen, Drug, Premedication } from "@/types/regimens";
import { SolventVolumeSelector } from "@/components/SolventVolumeSelector";
import { calculateCompleteDose, DoseCalculationResult } from "@/utils/doseCalculations";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { logger } from '@/utils/logger';
import { ErrorBoundary } from "./ErrorBoundary";
import { sanitizeCNP, validateCNP } from "@/utils/cnp";
import { format, addDays, isValid } from "date-fns";

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
}

// Enhanced state management with useReducer for undo functionality
interface CalculationState {
  calculations: EnhancedDoseCalculation[];
  history: EnhancedDoseCalculation[][];
  historyIndex: number;
}

type CalculationAction = 
  | { type: 'SET_CALCULATIONS'; payload: EnhancedDoseCalculation[] }
  | { type: 'UPDATE_CALCULATION'; payload: { index: number; updates: Partial<EnhancedDoseCalculation> } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_HISTORY' };

const calculationReducer = (state: CalculationState, action: CalculationAction): CalculationState => {
  switch (action.type) {
    case 'SET_CALCULATIONS':
      return {
        ...state,
        calculations: action.payload,
        history: [action.payload],
        historyIndex: 0
      };
    
    case 'UPDATE_CALCULATION': {
      const newCalculations = [...state.calculations];
      newCalculations[action.payload.index] = {
        ...newCalculations[action.payload.index],
        ...action.payload.updates
      };
      
      return {
        calculations: newCalculations,
        history: [...state.history.slice(0, state.historyIndex + 1), newCalculations],
        historyIndex: state.historyIndex + 1
      };
    }
    
    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state,
          calculations: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1
        };
      }
      return state;
    
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          calculations: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1
        };
      }
      return state;
    
    case 'SAVE_HISTORY': {
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), state.calculations];
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    }
    
    default:
      return state;
  }
};

// Memoized calculation history storage
const useCalculationHistory = () => {
  const [savedCalculations, setSavedCalculations] = useState<Array<{
    id: string;
    regimenName: string;
    timestamp: string;
    calculations: EnhancedDoseCalculation[];
  }>>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chemo-app-calculation-history');
      if (saved) {
        setSavedCalculations(JSON.parse(saved));
      }
    } catch (error) {
      logger.error('Failed to load calculation history:', error);
    }
  }, []);

  const saveCalculation = useCallback((regimenName: string, calculations: EnhancedDoseCalculation[]) => {
    const newEntry = {
      id: Date.now().toString(),
      regimenName,
      timestamp: new Date().toISOString(),
      calculations
    };

    const updated = [newEntry, ...savedCalculations.slice(0, 9)]; // Keep last 10
    setSavedCalculations(updated);
    
    try {
      localStorage.setItem('chemo-app-calculation-history', JSON.stringify(updated));
      toast.success('Calculul a fost salvat în istoric');
    } catch (error) {
      logger.error('Failed to save calculation history:', error);
      toast.error('Eroare la salvarea calculului');
    }
  }, [savedCalculations]);

  return { savedCalculations, saveCalculation };
};

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
  onFinalize
}) => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(calculationReducer, {
    calculations: [],
    history: [],
    historyIndex: 0
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const { savedCalculations, saveCalculation } = useCalculationHistory();

  // Patient and treatment details state
  const [patientName, setPatientName] = useState<string>("");
  const [patientCNP, setPatientCNP] = useState<string>("");
  const [cycleNumber, setCycleNumber] = useState<string>("");
  const [observationNumber, setObservationNumber] = useState<string>("");
  const [administrationDate, setAdministrationDate] = useState<Date | undefined>(undefined);
  const [nextCycleDate, setNextCycleDate] = useState<Date | undefined>(undefined);
  const [bsaThreshold, setBsaThreshold] = useState<number>(bsa);

  // Memoized calculations based on regimen and patient data (using BSA threshold)
  const initialCalculations = useMemo(() => {
    if (!regimen) return [];

    return regimen.drugs.map((drug): EnhancedDoseCalculation => {
      const result = calculateCompleteDose(
        drug,
        bsaThreshold, // Use BSA threshold instead of raw BSA
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
        selectedSolventType: drug.availableSolvents?.[0],
        selectedVolume: drug.availableVolumes?.[0],
        solvent: drug.solvent
      };
    });
  }, [regimen, bsaThreshold, weight, age, creatinineClearance]);

  // Initialize calculations when regimen changes
  useEffect(() => {
    if (initialCalculations.length > 0) {
      dispatch({ type: 'SET_CALCULATIONS', payload: initialCalculations });
    }
  }, [initialCalculations]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleDoseAdjustment = useCallback((index: number, newDose: string) => {
    const dose = parseFloat(newDose) || 0;
    const calc = state.calculations[index];
    const reductionPercentage = calc.calculatedDose > 0 
      ? Math.round(((calc.calculatedDose - dose) / calc.calculatedDose) * 100)
      : 0;

    dispatch({
      type: 'UPDATE_CALCULATION',
      payload: {
        index,
        updates: {
          adjustedDose: dose,
          finalDose: Math.round(dose * 10) / 10,
          reductionPercentage
        }
      }
    });
  }, [state.calculations]);

  const handleNotesChange = useCallback((index: number, notes: string) => {
    dispatch({
      type: 'UPDATE_CALCULATION',
      payload: { index, updates: { notes } }
    });
  }, []);

  const handleSolventTypeChange = useCallback((index: number, solventType: string) => {
    dispatch({
      type: 'UPDATE_CALCULATION',
      payload: { index, updates: { selectedSolventType: solventType } }
    });
  }, []);

  const handleVolumeChange = useCallback((index: number, volume: number) => {
    dispatch({
      type: 'UPDATE_CALCULATION',
      payload: { index, updates: { selectedVolume: volume } }
    });
  }, []);

  const handlePercentageReduction = useCallback((index: number, percentage: string) => {
    const reductionPercent = parseFloat(percentage) || 0;
    const calc = state.calculations[index];
    const reducedDose = calc.calculatedDose * (1 - reductionPercent / 100);
    
    dispatch({
      type: 'UPDATE_CALCULATION',
      payload: {
        index,
        updates: {
          reductionPercentage: reductionPercent,
          adjustedDose: reducedDose,
          finalDose: Math.round(reducedDose * 10) / 10
        }
      }
    });
  }, [state.calculations]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
    toast.info('Modificare anulată');
  }, []);

  const handleRedo = useCallback(() => {
    dispatch({ type: 'REDO' });
    toast.info('Modificare refăcută');
  }, []);

  const handleSaveCalculation = useCallback(() => {
    if (regimen) {
      saveCalculation(regimen.name, state.calculations);
    }
  }, [regimen, state.calculations, saveCalculation]);

  const getDoseReduction = useCallback((calculated: number, adjusted: number) => {
    if (calculated === 0) return 0;
    return Math.round(((calculated - adjusted) / calculated) * 100);
  }, []);

  // Validation functions
  const handleCNPChange = useCallback((value: string) => {
    const sanitized = sanitizeCNP(value);
    setPatientCNP(sanitized);
    
    if (sanitized && !validateCNP(sanitized).isValid) {
      toast.error(t('doseCalculator.invalidCNP', 'Please enter a valid 13-digit CNP'));
    }
  }, [t]);

  const validateCycleNumber = useCallback((cycle: string): boolean => {
    if (!regimen || !cycle) return true;
    const cycleNum = parseInt(cycle, 10);
    if (isNaN(cycleNum) || cycleNum < 1) return false;
    
    const cycles = regimen.cycles;
    // Handle different cycle types: number, string with range, or "Until progression"
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
      // For "Until progression" or other string values, allow any positive number
      return true;
    }
    return true;
  }, [regimen]);

  const handleCycleNumberChange = useCallback((value: string) => {
    setCycleNumber(value);
    if (value && !validateCycleNumber(value)) {
      toast.error(t('doseCalculator.invalidCycle', 'Invalid cycle number for regimen'));
    }
  }, [validateCycleNumber, t]);

  // Calculate next cycle date automatically, but allow manual override
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

  // Update next cycle date when calculated date changes, unless manually set
  useEffect(() => {
    if (calculatedNextCycleDate && !nextCycleDate) {
      setNextCycleDate(calculatedNextCycleDate);
    }
  }, [calculatedNextCycleDate, nextCycleDate]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  if (!regimen) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          {t('doseCalculator.noRegimenSelected')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calculator className="h-5 w-5" />
            {t('doseCalculator.title')} - {regimen.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={!canUndo}
              className="flex items-center gap-1"
            >
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={!canRedo}
              className="flex items-center gap-1"
            >
              <History className="h-4 w-4" />
              Redo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveCalculation}
              className="flex items-center gap-1"
            >
              <History className="h-4 w-4" />
              Salvează
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Patient and Treatment Details - Single Form Layout */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-primary">{t('doseCalculator.patientDetailsTitle', 'Detalii Pacient și Tratament')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <Label htmlFor="patientName">{t('doseCalculator.fullNameLabel', 'Nume și prenume')}</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t('doseCalculator.fullNamePlaceholder', 'Introduceți numele complet')}
                aria-label={t('doseCalculator.fullNameLabel', 'Nume și prenume')}
                className="mt-1"
                required
              />
            </div>

            {/* CNP */}
            <div>
              <Label htmlFor="cnp">{t('doseCalculator.cnpLabel', 'CNP')} *</Label>
              <Input
                id="cnp"
                value={patientCNP}
                onChange={(e) => handleCNPChange(e.target.value)}
                placeholder={t('doseCalculator.cnpPlaceholder', 'Introduceți CNP-ul de 13 cifre')}
                aria-label={t('doseCalculator.cnpLabel', 'CNP')}
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
              <Label htmlFor="observationNumber">{t('doseCalculator.foNumberLabel', 'Număr F.O.')} *</Label>
              <Input
                id="observationNumber"
                value={observationNumber}
                onChange={(e) => setObservationNumber(e.target.value)}
                placeholder={t('doseCalculator.foNumberPlaceholder', 'Introduceți numărul foii de observație')}
                aria-label={t('doseCalculator.foNumberLabel', 'Numărul foii de observație')}
                className="mt-1"
                required
              />
            </div>

            {/* Cycle Number */}
            <div>
              <Label htmlFor="cycleNumber">{t('doseCalculator.cycleLabel', 'Număr ciclu')} *</Label>
              <Input
                id="cycleNumber"
                type="number"
                value={cycleNumber}
                onChange={(e) => handleCycleNumberChange(e.target.value)}
                placeholder="1"
                aria-label={t('doseCalculator.cycleLabel', 'Număr ciclu')}
                className="mt-1"
                min="1"
                required
              />
              {regimen && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t('doseCalculator.metrics.cycles', 'Total cicluri')}: {regimen.cycles}
                </p>
              )}
              {cycleNumber && !validateCycleNumber(cycleNumber) && (
                <p className="text-sm text-destructive mt-1">
                  {t('doseCalculator.invalidCycle', 'Număr ciclu invalid pentru regim')}
                </p>
              )}
            </div>
          </div>

          {/* Date Section - Full Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Administration Date */}
            <div>
              <Label className="text-base font-medium">{t('doseCalculator.treatmentDateLabel', 'Data administrării')} *</Label>
              <div className="mt-2">
                <Calendar
                  mode="single"
                  selected={administrationDate}
                  onSelect={setAdministrationDate}
                  className="rounded-md border w-fit pointer-events-auto"
                  aria-label={t('doseCalculator.treatmentDateLabel', 'Data administrării')}
                />
              </div>
            </div>

            {/* Next Cycle Date - Manual Override */}
            <div>
              <Label className="text-base font-medium">{t('doseCalculator.nextCycleDateLabel', 'Data următorului ciclu')}</Label>
              <div className="mt-2 space-y-2">
                <Calendar
                  mode="single"
                  selected={nextCycleDate}
                  onSelect={setNextCycleDate}
                  className="rounded-md border w-fit pointer-events-auto"
                  aria-label={t('doseCalculator.nextCycleDateLabel', 'Data următorului ciclu')}
                />
                {calculatedNextCycleDate && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    <span>{t('doseCalculator.suggestedNextCycle', 'Sugerat automat')}: </span>
                    <span className="font-medium">{format(calculatedNextCycleDate, "PPP")}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNextCycleDate(calculatedNextCycleDate)}
                      className="ml-2 h-6 px-2 text-xs"
                    >
                      {t('doseCalculator.useCalculated', 'Folosește')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BSA Threshold */}
          <div className="border-t pt-4">
            <Label htmlFor="bsaThreshold" className="text-base font-medium">{t('doseCalculator.bsaThreshold', 'Prag BSA (m²)')}</Label>
            <div className="flex items-center gap-4 mt-2">
              <Input
                id="bsaThreshold"
                type="number"
                value={bsaThreshold}
                onChange={(e) => setBsaThreshold(parseFloat(e.target.value) || bsa)}
                placeholder={bsa.toString()}
                aria-label={t('doseCalculator.bsaThreshold', 'Prag BSA')}
                className="w-32"
                step="0.01"
                min="0.5"
                max="3.0"
              />
              <div className="text-sm text-muted-foreground">
                {t('doseCalculator.bsaThresholdHelp', 'BSA calculată: {bsa} m² | Prag utilizat pentru calcule: {threshold} m²', { 
                  bsa: bsa.toFixed(2), 
                  threshold: bsaThreshold.toFixed(2) 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Summary */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{t('doseCalculator.patientSummary', 'Rezumat Pacient')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">BSA calculată:</span>
              <span className="font-medium ml-2">{bsa.toFixed(2)} m²</span>
            </div>
            <div>
              <span className="text-muted-foreground">BSA folosită:</span>
              <span className="font-medium ml-2 text-accent">{bsaThreshold.toFixed(2)} m²</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('patientForm.weight', 'Greutate')}:</span>
              <span className="font-medium ml-2">{weight} kg</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('patientForm.age', 'Vârstă')}:</span>
              <span className="font-medium ml-2">{age}</span>
            </div>
            <div>
              <span className="text-muted-foreground">CrCl:</span>
              <span className="font-medium ml-2">{creatinineClearance} mL/min</span>
            </div>
          </div>
        </div>

        {/* Drug Calculations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t('doseCalculator.drugCalculations')}</h3>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? t('doseCalculator.save') : t('doseCalculator.edit')}
            </Button>
          </div>

          {state.calculations.map((calc, index) => (
            <div key={`${calc.drug.name}-${index}`} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{calc.drug.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {calc.drug.dosage} {calc.drug.unit} • {calc.drug.route}
                    {calc.drug.day && ` • ${calc.drug.day}`}
                  </p>
                </div>
                {calc.drug.drugClass && (
                  <Badge variant="outline">{calc.drug.drugClass}</Badge>
                )}
              </div>

              {/* Dose Alerts */}
              {calc.doseAlert && (
                <Alert variant="destructive" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium">{calc.doseAlert.warning}</div>
                    {calc.doseAlert.suggestedAction && (
                      <div className="text-sm mt-1">{calc.doseAlert.suggestedAction}</div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {calc.concentrationAlert && (
                <Alert variant="destructive" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{calc.concentrationAlert}</AlertDescription>
                </Alert>
              )}

              {/* Dose Information */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">{t('doseCalculator.calculatedDose')}</Label>
                  <p className="font-medium text-lg">
                    {calc.calculatedDose.toFixed(1)} mg
                  </p>
                </div>

                <div>
                  <Label className="text-muted-foreground">{t('doseCalculator.reductionPercent')}</Label>
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
                    {isEditing ? t('doseCalculator.adjustedDose') : t('doseCalculator.finalDose')}
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
                  <Label className="text-muted-foreground">{t('doseCalculator.totalReduction')}</Label>
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
                <div className="mt-3">
                  <Label className="text-muted-foreground">{t('doseCalculator.notes', { defaultValue: 'Notes' })}</Label>
                  <Input
                    placeholder={t('doseCalculator.addNotesPlaceholder', { defaultValue: 'Add notes for dose adjustment...' })}
                    value={calc.notes}
                    onChange={(e) => handleNotesChange(index, e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              {calc.notes && !isEditing && (
                <div className="bg-muted/50 p-2 rounded text-sm mt-3">
                  <strong>{t('doseCalculator.notes', { defaultValue: 'Notes' })}:</strong> {calc.notes}
                </div>
              )}

              {/* Solvent and Volume Selection */}
              <SolventVolumeSelector
                drug={calc.drug}
                selectedSolventType={calc.selectedSolventType}
                selectedVolume={calc.selectedVolume}
                onSolventTypeChange={(solventType) => handleSolventTypeChange(index, solventType)}
                onVolumeChange={(volume) => handleVolumeChange(index, volume)}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>

        {/* Clinical Notes */}
        <div>
          <Label htmlFor="clinicalNotes">{t('doseCalculator.clinicalNotes')}</Label>
          <Textarea
            id="clinicalNotes"
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder={t('doseCalculator.clinicalNotesPlaceholder')}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Calculation History */}
        {savedCalculations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Istoric calcule</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {savedCalculations.slice(0, 5).map((entry) => (
                <div key={entry.id} className="text-sm p-2 bg-muted/30 rounded">
                  <div className="font-medium">{entry.regimenName}</div>
                  <div className="text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString('ro-RO')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            onClick={() => onExport?.(state.calculations)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {t('doseCalculator.exportCalculations')}
          </Button>
          <Button
            onClick={() => onFinalize?.(state.calculations)}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {t('doseCalculator.finalizeAndContinue')}
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