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
    return null;
  };

  const validationError = validateSelection();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Solvent</Label>
          <Select
            value={selectedSolventType || ""}
            onValueChange={onSolventTypeChange}
            disabled={disabled || drug.availableSolvents.length === 1}
          >
            <SelectTrigger className="mt-1">
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
        </div>

        <div>
          <Label className="text-sm font-medium">Volum</Label>
          <Select
            value={selectedVolume?.toString() || ""}
            onValueChange={(value) => onVolumeChange(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger className="mt-1">
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