import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format, addDays, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useDataPersistence } from '@/context/DataPersistenceContext';
import { Regimen } from "@/types/regimens";
import { toast } from "sonner";

interface TreatmentDetailsData {
  cycleNumber: number;
  treatmentDate: string; // ISO date string
  nextCycleDate?: string; // ISO date string
}

interface TreatmentDetailsFormProps {
  selectedRegimen?: Regimen | null;
  onTreatmentDetailsChange: (data: TreatmentDetailsData) => void;
}

export const TreatmentDetailsForm = ({ selectedRegimen, onTreatmentDetailsChange }: TreatmentDetailsFormProps) => {
  const { t } = useTranslation();
  const { state, setPatientData } = useDataPersistence();
  
  // Initialize with persistent data if available
  const [treatmentData, setTreatmentData] = useState<TreatmentDetailsData>(() => {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (state.patientData) {
      return {
        cycleNumber: state.patientData.cycleNumber || 1,
        treatmentDate: state.patientData.treatmentDate || currentDate,
        nextCycleDate: state.patientData.nextCycleDate,
      };
    }
    return {
      cycleNumber: 1,
      treatmentDate: currentDate,
      nextCycleDate: undefined,
    };
  });

  const handleInputChange = useCallback((field: keyof TreatmentDetailsData, value: string | number) => {
    const newData = { ...treatmentData, [field]: value };
    setTreatmentData(newData);
    
    // Save to persistent storage
    setPatientData(newData);
    
    // Call parent callback
    onTreatmentDetailsChange(newData);
  }, [treatmentData, onTreatmentDetailsChange, setPatientData]);

  // Auto-calculate next cycle date based on regimen cycleLength
  useEffect(() => {
    if (selectedRegimen && treatmentData.treatmentDate && selectedRegimen.cycleLength) {
      const treatmentDate = parseISO(treatmentData.treatmentDate);
      
      if (isValid(treatmentDate)) {
        const calculatedNextDate = addDays(treatmentDate, selectedRegimen.cycleLength);
        const nextDateISO = calculatedNextDate.toISOString().split('T')[0];
        
        // Only auto-update if user hasn't manually set a date
        if (!treatmentData.nextCycleDate) {
          handleInputChange('nextCycleDate', nextDateISO);
        }
      }
    }
  }, [selectedRegimen, treatmentData.treatmentDate, treatmentData.nextCycleDate, handleInputChange]);

  // Cycle number validation
  const handleCycleChange = useCallback((value: string) => {
    const cycleNum = parseInt(value, 10);
    if (!isNaN(cycleNum) && cycleNum > 0) {
      handleInputChange('cycleNumber', cycleNum);
      
      // Validate against regimen max cycles
      if (selectedRegimen?.cycles) {
        const maxCycles = typeof selectedRegimen.cycles === 'number' 
          ? selectedRegimen.cycles 
          : parseInt(selectedRegimen.cycles.split('-')[1] || selectedRegimen.cycles, 10);
        
        if (maxCycles && cycleNum > maxCycles) {
          toast.error(`Numărul ciclului depășește maximul permis (${maxCycles}) pentru acest regim`);
        }
      }
    }
  }, [selectedRegimen, handleInputChange]);

  const handleDateChange = useCallback((field: 'treatmentDate' | 'nextCycleDate', date: Date | undefined) => {
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      handleInputChange(field, isoDate);
    }
  }, [handleInputChange]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          {t('treatmentDetails.title', { defaultValue: 'Detalii Tratament' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cycle Number */}
        <div className="space-y-2">
          <Label htmlFor="cycle-number">{t('doseCalculator.cycleLabel')}</Label>
          <Input
            id="cycle-number"
            type="number"
            min="1"
            max={selectedRegimen?.cycles ? (typeof selectedRegimen.cycles === 'number' ? selectedRegimen.cycles : 99) : 99}
            value={treatmentData.cycleNumber}
            onChange={(e) => handleCycleChange(e.target.value)}
            className="w-32"
          />
          {selectedRegimen?.cycles && (
            <p className="text-xs text-muted-foreground">
              Maximum: {typeof selectedRegimen.cycles === 'number' ? selectedRegimen.cycles : selectedRegimen.cycles} cicluri
            </p>
          )}
        </div>

        {/* Treatment Date */}
        <div className="space-y-2">
          <Label htmlFor="treatment-date">{t('doseCalculator.treatmentDateLabel')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full justify-start text-left font-normal",
                  "flex h-10 rounded-md border border-input bg-background px-3 py-2",
                  "text-sm ring-offset-background placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  !treatmentData.treatmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {treatmentData.treatmentDate ? (
                  format(parseISO(treatmentData.treatmentDate), "dd/MM/yyyy")
                ) : (
                  <span>Selectați data</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={treatmentData.treatmentDate ? parseISO(treatmentData.treatmentDate) : undefined}
                onSelect={(date) => handleDateChange('treatmentDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Next Cycle Date */}
        <div className="space-y-2">
          <Label htmlFor="next-cycle-date">
            {t('doseCalculator.nextCycleDateLabel')}
            {selectedRegimen?.cycleLength && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Auto: +{selectedRegimen.cycleLength} zile)
              </span>
            )}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full justify-start text-left font-normal",
                  "flex h-10 rounded-md border border-input bg-background px-3 py-2",
                  "text-sm ring-offset-background placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  !treatmentData.nextCycleDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {treatmentData.nextCycleDate ? (
                  format(parseISO(treatmentData.nextCycleDate), "dd/MM/yyyy")
                ) : (
                  <span>Selectați data următorului ciclu</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={treatmentData.nextCycleDate ? parseISO(treatmentData.nextCycleDate) : undefined}
                onSelect={(date) => handleDateChange('nextCycleDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Data poate fi editată manual dacă este necesar
          </p>
        </div>

        {/* Protocol Information */}
        {selectedRegimen && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Informații Protocol</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Regim:</strong> {selectedRegimen.name}</p>
              <p><strong>Program:</strong> {selectedRegimen.schedule}</p>
              {selectedRegimen.cycleLength && (
                <p><strong>Durata ciclu:</strong> {selectedRegimen.cycleLength} zile</p>
              )}
              {selectedRegimen.cycles && (
                <p><strong>Cicluri totale:</strong> {selectedRegimen.cycles}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};