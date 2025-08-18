import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Drug } from "@/types/regimens";

interface SolventVolumeSelectorProps {
  drug: Drug;
  selectedSolventType: string | undefined;
  selectedVolume: number | undefined;
  onSolventTypeChange: (solventType: string) => void;
  onVolumeChange: (volume: number) => void;
  disabled?: boolean;
}

export const SolventVolumeSelector: React.FC<SolventVolumeSelectorProps> = ({
  drug,
  selectedSolventType,
  selectedVolume,
  onSolventTypeChange,
  onVolumeChange,
  disabled = false
}) => {
  // Only show if drug has dilution requirements
  if (!drug.availableSolvents || !drug.availableVolumes) {
    return null;
  }

  const validateSelection = () => {
    if (drug.name === "Oxaliplatin" && selectedSolventType !== "D5W") {
      return "Oxaliplatin: doar Glucoză 5% (D5W) pentru stabilitate";
    }
    if (drug.name === "Oxaliplatin" && selectedVolume && selectedVolume < 250) {
      return "Volumul minim pentru Oxaliplatin este 250 mL";
    }
    if (drug.name === "Paclitaxel" && selectedVolume) {
      const testDose = 200; // Example dose for concentration check
      const concentration = testDose / selectedVolume;
      if (concentration > 1.2) {
        return `Concentrația va fi prea mare (${concentration.toFixed(2)} mg/mL > 1.2 mg/mL)`;
      }
      if (concentration < 0.3) {
        return `Concentrația va fi prea mică (${concentration.toFixed(2)} mg/mL < 0.3 mg/mL)`;
      }
    }
    return null;
  };

  const validationError = validateSelection();

  return (
    <div className="space-y-3 p-3 bg-secondary/30 rounded-lg border">
      <h6 className="font-medium text-sm text-foreground">Selecție solvent și volum</h6>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Solvent</Label>
          <Select
            value={selectedSolventType || ""}
            onValueChange={onSolventTypeChange}
            disabled={disabled || drug.availableSolvents.length === 1}
          >
            <SelectTrigger className="mt-1 bg-background">
              <SelectValue placeholder="Selectați solventul" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {drug.availableSolvents.map((solvent) => (
                <SelectItem key={solvent} value={solvent}>
                  {solvent === "NS" ? "Ser fiziologic (NS)" : 
                   solvent === "D5W" ? "Glucoză 5% (D5W)" : solvent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {drug.availableSolvents.length === 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              Solvent obligatoriu pentru {drug.name}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">Volum</Label>
          <Select
            value={selectedVolume?.toString() || ""}
            onValueChange={(value) => onVolumeChange(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger className="mt-1 bg-background">
              <SelectValue placeholder="Selectați volumul" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {drug.availableVolumes.map((volume) => (
                <SelectItem key={volume} value={volume.toString()}>
                  {volume} mL
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};