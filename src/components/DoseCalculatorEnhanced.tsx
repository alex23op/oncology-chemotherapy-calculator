import React, { useState, useEffect, useMemo, useCallback, useReducer } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Edit, Save, AlertTriangle, CheckCircle, Undo2, History } from "lucide-react";
import { Regimen, Drug, Premedication } from "@/types/regimens";
import { SolventVolumeSelector } from "@/components/SolventVolumeSelector";
import { calculateCompleteDose, DoseCalculationResult } from "@/utils/doseCalculations";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { logger } from '@/utils/logger';
import { ErrorBoundary } from "./ErrorBoundary";

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

  // Memoized calculations based on regimen and patient data
  const initialCalculations = useMemo(() => {
    if (!regimen) return [];

    return regimen.drugs.map((drug): EnhancedDoseCalculation => {
      const result = calculateCompleteDose(
        drug,
        bsa,
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
  }, [regimen, bsa, weight, age, creatinineClearance]);

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
        {/* Patient Summary */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{t('doseCalculator.patientSummary')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">BSA:</span>
              <span className="font-medium ml-2">{bsa.toFixed(2)} m²</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('patientForm.weight')}:</span>
              <span className="font-medium ml-2">{weight} kg</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('patientForm.age')}:</span>
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