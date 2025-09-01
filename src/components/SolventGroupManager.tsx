import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { PremedAgent, PremedSolventGroup, GroupedPremedications } from '@/types/clinicalTreatment';
import { Trash2, Plus, Beaker, Droplets, AlertTriangle, Edit2 } from 'lucide-react';
import { useTSafe } from '@/i18n/tSafe';
import { MedicationMultiSelector } from './MedicationMultiSelector';

interface SolventGroupManagerProps {
  selectedAgents: PremedAgent[];
  groupedPremedications: GroupedPremedications;
  onGroupingChange: (grouping: GroupedPremedications) => void;
}

const SOLVENT_OPTIONS = [
  { value: 'no-solvent', key: 'noSolvent', label: 'Fără solvent' },
  { value: 'Soluție NaCl 0.9% 100ml', key: 'normalSaline100' },
  { value: 'Soluție NaCl 0.9% 250ml', key: 'normalSaline250' },
  { value: 'Soluție NaCl 0.9% 500ml', key: 'normalSaline500' },
  { value: 'Soluție glucoză 5% 100ml', key: 'dextrose5_100' },
  { value: 'Soluție glucoză 5% 250ml', key: 'dextrose5_250' },
  { value: 'Soluție glucoză 5% 500ml', key: 'dextrose5_500' },
  { value: 'Soluție Ringer', key: 'ringer' }
];

