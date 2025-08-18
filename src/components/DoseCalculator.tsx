import { useState, useEffect, Suspense, lazy } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Edit, Save, FileText, Download, Printer, FileCheck, Shield, Calendar } from "lucide-react";
import { Regimen, Drug, Premedication } from "@/types/regimens";
import { SafetyAlertsPanel } from "./SafetyAlertsPanel";
import { DatePickerField } from "./DatePickerField";
import { MobileActionBar } from "./MobileActionBar";
import { getSolventI18nKey } from '@/types/ui';
import { logger } from '@/utils/logger';
import { SolventVolumeSelector } from "@/components/SolventVolumeSelector";
import { DraftCalculation, LocalPremedAgent } from '@/types/enhanced';

const TreatmentCalendarLazy = lazy(() => import("./TreatmentCalendar").then(m => ({ default: m.TreatmentCalendar })));
const ClinicalTreatmentSheetLazy = lazy(() => import("./ClinicalTreatmentSheet").then(m => ({ default: m.ClinicalTreatmentSheet })));
const CompactClinicalTreatmentSheetLazy = lazy(() => import("./CompactClinicalTreatmentSheet").then(m => ({ default: m.CompactClinicalTreatmentSheet })));

import { AntiemeticAgent } from "@/types/emetogenicRisk";
import { TreatmentData, PatientInfo, CalculatedDrug } from "@/types/clinicalTreatment";
import { generateClinicalTreatmentPDF } from "@/utils/pdfExport";
import { usePrint } from "@/hooks/usePrint";
import { toISODate, parseISODate } from "@/utils/dateFormat";
import { ClinicalSafetyEngine, SafetyAlert } from "@/utils/clinicalSafetyEngine";
import { getMonitoringParametersForRegimen } from "@/data/monitoringProtocols";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { SolventType, AVAILABLE_SOLVENTS } from "@/types/solvents";
import { useSmartNav } from '@/context/SmartNavContext';
import { drugLimits, checkDoseLimit } from "@/data/drugLimits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface DoseCalculatorProps {
  regimen: Regimen | null;
  bsa: number;
  weight: number;
  height: number;
  age: number;
  sex: string;
  creatinineClearance: number;
  biomarkerStatus?: Record<string, string>;
  currentMedications?: string[];
  onExport?: (calculations: DoseCalculation[]) => void;
  onFinalize?: (data: TreatmentData) => void;
  onGoToReview?: () => void;
  supportiveCare?: {
    emetogenicRiskLevel: "high" | "moderate" | "low" | "minimal";
    selectedPremedications: Premedication[];
    selectedAntiemetics: AntiemeticAgent[];
    groupedPremedications?: any;
  };
}

interface DoseCalculation {
  drug: Drug;
  calculatedDose: number;
  adjustedDose: number;
  finalDose: number;
  notes: string;
  selected: boolean;
  reductionPercentage: number;
  administrationDuration?: string;
  solvent?: string;
  selectedSolventType?: string;
  selectedVolume?: number;
  doseAlert?: {
    isExceeded: boolean;
    warning?: string;
    suggestedAction?: string;
  };
}

