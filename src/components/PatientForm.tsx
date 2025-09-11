import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, parseISODate, toISODate, toLocalISODate } from "@/utils/dateFormat";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calculator, User, AlertTriangle, CheckCircle, CalendarIcon } from "lucide-react";
import { validatePatientData, sanitizeInput, sanitizeName, validateFirstName, validateLastName, getFullName, showValidationToast, ValidationResult } from "@/utils/inputValidation";
import { ClinicalErrorBoundary } from "@/components/ClinicalErrorBoundary";
import { useDebouncedCalculation, usePerformanceMonitoring } from "@/hooks/usePerformanceOptimization";
import { toKg } from "@/utils/units";
import { logger } from '@/utils/logger';
import { useDataPersistence } from '@/context/DataPersistenceContext';
import { sanitizeCNP, validateCNP } from "@/utils/cnp";
import { format, addDays, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PatientData {
  weight: string;
  height: string;
  age: string;
  sex: string;
  creatinine: string;
  weightUnit: string;
  heightUnit: string;
  creatinineUnit: string;
  // Patient identification fields
  firstName: string;
  lastName: string;
  cnp: string;
  foNumber: string;
  // Treatment details fields
  cycleNumber: number;
  treatmentDate: string; // ISO date string
  nextCycleDate?: string; // ISO date string
  bsaCapEnabled: boolean;
}

interface PatientFormProps {
  onPatientDataChange: (data: PatientData & { bsa: number; creatinineClearance: number; effectiveBsa: number }) => void;
}

export const PatientForm = ({ onPatientDataChange }: PatientFormProps) => {
  const { t } = useTranslation();
  const { state, setPatientData: savePatientData } = useDataPersistence();
  
  // Initialize with persistent data if available
  const [localPatientData, setLocalPatientData] = useState<PatientData>(() => {
    const currentDate = toLocalISODate(new Date()); // YYYY-MM-DD format
    
    if (state.patientData) {
      // Handle migration from fullName to firstName/lastName
      let firstName = state.patientData.firstName || '';
      let lastName = state.patientData.lastName || '';
      
      // Migrate from fullName if new fields are empty
      if (!firstName && !lastName && state.patientData.fullName) {
        const nameParts = state.patientData.fullName.trim().split(' ');
        if (nameParts.length === 1) {
          firstName = nameParts[0];
        } else if (nameParts.length >= 2) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        }
      }
      
      return {
        weight: state.patientData.weight || "",
        height: state.patientData.height || "",
        age: state.patientData.age || "",
        sex: state.patientData.sex || "",
        creatinine: state.patientData.creatinine || "",
        weightUnit: state.patientData.weightUnit || "kg",
        heightUnit: state.patientData.heightUnit || "cm",
        creatinineUnit: state.patientData.creatinineUnit || "mg/dL",
        firstName,
        lastName,
        cnp: state.patientData.cnp || "",
        foNumber: state.patientData.foNumber || "",
        cycleNumber: state.patientData.cycleNumber || 1,
        treatmentDate: state.patientData.treatmentDate || currentDate,
        nextCycleDate: state.patientData.nextCycleDate,
        bsaCapEnabled: state.patientData.bsaCapEnabled || false
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
      creatinineUnit: "mg/dL",
      firstName: "",
      lastName: "",
      cnp: "",
      foNumber: "",
      cycleNumber: 1,
      treatmentDate: currentDate,
      nextCycleDate: undefined,
      bsaCapEnabled: false
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

  const handleInputChange = useCallback((field: keyof PatientData, value: string | number | boolean) => {
    // Use specific sanitization for names
    let sanitizedValue = value;
    if ((field === 'firstName' || field === 'lastName') && typeof value === 'string') {
      sanitizedValue = sanitizeName(value);
    } else if (typeof value === 'string') {
      sanitizedValue = sanitizeInput(value);
    }
    
    // Debug logging for name fields to track space preservation
    if ((field === 'firstName' || field === 'lastName') && typeof value === 'string' && typeof sanitizedValue === 'string') {
      logger.debug('Name input processing', {
        component: 'PatientForm',
        action: 'handleInputChange',
        field,
        originalValue: value,
        sanitizedValue,
        containsSpace: value.includes(' '),
        sanitizedContainsSpace: sanitizedValue.includes(' ')
      });
    }
    
    const newData = { ...localPatientData, [field]: sanitizedValue };
    setLocalPatientData(newData);
    
    // Save to persistent storage
    savePatientData(newData);
    
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
    
    // Calculate effective BSA (with cap if enabled)
    const effectiveBsa = newData.bsaCapEnabled ? Math.min(bsa, 2.0) : bsa;
    
    // Always call parent callback immediately
    const weightNum = parseFloat(newData.weight || "0");
    const normalizedWeightKg = newData.weight ? toKg(weightNum, newData.weightUnit as 'kg' | 'lbs') : 0;
    onPatientDataChange({ 
      ...newData, 
      weight: newData.weight ? String(normalizedWeightKg) : newData.weight, 
      weightUnit: "kg", 
      bsa, 
      creatinineClearance,
      effectiveBsa
    });
    
    // Trigger debounced validation
    debouncedCalculation(newData);
  }, [localPatientData, debouncedCalculation, calculateBSA, calculateCreatinineClearance, onPatientDataChange, savePatientData]);

  // Show validation toast when validation changes
  useEffect(() => {
    if (validation.errors.length > 0 || validation.warnings.length > 0) {
      showValidationToast(validation, t('patientForm.title'));
    }
  }, [validation]);

  // Sync with context state when it changes (data recovery)
  useEffect(() => {
    if (state.patientData) {
      const currentDate = toLocalISODate(new Date());
      
      // Handle migration from fullName to firstName/lastName
      let firstName = state.patientData.firstName || '';
      let lastName = state.patientData.lastName || '';
      
      // Migrate from fullName if new fields are empty
      if (!firstName && !lastName && state.patientData.fullName) {
        const nameParts = state.patientData.fullName.trim().split(' ');
        if (nameParts.length === 1) {
          firstName = nameParts[0];
        } else if (nameParts.length >= 2) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        }
      }
      
      const restoredData = {
        weight: state.patientData.weight || "",
        height: state.patientData.height || "",
        age: state.patientData.age || "",
        sex: state.patientData.sex || "",
        creatinine: state.patientData.creatinine || "",
        weightUnit: state.patientData.weightUnit || "kg",
        heightUnit: state.patientData.heightUnit || "cm",
        creatinineUnit: state.patientData.creatinineUnit || "mg/dL",
        firstName,
        lastName,
        cnp: state.patientData.cnp || "",
        foNumber: state.patientData.foNumber || "",
        cycleNumber: state.patientData.cycleNumber || 1,
        treatmentDate: state.patientData.treatmentDate || currentDate,
        nextCycleDate: state.patientData.nextCycleDate,
        bsaCapEnabled: state.patientData.bsaCapEnabled || false
      };
      
      setLocalPatientData(restoredData);
      
      // Trigger parent callback with restored data
      if (restoredData.weight && restoredData.height) {
        const weight = parseFloat(restoredData.weight);
        const height = parseFloat(restoredData.height);
        const age = parseFloat(restoredData.age || "0");
        const creatinine = parseFloat(restoredData.creatinine || "0");
        
        const bsa = calculateBSA(weight, height, restoredData.weightUnit, restoredData.heightUnit);
        
        let creatinineClearance = 0;
        if (restoredData.age && restoredData.weight && restoredData.creatinine && restoredData.sex) {
          creatinineClearance = calculateCreatinineClearance(
            age, weight, creatinine, restoredData.sex, 
            restoredData.weightUnit, restoredData.creatinineUnit
          );
        }
        
        const effectiveBsa = restoredData.bsaCapEnabled ? Math.min(bsa, 2.0) : bsa;
        const weightNum = parseFloat(restoredData.weight);
        const normalizedWeightKg = toKg(weightNum, restoredData.weightUnit as 'kg' | 'lbs');
        
        onPatientDataChange({ 
          ...restoredData, 
          weight: String(normalizedWeightKg), 
          weightUnit: "kg", 
          bsa, 
          creatinineClearance,
          effectiveBsa
        });
      }
    }
  }, [state.patientData, calculateBSA, calculateCreatinineClearance, onPatientDataChange]);

  // Initialize parent with existing data on mount
  useEffect(() => {
    if (state.patientData && localPatientData.weight && localPatientData.height) {
      const weight = parseFloat(localPatientData.weight || "0");
      const height = parseFloat(localPatientData.height || "0");
      const age = parseFloat(localPatientData.age || "0");
      const creatinine = parseFloat(localPatientData.creatinine || "0");
      
      const bsa = localPatientData.weight && localPatientData.height ? 
        calculateBSA(weight, height, localPatientData.weightUnit, localPatientData.heightUnit) : 0;
      
      let creatinineClearance = 0;
      if (localPatientData.age && localPatientData.weight && localPatientData.creatinine && localPatientData.sex) {
        creatinineClearance = calculateCreatinineClearance(
          age, weight, creatinine, localPatientData.sex, 
          localPatientData.weightUnit, localPatientData.creatinineUnit
        );
      }
      
      // Calculate effective BSA (with cap if enabled)
      const effectiveBsa = localPatientData.bsaCapEnabled ? Math.min(bsa, 2.0) : bsa;
      
      const weightNum = parseFloat(localPatientData.weight || "0");
      const normalizedWeightKg = localPatientData.weight ? toKg(weightNum, localPatientData.weightUnit as 'kg' | 'lbs') : 0;
      onPatientDataChange({ 
        ...localPatientData, 
        weight: localPatientData.weight ? String(normalizedWeightKg) : localPatientData.weight, 
        weightUnit: "kg", 
        bsa, 
        creatinineClearance,
        effectiveBsa
      });
    }
  }, []); // Run only on mount - empty dependency array


  // CNP validation handler
  const handleCNPChange = useCallback((value: string) => {
    const sanitized = sanitizeCNP(value);
    handleInputChange('cnp', sanitized);
    
    if (sanitized && !validateCNP(sanitized).isValid) {
      toast.error('Vă rugăm să introduceți un CNP valid de 13 cifre');
    }
  }, [handleInputChange]);

  // Cycle number validation
  const handleCycleChange = useCallback((value: string) => {
    const cycleNum = parseInt(value, 10);
    if (!isNaN(cycleNum) && cycleNum > 0) {
      handleInputChange('cycleNumber', cycleNum);
    }
  }, [handleInputChange]);

  const isFormValid = localPatientData.weight && localPatientData.height && localPatientData.age && localPatientData.sex && 
                     localPatientData.firstName && localPatientData.lastName && localPatientData.cnp && localPatientData.foNumber;

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
      <CardContent className="space-y-6">
        {/* Section 1: Date de identificare pacient */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-medium text-primary">Date de identificare pacient</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('patientForm.firstName')} *</Label>
              <Input
                id="firstName"
                value={localPatientData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder={t('patientForm.firstNamePlaceholder')}
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('patientForm.lastName')} *</Label>
              <Input
                id="lastName"
                value={localPatientData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder={t('patientForm.lastNamePlaceholder')}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* CNP */}
            <div className="space-y-2">
              <Label htmlFor="cnp">CNP *</Label>
              <Input
                id="cnp"
                value={localPatientData.cnp}
                onChange={(e) => handleCNPChange(e.target.value)}
                placeholder="Introduceți CNP-ul de 13 cifre"
                maxLength={13}
                required
              />
              {localPatientData.cnp && !validateCNP(localPatientData.cnp).isValid && (
                <p className="text-sm text-destructive">
                  Vă rugăm să introduceți un CNP valid de 13 cifre
                </p>
              )}
            </div>

            {/* F.O. Number */}
            <div className="space-y-2">
              <Label htmlFor="foNumber">Număr F.O. *</Label>
              <Input
                id="foNumber"
                value={localPatientData.foNumber}
                onChange={(e) => handleInputChange("foNumber", e.target.value)}
                placeholder="Introduceți numărul foii de observație"
                required
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 2: Basic Patient Data */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-medium text-primary">Date antropometrice și clinice</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">{t('patientForm.weight')}</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  placeholder={t('patientForm.placeholders.enterWeight')}
                  value={localPatientData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="flex-1"
                />
                <Select value={localPatientData.weightUnit} onValueChange={(value) => handleInputChange("weightUnit", value)}>
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
                  value={localPatientData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="flex-1"
                />
                <Select value={localPatientData.heightUnit} onValueChange={(value) => handleInputChange("heightUnit", value)}>
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
                value={localPatientData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">{t('patientForm.sex')}</Label>
              <Select value={localPatientData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
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
                  value={localPatientData.creatinine}
                  onChange={(e) => handleInputChange("creatinine", e.target.value)}
                  className="flex-1"
                />
                <Select value={localPatientData.creatinineUnit} onValueChange={(value) => handleInputChange("creatinineUnit", value)}>
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
        </div>

        <Separator />

        {/* Section 3: Detalii pacient și tratament */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-medium text-primary">Detalii pacient și tratament</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* BSA Cap Option */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id="bsaCapEnabled"
                  checked={localPatientData.bsaCapEnabled}
                  onCheckedChange={(checked) => handleInputChange('bsaCapEnabled', checked === true)}
                />
                <Label htmlFor="bsaCapEnabled" className="text-sm font-medium">
                  Aplică prag BSA 2.0 m²
                </Label>
              </div>
              {localPatientData.weight && localPatientData.height && (
                <div className="text-sm text-muted-foreground pl-3">
                  BSA calculată: {calculateBSA(
                    parseFloat(localPatientData.weight),
                    parseFloat(localPatientData.height),
                    localPatientData.weightUnit,
                    localPatientData.heightUnit
                  ).toFixed(2)} m² | 
                  BSA folosită: {localPatientData.bsaCapEnabled 
                    ? Math.min(calculateBSA(
                        parseFloat(localPatientData.weight),
                        parseFloat(localPatientData.height),
                        localPatientData.weightUnit,
                        localPatientData.heightUnit
                      ), 2.0).toFixed(2)
                    : calculateBSA(
                        parseFloat(localPatientData.weight),
                        parseFloat(localPatientData.height),
                        localPatientData.weightUnit,
                        localPatientData.heightUnit
                      ).toFixed(2)} m²
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {localPatientData.weight && localPatientData.height && (
          <div className="space-y-4">
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
                  parseFloat(localPatientData.weight),
                  parseFloat(localPatientData.height),
                  localPatientData.weightUnit,
                  localPatientData.heightUnit
                )} m²
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('patientForm.duBoisNote')}
              </p>
            </div>
            
            {localPatientData.age && localPatientData.creatinine && localPatientData.sex && (
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
                    parseFloat(localPatientData.age),
                    parseFloat(localPatientData.weight),
                    parseFloat(localPatientData.creatinine),
                    localPatientData.sex,
                    localPatientData.weightUnit,
                    localPatientData.creatinineUnit
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