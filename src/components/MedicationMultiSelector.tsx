import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useAvailableMedications } from '@/hooks/useAvailableMedications';
import { PremedAgent } from '@/types/clinicalTreatment';
import { useTranslation } from 'react-i18next';

interface MedicationMultiSelectorProps {
  selectedMedications: PremedAgent[];
  onSelectionChange: (medications: PremedAgent[]) => void;
  placeholder?: string;
}

export const MedicationMultiSelector: React.FC<MedicationMultiSelectorProps> = ({
  selectedMedications,
  onSelectionChange,
  placeholder = "Selectează medicamente..."
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { categories, searchMedications } = useAvailableMedications();

  const filteredCategories = useMemo(() => 
    searchMedications(searchTerm), 
    [searchMedications, searchTerm]
  );

  const toggleMedication = (medication: PremedAgent) => {
    const isSelected = selectedMedications.some(med => med.name === medication.name);
    
    if (isSelected) {
      onSelectionChange(selectedMedications.filter(med => med.name !== medication.name));
    } else {
      onSelectionChange([...selectedMedications, medication]);
    }
  };

  const removeMedication = (medicationName: string) => {
    onSelectionChange(selectedMedications.filter(med => med.name !== medicationName));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const isMedicationSelected = (medication: PremedAgent) => 
    selectedMedications.some(med => med.name === medication.name);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Selectează medicamente pentru PEV</Label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-[40px] p-3"
            >
              {selectedMedications.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedMedications.slice(0, 3).map((med) => (
                    <Badge key={med.name} variant="secondary" className="text-xs">
                      {med.name}
                    </Badge>
                  ))}
                  {selectedMedications.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedMedications.length - 3} mai multe
                    </Badge>
                  )}
                </div>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-[400px] p-0" align="start">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Caută medicament..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {filteredCategories.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    Nu s-au găsit medicamente
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b">
                        {category.name} ({category.medications.length})
                      </div>
                      {category.medications.map((medication) => (
                        <div
                          key={medication.name}
                          className={cn(
                            "flex items-center space-x-2 rounded-sm px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                            isMedicationSelected(medication) && "bg-accent"
                          )}
                          onClick={() => toggleMedication(medication)}
                        >
                          <Checkbox
                            checked={isMedicationSelected(medication)}
                            onChange={() => toggleMedication(medication)}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="text-sm font-medium">{medication.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {medication.dosage} {medication.unit} • {medication.route} • {medication.category}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {selectedMedications.length > 0 && (
              <div className="p-2 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedMedications.length} selectate
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Șterge toate
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected medications display */}
      {selectedMedications.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Medicamente selectate ({selectedMedications.length})
          </Label>
          <div className="flex flex-wrap gap-1">
            {selectedMedications.map((medication) => (
              <Badge 
                key={medication.name} 
                variant="secondary" 
                className="text-xs flex items-center gap-1"
              >
                {medication.name}
                <button
                  onClick={() => removeMedication(medication.name)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};