export const DoseCalculator = ({ 
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
  onGoToReview,
  supportiveCare
}: DoseCalculatorProps) => {
  const [calculations, setCalculations] = useState<DoseCalculation[]>([]);
  const [selectedPremedications, setSelectedPremedications] = useState<Premedication[]>([]);
  const [emetogenicRiskLevel, setEmetogenicRiskLevel] = useState<"high" | "moderate" | "low" | "minimal">("minimal");
  const [selectedAntiemetics, setSelectedAntiemetics] = useState<AntiemeticAgent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [cnp, setCnp] = useState<string>('');
  const [foNumber, setFoNumber] = useState<string>('');
  const [cycleNumber, setCycleNumber] = useState<number>(1);
  const [treatmentDate, setTreatmentDate] = useState<string>(toISODate(new Date()));
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [showTreatmentSheet, setShowTreatmentSheet] = useState<boolean>(false);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [showSafetyPanel, setShowSafetyPanel] = useState<boolean>(true);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [bsaCap, setBsaCap] = useState<number>(2.0);
  const [useBsaCap, setUseBsaCap] = useState<boolean>(false);
  const [printOrientation, setPrintOrientation] = useState<'portrait' | 'landscape'>(() =>
    (localStorage.getItem('pdfOrientation') as 'portrait' | 'landscape') || 'portrait'
  );

const { componentRef, printTreatmentSheet } = usePrint(undefined, { orientation: printOrientation });
const { t } = useTranslation();
const { calendarFirst } = useSmartNav();

// Additional patient details
const [patientFullName, setPatientFullName] = useState<string>('');
const [nextCycleDate, setNextCycleDate] = useState<string>('');
const [autoNextCycle, setAutoNextCycle] = useState<boolean>(true);

// Helper to parse cycle length from regimen schedule (e.g., "q21")
const getCycleLengthDays = (schedule: string | undefined): number => {
  if (!schedule) return 21;
  const match = schedule.match(/q(\d+)/i);
  return match ? parseInt(match[1]) : 21;
};


  useEffect(() => {
    logger.debug("DoseCalculator useEffect triggered", { 
      component: "DoseCalculator",
      data: { regimen: regimen?.name, bsa }
    });
    
    if (regimen && bsa > 0) {
      const effectiveBsa = useBsaCap ? Math.min(bsa, bsaCap) : bsa;
      
      const newCalculations = regimen.drugs.map((drug, drugIndex) => {
        let calculatedDose = 0;
        let doseAlert = { isExceeded: false }; // Declare at function scope
        
        try {
          if (drug.unit === "mg/m²") {
            calculatedDose = parseFloat(drug.dosage) * effectiveBsa;
          } else if (drug.unit === "mg/kg") {
            calculatedDose = parseFloat(drug.dosage) * weight;
          } else if (drug.dosage.includes("AUC")) {
            // Calvert formula for carboplatin: Dose = AUC × (GFR + 25)
            const aucValue = parseFloat(drug.dosage.replace("AUC ", ""));
            calculatedDose = aucValue * (creatinineClearance + 25);
          } else {
            calculatedDose = parseFloat(drug.dosage) || 0;
          }

          // Apply renal dose adjustments
          if (drug.name === 'Cisplatin' && creatinineClearance < 60) {
            calculatedDose *= 0.75; // 25% reduction
          } else if (drug.name === 'Carboplatin' && creatinineClearance < 60) {
            // AUC already accounts for renal function in Calvert formula
          }

          // Apply age-based adjustments for elderly patients
          if (age >= 75 && drug.drugClass === 'chemotherapy') {
            calculatedDose *= 0.9; // 10% reduction for elderly
          }

          // Check dose limits and create alert
          doseAlert = checkDoseLimit(drug.name, calculatedDose, regimen.schedule);

        } catch (error) {
          logger.error("Error calculating dose for drug", {
            component: "DoseCalculator",
            data: { drugName: drug.name, error: error.message }
          });
          calculatedDose = 0;
          doseAlert = { isExceeded: false }; // Assign, don't declare
        }

        // Preserve existing user modifications if this drug already exists
        const existingCalc = calculations.find(calc => calc.drug.name === drug.name);
        if (existingCalc) {
          logger.debug("Preserving user modifications", {
            component: "DoseCalculator", 
            data: { 
              drugName: drug.name,
              selected: existingCalc.selected,
              adjustedDose: existingCalc.adjustedDose,
              notes: existingCalc.notes,
              reductionPercentage: existingCalc.reductionPercentage
            }
          });
          
          return {
            drug,
            calculatedDose,
            adjustedDose: existingCalc.adjustedDose, // Preserve user's dose adjustment
            finalDose: Math.round(existingCalc.adjustedDose * 10) / 10,
            notes: existingCalc.notes, // Preserve user's notes
            selected: existingCalc.selected, // Preserve user's selection
            reductionPercentage: existingCalc.reductionPercentage, // Preserve user's reduction
            administrationDuration: existingCalc.administrationDuration ?? drug.administrationDuration,
            solvent: existingCalc.solvent,
            selectedSolventType: existingCalc.selectedSolventType,
            selectedVolume: existingCalc.selectedVolume,
            doseAlert: existingCalc.doseAlert || doseAlert,
          };
        }

        // Default for new drugs
        return {
          drug,
          calculatedDose,
          adjustedDose: calculatedDose,
          finalDose: Math.round(calculatedDose * 10) / 10, // Round to 1 decimal
          notes: "",
          selected: true,
          reductionPercentage: 0,
          administrationDuration: drug.administrationDuration,
          solvent: undefined,
          selectedSolventType: drug.availableSolvents?.[0],
          selectedVolume: drug.availableVolumes?.[0],
          doseAlert: doseAlert,
        };
      });
      
      logger.debug("Calculated doses with preserved user modifications", {
        component: "DoseCalculator",
        data: { calculationsCount: newCalculations.length }
      });
      setCalculations(newCalculations);
      
      // Initialize with existing regimen premedications if any (only if not already set)
      if (selectedPremedications.length === 0) {
        setSelectedPremedications(regimen.premedications || []);
      }

      // Perform safety checks
      if (newCalculations.length > 0) {
        performSafetyChecks(regimen, newCalculations);
      }
    } else {
      logger.debug("Clearing calculations - no regimen or invalid BSA", { component: 'DoseCalculator', action: 'clearCalculations' });
      setCalculations([]);
      setSafetyAlerts([]);
    }
}, [regimen, bsa, weight, creatinineClearance, age, useBsaCap, bsaCap, biomarkerStatus]);

// Respect SmartNav setting for calendar-first experience
useEffect(() => {
  setShowCalendar(calendarFirst);
}, [calendarFirst]);

// Persist orientation preference
useEffect(() => {
  try { localStorage.setItem('pdfOrientation', printOrientation); } catch {}
}, [printOrientation]);

// One-time migration to sanitize legacy drafts in localStorage
useEffect(() => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('draft:doseCalc:'))
      .forEach((k) => {
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const draft = JSON.parse(raw);
        if (Array.isArray(draft.calculations)) {
          draft.calculations = draft.calculations.map((c: DraftCalculation) => ({
            ...c,
            solvent: typeof c?.solvent === 'string' ? c.solvent : undefined,
            administrationDuration: typeof c?.administrationDuration === 'string' ? c.administrationDuration : undefined,
            notes: typeof c?.notes === 'string' ? c.notes : '',
          }));
          localStorage.setItem(k, JSON.stringify(draft));
        }
      });
  } catch {}
}, []);


