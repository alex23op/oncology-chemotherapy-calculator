import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, User, AlertTriangle, CheckCircle } from "lucide-react";
import { validatePatientData, sanitizeInput, showValidationToast, ValidationResult } from "@/utils/inputValidation";
import { ClinicalErrorBoundary } from "@/components/ClinicalErrorBoundary";
import { useDebouncedCalculation, usePerformanceMonitoring } from "@/hooks/usePerformanceOptimization";
import { toKg } from "@/utils/units";
import { logger } from '@/utils/logger';
import { useDataPersistence } from '@/context/DataPersistenceContext';

interface PatientData {
  weight: string;
  height: string;
  age: string;
  sex: string;
  creatinine: string;
  weightUnit: string;
  heightUnit: string;
  creatinineUnit: string;
}

interface PatientFormProps {
  onPatientDataChange: (data: PatientData & { bsa: number; creatinineClearance: number }) => void;
}

export const PatientForm = ({ onPatientDataChange }: PatientFormProps) => {
  const { t } = useTranslation();
  const { state } = useDataPersistence();
  
  // Initialize with persistent data if available
  const [patientData, setPatientData] = useState<PatientData>(() => {
    if (state.patientData) {
      return {
        weight: state.patientData.weight || "",
        height: state.patientData.height || "",
        age: state.patientData.age || "",
        sex: state.patientData.sex || "",
        creatinine: state.patientData.creatinine || "",
        weightUnit: state.patientData.weightUnit || "kg",
        heightUnit: state.patientData.heightUnit || "cm",
        creatinineUnit: state.patientData.creatinineUnit || "mg/dL"
      };
    }
    return {
      weight: "",
      height: "",
      age: "",
      sex: "",
      creatinine: "",
      weightUnit: "kg",
      heightUnit: "cm",
      creatinineUnit: "mg/dL"
    };
  });

  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Performance monitoring
  const metrics = usePerformanceMonitoring('PatientForm');

  const calculateBSA = useCallback((weight: number, height: number, weightUnit: string, heightUnit: string) => {
    try {
      if (!weight || !height || weight <= 0 || height <= 0) return 0;
      
      // Convert to standard units (kg and cm)
      const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
      const heightCm = heightUnit === "inches" ? height * 2.54 : height;
      
      // Validate converted values
      if (weightKg <= 0 || heightCm <= 0) return 0;
      
      // DuBois formula: BSA = 0.007184 × (height^0.725) × (weight^0.425)
      const bsa = 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);
      
      // Safety bounds check
      const safeBSA = Math.max(0.3, Math.min(3.5, bsa));
      return Math.round(safeBSA * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      logger.error('BSA calculation error', { component: 'PatientForm', action: 'calculateBSA', error });
      return 0;
    }
  }, []);

  const calculateCreatinineClearance = useCallback((
    age: number, 
    weight: number, 
    creatinine: number, 
    sex: string,
    weightUnit: string,
    creatinineUnit: string
  ) => {
    try {
      if (!age || !weight || !creatinine || !sex || age <= 0 || weight <= 0 || creatinine <= 0) {
        return 0;
      }
      
      // Convert to standard units
      const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
      const creatinineMgDl = creatinineUnit === "μmol/L" ? creatinine / 88.4 : creatinine;
      
      // Validate converted values
      if (weightKg <= 0 || creatinineMgDl <= 0) return 0;
      
      // Cockcroft-Gault formula
      const sexMultiplier = sex === "female" ? 0.85 : 1;
      const crCl = ((140 - age) * weightKg * sexMultiplier) / (72 * creatinineMgDl);
      
      // Safety bounds check
      const safeCrCl = Math.max(0, Math.min(300, crCl)); // Reasonable bounds
      return Math.round(safeCrCl * 100) / 100;
    } catch (error) {
      logger.error('Creatinine clearance calculation error', { component: 'PatientForm', action: 'calculateCrCl', error });
      return 0;
    }
  }, []);

  // Debounced calculation to prevent excessive re-renders (only for validation)
  const debouncedCalculation = useDebouncedCalculation((data: PatientData) => {
    setIsCalculating(true);
    
    try {
      // Validate input data
      const validationResult = validatePatientData(data);
      setValidation(validationResult);
    } catch (error) {
      logger.error('Patient data validation error', { component: 'PatientForm', action: 'validatePatientData', error });
      setValidation({
        isValid: false,
        errors: ['Validation error occurred'],
        warnings: []
      });
    } finally {
      setIsCalculating(false);
    }
  }, 300, []);

  const handleInputChange = useCallback((field: keyof PatientData, value: string) => {
    // Sanitize input to prevent XSS
    const sanitizedValue = sanitizeInput(value);
    const newData = { ...patientData, [field]: sanitizedValue };
    setPatientData(newData);
    
    // Immediately call parent callback for real-time updates
    const weight = parseFloat(newData.weight || "0");
    const height = parseFloat(newData.height || "0");
    const age = parseFloat(newData.age || "0");
    const creatinine = parseFloat(newData.creatinine || "0");
    
    const bsa = newData.weight && newData.height ? 
      calculateBSA(weight, height, newData.weightUnit, newData.heightUnit) : 0;
    
    let creatinineClearance = 0;
    if (newData.age && newData.weight && newData.creatinine && newData.sex) {
      creatinineClearance = calculateCreatinineClearance(
        age, weight, creatinine, newData.sex, 
        newData.weightUnit, newData.creatinineUnit
      );
    }
    
    // Always call parent callback immediately
    const weightNum = parseFloat(newData.weight || "0");
    const normalizedWeightKg = newData.weight ? toKg(weightNum, newData.weightUnit as 'kg' | 'lbs') : 0;
    onPatientDataChange({ 
      ...newData, 
      weight: newData.weight ? String(normalizedWeightKg) : newData.weight, 
      weightUnit: "kg", 
      bsa, 
      creatinineClearance 
    });
    
    // Trigger debounced validation
    debouncedCalculation(newData);
  }, [patientData, debouncedCalculation, calculateBSA, calculateCreatinineClearance, onPatientDataChange]);

  // Show validation toast when validation changes
  useEffect(() => {
    if (validation.errors.length > 0 || validation.warnings.length > 0) {
      showValidationToast(validation, t('patientForm.title'));
    }
  }, [validation]);

  // Initialize parent with existing data on mount
  useEffect(() => {
    if (state.patientData && patientData.weight && patientData.height) {
      const weight = parseFloat(patientData.weight || "0");
      const height = parseFloat(patientData.height || "0");
      const age = parseFloat(patientData.age || "0");
      const creatinine = parseFloat(patientData.creatinine || "0");
      
      const bsa = patientData.weight && patientData.height ? 
        calculateBSA(weight, height, patientData.weightUnit, patientData.heightUnit) : 0;
      
      let creatinineClearance = 0;
      if (patientData.age && patientData.weight && patientData.creatinine && patientData.sex) {
        creatinineClearance = calculateCreatinineClearance(
          age, weight, creatinine, patientData.sex, 
          patientData.weightUnit, patientData.creatinineUnit
        );
      }
      
      const weightNum = parseFloat(patientData.weight || "0");
      const normalizedWeightKg = patientData.weight ? toKg(weightNum, patientData.weightUnit as 'kg' | 'lbs') : 0;
      onPatientDataChange({ 
        ...patientData, 
        weight: patientData.weight ? String(normalizedWeightKg) : patientData.weight, 
        weightUnit: "kg", 
        bsa, 
        creatinineClearance 
      });
    }
  }, []); // Run only on mount - empty dependency array

  const isFormValid = patientData.weight && patientData.height && patientData.age && patientData.sex;

  return (
    <ClinicalErrorBoundary context="PatientForm">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            {t('patientForm.title')}
            {isCalculating && (
              <div className="ml-auto">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </CardTitle>
          
          {/* Validation Status */}
          {!validation.isValid && validation.errors.length > 0 && (
            <Alert className="mt-2 border-destructive bg-destructive/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {validation.errors.join('; ')}
              </AlertDescription>
            </Alert>
          )}
          
          {validation.warnings.length > 0 && (
            <Alert className="mt-2 border-warning bg-warning/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {validation.warnings.join('; ')}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">{t('patientForm.weight')}</Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                placeholder={t('patientForm.placeholders.enterWeight')}
                value={patientData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.weightUnit} onValueChange={(value) => handleInputChange("weightUnit", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">{t('patientForm.units.kg')}</SelectItem>
                  <SelectItem value="lbs">{t('patientForm.units.lbs')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">{t('patientForm.height')}</Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                placeholder={t('patientForm.placeholders.enterHeight')}
                value={patientData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.heightUnit} onValueChange={(value) => handleInputChange("heightUnit", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">{t('patientForm.units.cm')}</SelectItem>
                  <SelectItem value="inches">{t('patientForm.units.in')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">{t('patientForm.age')}</Label>
            <Input
              id="age"
              type="number"
              placeholder={t('patientForm.placeholders.enterAge')}
              value={patientData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">{t('patientForm.sex')}</Label>
            <Select value={patientData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('patientForm.placeholders.selectSex')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('patientForm.male')}</SelectItem>
                <SelectItem value="female">{t('patientForm.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatinine">{t('patientForm.creatinine')}</Label>
            <div className="flex gap-2">
              <Input
                id="creatinine"
                type="number"
                step="0.1"
                placeholder={t('patientForm.placeholders.enterCreatinine')}
                value={patientData.creatinine}
                onChange={(e) => handleInputChange("creatinine", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.creatinineUnit} onValueChange={(value) => handleInputChange("creatinineUnit", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg/dL">{t('patientForm.units.mgdl')}</SelectItem>
                  <SelectItem value="μmol/L">{t('patientForm.units.umoll')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {patientData.weight && patientData.height && (
          <div className="mt-4 space-y-4">
            <div className={`p-4 rounded-lg border ${
              validation.isValid ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Calculator className={`h-4 w-4 ${validation.isValid ? 'text-success' : 'text-warning'}`} />
                <span className={`font-medium ${validation.isValid ? 'text-success' : 'text-warning'}`}>
                  {t('patientForm.calculatedBSA')}
                </span>
                {validation.isValid && <CheckCircle className="h-4 w-4 text-success ml-auto" />}
              </div>
              <p className={`text-2xl font-bold ${validation.isValid ? 'text-success' : 'text-warning'}`}>
                {calculateBSA(
                  parseFloat(patientData.weight),
                  parseFloat(patientData.height),
                  patientData.weightUnit,
                  patientData.heightUnit
                )} m²
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('patientForm.duBoisNote')}
              </p>
            </div>
            
            {patientData.age && patientData.creatinine && patientData.sex && (
              <div className={`p-4 rounded-lg border ${
                validation.isValid ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className={`h-4 w-4 ${validation.isValid ? 'text-success' : 'text-warning'}`} />
                  <span className={`font-medium ${validation.isValid ? 'text-success' : 'text-warning'}`}>
                    {t('patientForm.creatinineClearance')}
                  </span>
                  {validation.isValid && <CheckCircle className="h-4 w-4 text-success ml-auto" />}
                </div>
                <p className={`text-2xl font-bold ${validation.isValid ? 'text-success' : 'text-warning'}`}>
                  {calculateCreatinineClearance(
                    parseFloat(patientData.age),
                    parseFloat(patientData.weight),
                    parseFloat(patientData.creatinine),
                    patientData.sex,
                    patientData.weightUnit,
                    patientData.creatinineUnit
                  )} mL/min
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('patientForm.cgNote')}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </ClinicalErrorBoundary>
  );
};