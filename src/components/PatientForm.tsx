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
  const [patientData, setPatientData] = useState<PatientData>({
    weight: "",
    height: "",
    age: "",
    sex: "",
    creatinine: "",
    weightUnit: "kg",
    heightUnit: "cm",
    creatinineUnit: "mg/dL"
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
      console.error('BSA calculation error:', error);
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
      console.error('Creatinine clearance calculation error:', error);
      return 0;
    }
  }, []);

  // Debounced calculation to prevent excessive re-renders
  const debouncedCalculation = useDebouncedCalculation((data: PatientData) => {
    setIsCalculating(true);
    
    try {
      // Validate input data
      const validationResult = validatePatientData(data);
      setValidation(validationResult);
      
      if (data.weight && data.height) {
        const weight = parseFloat(data.weight);
        const height = parseFloat(data.height);
        const age = parseFloat(data.age);
        const creatinine = parseFloat(data.creatinine);
        
        if (!isNaN(weight) && !isNaN(height)) {
          const bsa = calculateBSA(weight, height, data.weightUnit, data.heightUnit);
          
          let creatinineClearance = 0;
          if (!isNaN(age) && !isNaN(creatinine) && data.sex) {
            creatinineClearance = calculateCreatinineClearance(
              age, weight, creatinine, data.sex, 
              data.weightUnit, data.creatinineUnit
            );
          }
          
          onPatientDataChange({ ...data, bsa, creatinineClearance });
        }
      }
    } catch (error) {
      console.error('Patient data calculation error:', error);
      setValidation({
        isValid: false,
        errors: ['Calculation error occurred'],
        warnings: []
      });
    } finally {
      setIsCalculating(false);
    }
  }, 300, [calculateBSA, calculateCreatinineClearance, onPatientDataChange]);

  const handleInputChange = useCallback((field: keyof PatientData, value: string) => {
    // Sanitize input to prevent XSS
    const sanitizedValue = sanitizeInput(value);
    const newData = { ...patientData, [field]: sanitizedValue };
    setPatientData(newData);
    
    // Trigger debounced calculation
    debouncedCalculation(newData);
  }, [patientData, debouncedCalculation]);

  // Show validation toast when validation changes
  useEffect(() => {
    if (validation.errors.length > 0 || validation.warnings.length > 0) {
      showValidationToast(validation, "Patient Data");
    }
  }, [validation]);

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
            <Label htmlFor="height">Height</Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={patientData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.heightUnit} onValueChange={(value) => handleInputChange("heightUnit", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="inches">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={patientData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={patientData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatinine">Serum Creatinine</Label>
            <div className="flex gap-2">
              <Input
                id="creatinine"
                type="number"
                step="0.1"
                placeholder="Enter creatinine"
                value={patientData.creatinine}
                onChange={(e) => handleInputChange("creatinine", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.creatinineUnit} onValueChange={(value) => handleInputChange("creatinineUnit", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg/dL">mg/dL</SelectItem>
                  <SelectItem value="μmol/L">μmol/L</SelectItem>
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
                  Calculated BSA
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
                Using DuBois formula (validated)
              </p>
            </div>
            
            {patientData.age && patientData.creatinine && patientData.sex && (
              <div className={`p-4 rounded-lg border ${
                validation.isValid ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className={`h-4 w-4 ${validation.isValid ? 'text-success' : 'text-warning'}`} />
                  <span className={`font-medium ${validation.isValid ? 'text-success' : 'text-warning'}`}>
                    Creatinine Clearance
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
                  Using Cockcroft-Gault formula (validated)
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