// Load draft for this regimen if available (excluding CNP)
useEffect(() => {
  if (!regimen) return;
  try {
    const raw = localStorage.getItem(`draft:doseCalc:${regimen.id}`);
    if (raw) {
      const draft = JSON.parse(raw);
// Reset CNP to empty when loading a new regimen
      if (draft.patientFullName) setPatientFullName(draft.patientFullName);
      if (draft.foNumber) setFoNumber(draft.foNumber);
      if (draft.cycleNumber) setCycleNumber(draft.cycleNumber);
      if (draft.treatmentDate) setTreatmentDate(draft.treatmentDate);
      if (draft.nextCycleDate) setNextCycleDate(draft.nextCycleDate);
      if (draft.autoNextCycle !== undefined) setAutoNextCycle(draft.autoNextCycle);
      if (draft.clinicalNotes) setClinicalNotes(draft.clinicalNotes);
      if (draft.bsaCap !== undefined) setBsaCap(draft.bsaCap);

      // Validate and sanitize calculations
      if (draft.calculations && Array.isArray(draft.calculations)) {
        const sanitizedCalculations = draft.calculations.map(c => ({
          ...c, 
          finalDose: parseFloat(c.finalDose) || 0,
          adjustedDose: parseFloat(c.adjustedDose) || 0,
          notes: typeof c.notes === 'string' ? c.notes : ''
        }));
        setCalculations(sanitizedCalculations);
        
        // persist sanitized draft back to storage (without CNP)
        try { 
          const draftToSave = { ...draft, calculations: sanitizedCalculations };
          delete draftToSave.cnp; // Remove CNP from saved draft
          localStorage.setItem(`draft:doseCalc:${regimen.id}`, JSON.stringify(draftToSave)); 
        } catch {} 
      }
    }
    // Always reset CNP when switching regimens to prevent persistence between patients
    setCnp('');
  } catch (e) {
    logger.warn('Failed to load draft', { component: 'DoseCalculator', action: 'loadDraft', error: e });
  }
}, [regimen]);

// Autosave draft when key fields change (excluding CNP to prevent persistence between patients)
useEffect(() => {
  if (!regimen) return;
  const payload = {
    // CNP is deliberately excluded from autosave to prevent persistence between patients
    patientFullName, foNumber, cycleNumber, treatmentDate, nextCycleDate, autoNextCycle, 
    clinicalNotes, bsaCap, selectedPremedications, selectedAntiemetics, calculations
  };
  try {
    localStorage.setItem(`draft:doseCalc:${regimen.id}`, JSON.stringify(payload));
  } catch {}
}, [regimen?.id, patientFullName, foNumber, cycleNumber, treatmentDate, nextCycleDate, autoNextCycle, clinicalNotes, bsaCap, selectedPremedications, selectedAntiemetics, calculations]);