export const SolventGroupManager: React.FC<SolventGroupManagerProps> = ({
  selectedAgents,
  groupedPremedications,
  onGroupingChange
}) => {
  const tSafe = useTSafe();
  const [localGrouping, setLocalGrouping] = useState<GroupedPremedications>(groupedPremedications);

  useEffect(() => {
    setLocalGrouping(groupedPremedications);
  }, [groupedPremedications]);

  const updateGrouping = (newGrouping: GroupedPremedications) => {
    setLocalGrouping(newGrouping);
    onGroupingChange(newGrouping);
  };

  const validateGrouping = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    localGrouping.groups.forEach((group, index) => {
      if (group.medications.length === 0) {
        errors.push(tSafe('solventGroups.validation.emptyPev', `PEV ${index + 1}: Niciun medicament asignat`, { pev: index + 1 }));
      }
    });
    
    return { isValid: errors.length === 0, errors };
  };

  const createNewGroup = () => {
    const newGroup: PremedSolventGroup = {
      id: `group-${Date.now()}`,
      solvent: 'no-solvent',
      medications: [],
      notes: ''
    };
    
    updateGrouping({
      ...localGrouping,
      groups: [...localGrouping.groups, newGroup]
    });
  };

  const deleteGroup = (groupId: string) => {
    updateGrouping({
      ...localGrouping,
      groups: localGrouping.groups.filter(g => g.id !== groupId)
    });
  };

  const updateGroupSolvent = (groupId: string, solvent: string) => {
    updateGrouping({
      ...localGrouping,
      groups: localGrouping.groups.map(group =>
        group.id === groupId ? { ...group, solvent } : group
      )
    });
  };

  const updateGroupNotes = (groupId: string, notes: string) => {
    updateGrouping({
      ...localGrouping,
      groups: localGrouping.groups.map(group =>
        group.id === groupId ? { ...group, notes } : group
      )
    });
  };

  const addMedicationsToGroup = (groupId: string, medications: PremedAgent[]) => {
    const group = localGrouping.groups.find(g => g.id === groupId);
    if (!group) return;
    
    // Filter out medications that are already in the group to avoid duplicates
    const newMedications = medications.filter(med => 
      !group.medications.some(existing => existing.name === med.name)
    );
    
    updateGrouping({
      ...localGrouping,
      groups: localGrouping.groups.map(g =>
        g.id === groupId ? { ...g, medications: [...g.medications, ...newMedications] } : g
      )
    });
  };

  const removeMedicationFromGroup = (groupId: string, medicationName: string) => {
    updateGrouping({
      ...localGrouping,
      groups: localGrouping.groups.map(group =>
        group.id === groupId 
          ? { ...group, medications: group.medications.filter(med => med.name !== medicationName) }
          : group
      )
    });
  };

  const updateMedicationInGroup = (groupId: string, medicationName: string, field: string, value: any) => {
    updateGrouping({
      ...localGrouping,
      groups: localGrouping.groups.map(group =>
        group.id === groupId 
          ? { 
              ...group, 
              medications: group.medications.map(med => 
                med.name === medicationName 
                  ? { ...med, [field]: value }
                  : med
              )
            }
          : group
      )
    });
  };

  const renderMedication = (medication: PremedAgent, groupId?: string) => (
    <div className="border rounded-md p-3 bg-background transition-all border-border hover:bg-muted/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="font-medium text-sm">{medication.name}</div>
          <div className="text-xs text-muted-foreground">
            {medication.dosage} {medication.route}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs">
            {medication.category}
          </Badge>
          {groupId && (
            <Button
              onClick={() => removeMedicationFromGroup(groupId, medication.name)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      {groupId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">{tSafe('units.unitCount', 'Număr unități')}</Label>
            <Input
              type="number"
              value={medication.unitCount || ''}
              onChange={(e) => updateMedicationInGroup(groupId, medication.name, 'unitCount', parseInt(e.target.value) || undefined)}
              className="h-8 mt-1"
              min="1"
              placeholder="1, 2, 3..."
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{tSafe('units.unitType', 'Tip unitate')}</Label>
            <select
              value={medication.unitType || ''}
              onChange={(e) => updateMedicationInGroup(groupId, medication.name, 'unitType', e.target.value)}
              className="w-full h-8 mt-1 px-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="">{tSafe('units.selectType', 'Selectați tipul')}</option>
              <option value="fiole">{tSafe('units.fiole', 'fiole')}</option>
              <option value="comprimate">{tSafe('units.comprimate', 'comprimate')}</option>
              <option value="flacoane">{tSafe('units.flacoane', 'flacoane')}</option>
              <option value="mg">{tSafe('units.mg', 'mg')}</option>
              <option value="ml">{tSafe('units.ml', 'ml')}</option>
            </select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{tSafe('units.userNotes', 'Note utilizator')}</Label>
            <Input
              value={medication.userNotes || ''}
              onChange={(e) => updateMedicationInGroup(groupId, medication.name, 'userNotes', e.target.value)}
              className="h-8 mt-1"
              placeholder={tSafe('units.userNotesPlaceholder', 'Note administrare...')}
            />
          </div>
        </div>
      )}
    </div>
  );

  const unassignedMedications = selectedAgents.filter(agent => 
    !localGrouping.groups.some(group => group.medications.some(med => med.name === agent.name))
  );

  return (
    <div className="space-y-6">
      <Alert>
        <Beaker className="h-4 w-4" />
        <AlertDescription>
          {tSafe('solventGroups.description', 'Organizați medicamentele în grupuri PEV pentru optimizarea administrării.')}
        </AlertDescription>
      </Alert>

      {/* Solvent Groups */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{tSafe('solventGroups.pevTitle', 'Grupuri PEV')}</h3>
          <Button onClick={createNewGroup} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {tSafe('solventGroups.addNewPev', 'Adaugă PEV nou')}
          </Button>
        </div>

        {localGrouping.groups.map((group, index) => (
          <Card key={group.id} className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplets className="h-4 w-4 text-primary" />
                  {tSafe('solventGroups.pevNumber', 'PEV {{number}}', { number: index + 1 })}
                </CardTitle>
                <Button
                  onClick={() => deleteGroup(group.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">{tSafe('unifiedSelector.solvent', 'Solvent')} ({tSafe('solventGroups.optional', 'opțional')})</Label>
                <Select
                  value={group.solvent}
                  onValueChange={(value) => updateGroupSolvent(group.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tSafe('doseCalculator.selectSolvent', 'Selectează solventul (opțional)')} />
                  </SelectTrigger>
                  <SelectContent>
                    {SOLVENT_OPTIONS.map((option) => (
                      <SelectItem key={option.key} value={option.value}>
                        {option.label || tSafe(`doseCalculator.solvents.${option.key}`, option.key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Medications in Group */}
              <div className="space-y-2">
                {group.medications.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{tSafe('solventGroups.medications', 'Medicamente în grup')}</Label>
                    {group.medications.map((medication) =>
                      renderMedication(medication, group.id)
                    )}
                  </div>
                )}
              </div>

              {/* Add Medications Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{tSafe('solventGroups.addMedications', 'Adaugă medicamente')}</Label>
                <MedicationMultiSelector
                  selectedMedications={[]}
                  onSelectionChange={(medications) => addMedicationsToGroup(group.id, medications)}
                  placeholder="Selectează medicamente pentru acest PEV..."
                />
              </div>
              
              {/* Notes Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{tSafe('solventGroups.notes', 'Note')}</Label>
                <Textarea
                  value={group.notes || ''}
                  onChange={(e) => updateGroupNotes(group.id, e.target.value)}
                  placeholder={tSafe('solventGroups.notesPlaceholder', 'Adăugați informații suplimentare despre acest PEV...')}
                  className="min-h-[60px] text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Bottom Add PEV Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={createNewGroup} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {tSafe('solventGroups.addNewPev', 'Adaugă PEV nou')}
          </Button>
        </div>
      </div>

      {/* Unassigned Medications */}
      {unassignedMedications.length > 0 && (
        <Card className="border-2 border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-warning">
              <AlertTriangle className="h-4 w-4" />
              {tSafe('solventGroups.unassigned', 'Medicamente neasignate')} ({unassignedMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unassignedMedications.map((medication) => (
                <div key={medication.name} className="flex items-center gap-2 p-2 bg-warning/5 border border-warning/20 rounded-md">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{medication.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {medication.dosage} {medication.route}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-warning/50">
                    {medication.category}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-warning mt-2">
              {tSafe('solventGroups.unassignedHelp', 'Aceste medicamente trebuie să fie asignate la un grup.')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {(() => {
        const validation = validateGrouping();
        if (!validation.isValid) {
          return (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-medium">{tSafe('solventGroups.validation.title', 'Vă rugăm să corectați următoarele probleme:')}</div>
                  {validation.errors.map((error, index) => (
                    <div key={index} className="text-sm">• {error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          );
        }
        return null;
      })()}
    </div>
  );
};