// Auto-calculate next cycle date based on regimen schedule and treatment date
useEffect(() => {
  if (regimen && treatmentDate && autoNextCycle) {
    const base = new Date(treatmentDate);
    const days = getCycleLengthDays(regimen.schedule);
    const next = new Date(base);
    next.setDate(base.getDate() + days);
    setNextCycleDate(toISODate(next));
  }
}, [regimen, treatmentDate, autoNextCycle]);
  const performSafetyChecks = (regimen: Regimen, newCalculations: DoseCalculation[]) => {
    const patient: PatientInfo = {
      cnp: cnp || 'temp-cnp',
      foNumber: foNumber || undefined,
      weight,
      height,
      age,
      sex,
      bsa,
      creatinineClearance,
      cycleNumber,
      treatmentDate,
    };

    const calculatedDoses = newCalculations.reduce((acc, calc) => {
      acc[calc.drug.name] = calc.calculatedDose;
      return acc;
    }, {} as Record<string, number>);

    const alerts = ClinicalSafetyEngine.performComprehensiveSafetyCheck(
      regimen,
      patient,
      calculatedDoses,
      biomarkerStatus,
      currentMedications
    );

    setSafetyAlerts(alerts);
  };

  const handleDoseAdjustment = (index: number, newDose: string) => {
    logger.debug("Dose adjustment", { component: 'DoseCalculator', action: 'adjustDose', index, newDose });
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

  const handleAdminDurationChange = (index: number, value: string) => {
    const updated = [...calculations];
    updated[index].administrationDuration = value;
    setCalculations(updated);
  };

  const handleSolventTypeChange = (index: number, solventType: string) => {
    const updated = [...calculations];
    updated[index].selectedSolventType = solventType;
    setCalculations(updated);
  };

  const handleVolumeChange = (index: number, volume: number) => {
    const updated = [...calculations];
    updated[index].selectedVolume = volume;
    setCalculations(updated);
  };

  const handleSolventChange = (index: number, value: string) => {
    const updated = [...calculations];
    updated[index].solvent = value || undefined;
    setCalculations(updated);
  };

  const handleDrugSelection = (index: number, selected: boolean) => {
    logger.debug("Drug selection changed", { component: 'DoseCalculator', action: 'selectDrug', index, selected });
    const updatedCalculations = [...calculations];
    updatedCalculations[index].selected = selected;
    setCalculations(updatedCalculations);
  };

  const handlePremedSelectionsChange = (premedications: Premedication[]) => {
    logger.debug("Premedications changed", { component: 'DoseCalculator', action: 'changePremedications', count: premedications.length });
    setSelectedPremedications(premedications);
  };

  const handleEmetogenicRiskChange = (riskLevel: "high" | "moderate" | "low" | "minimal") => {
    logger.debug("Emetogenic risk level changed", { component: 'DoseCalculator', action: 'changeEmetogenicRisk', riskLevel });
    setEmetogenicRiskLevel(riskLevel);
  };

  const handleAntiemeticProtocolChange = (agents: AntiemeticAgent[]) => {
    logger.debug("Antiemetic agents selected", { component: 'DoseCalculator', action: 'selectAntiemetics', count: agents.length });
    setSelectedAntiemetics(agents);
  };

  const validateSolventConcentration = (drug: Drug, dose: number, volume: number): string | null => {
    // Validate concentration limits for specific drugs
    if (drug.name === "Paclitaxel") {
      const concentration = dose / volume;
      if (concentration > 1.2) {
        return `Concentrația Paclitaxel (${concentration.toFixed(2)} mg/mL) depășește limita de 1.2 mg/mL`;
      }
      if (concentration < 0.3) {
        return `Concentrația Paclitaxel (${concentration.toFixed(2)} mg/mL) este sub limita minimă de 0.3 mg/mL`;
      }
    }
    
    if (drug.name === "Oxaliplatin" && volume < 250) {
      return "Volumul minim pentru Oxaliplatin este 250 mL";
    }
    
    return null;
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
      cnp,
      foNumber: foNumber || undefined,
      fullName: patientFullName || undefined,
      weight,
      height,
      age,
      sex,
      bsa,
      creatinineClearance,
      cycleNumber,
      treatmentDate,
      nextCycleDate: nextCycleDate || undefined,
    };

    const calculatedDrugs: CalculatedDrug[] = calculations
      .filter(calc => calc.selected)  // Only include selected drugs
      .map((calc) => ({
        ...calc.drug,
        calculatedDose: `${calc.calculatedDose.toFixed(1)} mg`,
        finalDose: `${calc.finalDose} mg`,
        adjustmentNotes: calc.notes,
        preparationInstructions: calc.drug.dilution,
        administrationDuration: calc.administrationDuration || calc.drug.administrationDuration,
        solvent: (calc.solvent && AVAILABLE_SOLVENTS.includes(calc.solvent as SolventType)) ? calc.solvent as SolventType : null,
      }));

    const toDoseWithUnit = (dosage?: string, unit?: string) => {
      if (!dosage) return '';
      return unit ? `${dosage} ${unit}` : dosage;
    };

    const categorizeAgent = (agent: AntiemeticAgent) => {
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

    const effectiveAntiemetics = (supportiveCare?.selectedAntiemetics ?? selectedAntiemetics);
    const riskLevel = (supportiveCare?.emetogenicRiskLevel ?? emetogenicRiskLevel);

    const premedications = {
      antiemetics: effectiveAntiemetics.filter(agent => categorizeAgent(agent) === 'antiemetics').map(agent => ({
        ...agent,
        category: agent.category || 'antiemetic',
        dosage: toDoseWithUnit(agent.dosage, agent.unit),
        route: agent.route || '',
        timing: agent.timing || '',
        isRequired: false,
        isStandard: true,
        solvent: null,
      })),
      infusionReactionProphylaxis: effectiveAntiemetics.filter(agent => categorizeAgent(agent) === 'infusionReactionProphylaxis').map(agent => ({
        ...agent,
        category: agent.category || 'infusion',
        dosage: toDoseWithUnit(agent.dosage, agent.unit),
        route: agent.route || '',
        timing: agent.timing || '',
        isRequired: false,
        isStandard: true,
        solvent: null,
      })),
      gastroprotection: effectiveAntiemetics.filter(agent => categorizeAgent(agent) === 'gastroprotection').map(agent => ({
        ...agent,
        category: agent.category || 'gastro',
        dosage: toDoseWithUnit(agent.dosage, agent.unit),
        route: agent.route || '',
        timing: agent.timing || '',
        isRequired: false,
        isStandard: true,
        solvent: null,
      })),
      organProtection: effectiveAntiemetics.filter(agent => categorizeAgent(agent) === 'organProtection').map(agent => ({
        ...agent,
        category: agent.category || 'organ',
        dosage: toDoseWithUnit(agent.dosage, agent.unit),
        route: agent.route || '',
        timing: agent.timing || '',
        isRequired: false,
        isStandard: true,
        solvent: null,
      })),
      other: effectiveAntiemetics.filter(agent => categorizeAgent(agent) === 'other').map(agent => ({
        ...agent,
        category: agent.category || 'other',
        dosage: toDoseWithUnit(agent.dosage, agent.unit),
        route: agent.route || '',
        timing: agent.timing || '',
        isRequired: false,
        isStandard: true,
        solvent: null,
      })),
    };

    return {
      patient,
      regimen,
      calculatedDrugs,
      emetogenicRisk: {
        level: riskLevel,
        justification: `Based on ${regimen.name} regimen classification`,
        acuteRisk: riskLevel === 'high' ? '>90% risk of emesis' : 
                   riskLevel === 'moderate' ? '30-90% risk of emesis' : 
                   riskLevel === 'low' ? '10-30% risk of emesis' : '<10% risk of emesis',
        delayedRisk: riskLevel === 'high' ? '>90% risk of delayed emesis' : 
                     riskLevel === 'moderate' ? '30-90% risk of delayed emesis' : 
                     riskLevel === 'low' ? '10-30% risk of delayed emesis' : '<10% risk of delayed emesis',
      },
      premedications,
      solventGroups: supportiveCare?.groupedPremedications,
      clinicalNotes,
    };
  };

const handleExportTreatmentPDF = async () => {
  try {
    logger.info('Export PDF clicked', { component: 'DoseCalculator', action: 'exportPDF', cnp, calculationsCount: calculations.length });
    if (!cnp.trim()) {
      toast.error(t('doseCalculator.toasts.enterCnpBeforeExport'));
      return;
    }
    // Validate CNP format
    const { validateCNP } = await import('@/utils/cnp');
    if (!validateCNP(cnp).isValid) {
      toast.error(t('validation.cnpInvalid'));
      return;
    }
    if (calculations.length === 0) {
      toast.error(t('doseCalculator.toasts.noCalcsToExport'));
      return;
    }
    const hasInvalid = calculations.some(c => c.selected && (!isFinite(c.finalDose) || c.finalDose <= 0));
    if (hasInvalid) {
      toast.error(t('doseCalculator.toasts.invalidDoseValues', { defaultValue: 'One or more doses are invalid (<= 0).' }));
      return;
    }

    const treatmentData = prepareTreatmentData();
    await generateClinicalTreatmentPDF({
      ...treatmentData,
      elementId: 'clinical-treatment-sheet',
      orientation: printOrientation,
    });
    toast.success(t('doseCalculator.toasts.exportSuccess'));
  } catch (error) {
    logger.error('Export error', { component: 'DoseCalculator', action: 'exportPDF', error });
    toast.error(t('doseCalculator.toasts.exportFailed'));
  }
};

const handlePrintTreatmentSheet = () => {
  if (!cnp.trim()) {
    toast.error(t('doseCalculator.toasts.enterCnpBeforePrint'));
    return;
  }
  printTreatmentSheet();
};

const handleGenerateTreatmentSheet = () => {
  logger.info('Generate Sheet Button Clicked', { 
    component: 'DoseCalculator', 
    action: 'generateSheet',
    cnp, 
    calculationsCount: calculations.length,
    regimen: regimen?.name,
    bsa,
    weight,
    creatinineClearance
  });
  
  if (!cnp.trim()) {
    logger.warn('Generate sheet failed - No CNP', { component: 'DoseCalculator', action: 'generateSheet' });
    toast.error(t('doseCalculator.toasts.generateSheetNeedCnp'));
    return;
  }
  // Validate CNP
  import('@/utils/cnp').then(({ validateCNP }) => {
    if (!validateCNP(cnp).isValid) {
      toast.error(t('validation.cnpInvalid'));
      return;
    }
    if (calculations.length === 0) {
      logger.warn('Generate sheet failed - No calculations available', { component: 'DoseCalculator', action: 'generateSheet' });
      toast.error(t('doseCalculator.toasts.generateSheetNeedCalcs'));
      return;
    }
    logger.debug('Setting showTreatmentSheet to true', { component: 'DoseCalculator', action: 'generateSheet' });
    setShowTreatmentSheet(true);
    const data = prepareTreatmentData();
    try { onFinalize?.(data); } catch {}
    try { onGoToReview?.(); } catch {}
    try { if (regimen) localStorage.removeItem(`draft:doseCalc:${regimen.id}`); } catch {}
    toast.success(t('doseCalculator.toasts.sheetGenerated'));
  });
};

const handleExportData = () => {
  if (calculations.length === 0) {
    toast.error(t('doseCalculator.toasts.noCalcsToExport'));
    return;
  }
  onExport?.(calculations);
  toast.success(t('doseCalculator.toasts.dataExported'));
};
  logger.debug("DoseCalculator rendering", { component: 'DoseCalculator', regimen: regimen?.name, calculationsCount: calculations.length });

  if (!regimen) {
    logger.debug("No regimen selected, showing placeholder", { component: 'DoseCalculator' });
    return (
<Card className="w-full">
  <CardContent className="pt-6">
    <div className="text-center py-8 text-muted-foreground">
      {t('doseCalculator.emptyState')}
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
  {t('doseCalculator.title')}
</CardTitle>
<p className="text-sm text-muted-foreground mt-1">
  {regimen.name}
</p>
</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
<div>
  <Label htmlFor="patientFullName">{t('doseCalculator.fullNameLabel')}</Label>
  <Input
    id="patientFullName"
    value={patientFullName}
    onChange={(e) => setPatientFullName(e.target.value)}
    placeholder={t('doseCalculator.fullNamePlaceholder')}
    className="mt-1"
  />
</div>
<div>
  <Label htmlFor="cnp">{t('doseCalculator.cnpLabel')}</Label>
  <Input
    id="cnp"
    value={cnp}
    onChange={(e) => setCnp((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0,13))}
    placeholder={t('doseCalculator.cnpPlaceholder')}
    className="mt-1"
  />
</div>
<div>
  <Label htmlFor="foNumber">{t('doseCalculator.foNumberLabel')}</Label>
  <Input
    id="foNumber"
    value={foNumber}
    onChange={(e) => setFoNumber(e.target.value)}
    placeholder={t('doseCalculator.foNumberPlaceholder')}
    className="mt-1"
  />
</div>
<div>
  <Label htmlFor="cycleNumber">{t('doseCalculator.cycleLabel')}</Label>
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
  <Label htmlFor="treatmentDate">{t('doseCalculator.treatmentDateLabel')}</Label>
  <DatePickerField
    id="treatmentDate"
    value={treatmentDate}
    onChange={(iso) => setTreatmentDate(iso)}
    className="mt-1"
  />
</div>
<div>
  <Label htmlFor="nextCycleDate">{t('doseCalculator.nextCycleDateLabel')}</Label>
  <DatePickerField
    id="nextCycleDate"
    value={nextCycleDate}
    onChange={(iso) => { setAutoNextCycle(false); setNextCycleDate(iso); }}
    className="mt-1"
  />
  <div className="flex items-center gap-2 mt-2">
    <Checkbox id="autoNextCycle" checked={autoNextCycle} onCheckedChange={(v) => setAutoNextCycle(!!v)} />
    <Label htmlFor="autoNextCycle" className="text-xs text-muted-foreground">{t('doseCalculator.autoNextCycle')}</Label>
  </div>
</div>
        </div>

        {/* Enhanced Dosing Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-accent/10 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useBsaCap"
                checked={useBsaCap}
                onCheckedChange={(checked) => setUseBsaCap(checked as boolean)}
              />
<Label htmlFor="useBsaCap" className="text-sm font-medium">
  {t('doseCalculator.applyBsaCap')}
</Label>
</div>
<div className="flex items-center space-x-2">
  <Label htmlFor="bsaCap" className="text-xs text-muted-foreground">
    {t('doseCalculator.maxBsa')}:
  </Label>
  <Input
                id="bsaCap"
                type="number"
                value={bsaCap}
                onChange={(e) => setBsaCap(parseFloat(e.target.value) || 2.0)}
                min="1.5"
                max="3.0"
                step="0.1"
                className="w-20 h-8 text-sm"
                disabled={!useBsaCap}
              />
              <span className="text-xs text-muted-foreground">m²</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSafetyPanel(!showSafetyPanel)}
              className={safetyAlerts.filter(a => a.severity === 'critical').length > 0 ? 
                "border-destructive text-destructive" : ""}
            >
<Shield className="h-4 w-4 mr-2" />
{t('doseCalculator.safety')} ({safetyAlerts.length})
</Button>
<Button
  variant="outline"
  size="sm"
  onClick={() => setShowCalendar(!showCalendar)}
>
  <Calendar className="h-4 w-4 mr-2" />
  {t('doseCalculator.calendar')}
</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
<div className="flex justify-between">
  <span className="text-muted-foreground">{t('doseCalculator.metrics.bsa')}:</span>
  <span className="font-medium">{bsa} m²</span>
</div>
<div className="flex justify-between">
  <span className="text-muted-foreground">{t('doseCalculator.metrics.weight')}:</span>
  <span className="font-medium">{weight} kg</span>
</div>
<div className="flex justify-between">
  <span className="text-muted-foreground">{t('doseCalculator.metrics.crcl')}:</span>
  <span className="font-medium">{creatinineClearance} mL/min</span>
</div>
<div className="flex justify-between">
  <span className="text-muted-foreground">{t('doseCalculator.metrics.schedule')}:</span>
  <span className="font-medium">{regimen.schedule}</span>
</div>
<div className="flex justify-between">
  <span className="text-muted-foreground">{t('doseCalculator.metrics.cycles')}:</span>
  <span className="font-medium">{regimen.cycles}</span>
</div>
        </div>

        {/* Emetogenic Risk Assessment moved to Supportive Care step */}

        {/* Safety Alerts Panel */}
        {showSafetyPanel && safetyAlerts.length > 0 && (
          <SafetyAlertsPanel
            alerts={safetyAlerts}
            onAlertDismiss={(alertId, justification) => {
              setSafetyAlerts(prev => prev.filter(alert => alert.id !== alertId));
              logger.info('Safety alert dismissed', { component: 'DoseCalculator', action: 'dismissAlert', alertId, justification });
            }}
            onAlertAcknowledge={(alertId) => {
              setSafetyAlerts(prev => prev.filter(alert => alert.id !== alertId));
              logger.info('Safety alert acknowledged', { component: 'DoseCalculator', action: 'acknowledgeAlert', alertId });
            }}
          />
        )}

        {/* Treatment Calendar */}
{showCalendar && (
  <Suspense fallback={<div className="rounded-lg border bg-muted/30 h-40 animate-pulse" aria-busy="true" />}>
    <TreatmentCalendarLazy
      regimen={regimen}
      startDate={parseISODate(treatmentDate) || new Date()}
      cycleNumber={cycleNumber}
    />
  </Suspense>
)}

        <Separator />

        {/* Supportive Protocol Selection moved to Supportive Care step */}

        <Separator />

        <div>
<div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
  <h3 className="font-semibold text-foreground">{t('doseCalculator.chemoDrugs')}</h3>
  <Button
    variant={isEditing ? "default" : "outline"}
    size="sm"
    onClick={() => setIsEditing(!isEditing)}
    aria-pressed={isEditing}
    aria-label={isEditing ? t('doseCalculator.save') : t('doseCalculator.edit')}
  >
    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
    {isEditing ? t('doseCalculator.save') : t('doseCalculator.edit')}
  </Button>
</div>
          <div className="space-y-4">
             {calculations.map((calc, index) => (
               <div key={index} className={`border-2 rounded-lg p-5 space-y-4 transition-all ${
                 calc.selected ? "bg-primary/5 border-primary" : "bg-muted/30 border-muted"
               }`}>
                 <div className="flex items-start gap-4">
                   <div className="flex-shrink-0 mt-1">
                      <Checkbox
                        checked={calc.selected}
                        onCheckedChange={(checked) => handleDrugSelection(index, !!checked)}
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
  {t('doseCalculator.standardDose')}: <span className="text-foreground">{calc.drug.dosage} {calc.drug.unit}</span>
                          </p>
                        </div>
                      </div>

                      {/* Dose Alert */}
                      {calc.doseAlert?.isExceeded && (
                        <Alert variant="destructive" className="mt-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Alertă doză:</strong> {calc.doseAlert.warning}
                            {calc.doseAlert.suggestedAction && (
                              <div className="mt-1 text-sm">{calc.doseAlert.suggestedAction}</div>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}

{(calc.drug.dilution || calc.administrationDuration || calc.solvent) && (
  <div className="border-2 border-accent/30 bg-accent/10 rounded-lg p-4">
    <h5 className="font-semibold text-accent mb-3">{t('doseCalculator.prepAndAdmin')}</h5>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-background/70 p-3 rounded border">
        <Label className="text-muted-foreground font-semibold text-sm">{t('doseCalculator.diluent')}</Label>
        {isEditing ? (
          <>
            <Select value={calc.solvent || ''} onValueChange={(v) => handleSolventChange(index, v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('doseCalculator.selectSolvent')} />
              </SelectTrigger>
              <SelectContent>
                  {AVAILABLE_SOLVENTS.map(solvent => (
                    <SelectItem key={solvent} value={solvent}>
                      {t(getSolventI18nKey(solvent)) || solvent}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {calc.drug.dilution && (
              <p className="text-xs text-muted-foreground mt-1">{t('doseCalculator.protocolSuggest')}: {calc.drug.dilution}</p>
            )}
          </>
        ) : (
          <p className="text-foreground font-medium mt-1">{calc.solvent || calc.drug.dilution || t('compactSheet.na')}</p>
        )}
      </div>
      <div className="bg-background/70 p-3 rounded border">
        <Label className="text-muted-foreground font-semibold text-sm">{t('doseCalculator.adminDuration')}</Label>
        {isEditing ? (
          <Input
            value={calc.administrationDuration || ''}
            onChange={(e) => handleAdminDurationChange(index, e.target.value)}
            placeholder={t('doseCalculator.adminDurationPlaceholder')}
            className="mt-1"
          />
        ) : (
          <p className="text-foreground font-medium mt-1">{calc.administrationDuration || t('compactSheet.na')}</p>
        )}
      </div>
    </div>
  </div>
)}

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
                      <div>
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
                      <div className="bg-muted/50 p-2 rounded text-sm">
                        <strong>{t('doseCalculator.notes', { defaultValue: 'Notes' })}:</strong> {calc.notes}
                      </div>
                    )}

                    {/* Solvent and Volume Selection */}
                    <SolventVolumeSelector
                      drug={regimen.drugs[index]}
                      selectedSolventType={calc.selectedSolventType}
                      selectedVolume={calc.selectedVolume}
                      onSolventTypeChange={(solventType) => handleSolventTypeChange(index, solventType)}
                      onVolumeChange={(volume) => handleVolumeChange(index, volume)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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

{/* Primary actions moved below chemo drugs and notes */}
<div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
  <Button
    variant={isEditing ? "default" : "outline"}
    size="sm"
    onClick={() => setIsEditing(!isEditing)}
    aria-pressed={isEditing}
    aria-label={isEditing ? t('doseCalculator.save') : t('doseCalculator.edit')}
  >
    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
    {isEditing ? t('doseCalculator.save') : t('doseCalculator.edit')}
  </Button>
  <Button
    variant="secondary"
    size="sm"
    onClick={handleGenerateTreatmentSheet}
    disabled={!cnp.trim() || calculations.length === 0}
  >
    <FileCheck className="h-4 w-4" />
    {t('doseCalculator.generateSheet')}
  </Button>
  <Button
    variant="outline"
    size="sm"
    onClick={handleExportData}
  >
    <FileText className="h-4 w-4" />
    {t('doseCalculator.exportData')}
  </Button>
</div>

{/* Mobile sticky action bar */}
<MobileActionBar
  onGenerate={handleGenerateTreatmentSheet}
  onExport={handleExportData}
  disableGenerate={!cnp.trim() || calculations.length === 0}
  disableExport={calculations.length === 0}
/>


        {/* Treatment Sheet Section */}
        {showTreatmentSheet && cnp.trim() && (
          <div className="space-y-4">
            <Separator />
            <div className="flex justify-between items-center">
<h3 className="text-lg font-semibold">{t('doseCalculator.treatmentSheetTitle')}</h3>
<div className="flex items-center gap-2">
  <Select value={printOrientation} onValueChange={(v) => setPrintOrientation(v as 'portrait' | 'landscape')}>
    <SelectTrigger className="w-[140px]">
      <SelectValue placeholder={t('doseCalculator.orientation')} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="portrait">{t('doseCalculator.portrait')}</SelectItem>
      <SelectItem value="landscape">{t('doseCalculator.landscape')}</SelectItem>
    </SelectContent>
  </Select>
  <Button
    variant="outline"
    size="sm"
    onClick={handleExportTreatmentPDF}
    disabled={!cnp.trim()}
  >
    <Download className="h-4 w-4" />
    {t('doseCalculator.exportPdf')}
  </Button>
  <Button
    variant="outline"
    size="sm"
    onClick={handlePrintTreatmentSheet}
    disabled={!cnp.trim()}
  >
    <Printer className="h-4 w-4" />
    {t('doseCalculator.print')}
  </Button>
</div>
            </div>
            
{/* Digital view - full layout */}
<div className="print:hidden">
  <Suspense fallback={<div className="rounded-lg border bg-muted/30 h-64 animate-pulse" aria-busy="true" />}>
    <ClinicalTreatmentSheetLazy 
      treatmentData={prepareTreatmentData()}
      className="bg-background border rounded-lg p-6"
    />
  </Suspense>
</div>
{/* Print view - compact layout */}
<div className="hidden print:block" id="clinical-treatment-sheet" ref={componentRef}>
  <Suspense fallback={<div />}>
    <CompactClinicalTreatmentSheetLazy 
      treatmentData={prepareTreatmentData()}
      className=""
    />
  </Suspense>
</div>
          </div>
        )}

        {calculations.length > 0 && (
          <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
<h4 className="font-medium text-accent mb-2">{t('doseCalculator.reminders.title')}</h4>
<ul className="text-sm text-muted-foreground space-y-1">
  {(t('doseCalculator.reminders.items', { returnObjects: true }) as string[]).map((item, idx) => (
    <li key={idx}>• {item}</li>
  ))}
</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};