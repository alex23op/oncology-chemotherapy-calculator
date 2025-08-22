import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PremedAgent, PremedSolventGroup, GroupedPremedications } from '@/types/clinicalTreatment';
import { Trash2, Plus, GripVertical, Beaker, Droplets, AlertTriangle } from 'lucide-react';
import { useTSafe } from '@/i18n/tSafe';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MedicationMultiSelector } from './MedicationMultiSelector';

interface SolventGroupManagerProps {
  selectedAgents: PremedAgent[];
  groupedPremedications: GroupedPremedications;
  onGroupingChange: (grouping: GroupedPremedications) => void;
}

const SOLVENT_OPTIONS = [
  { value: 'Soluție NaCl 0.9% 100ml', key: 'normalSaline100' },
  { value: 'Soluție NaCl 0.9% 250ml', key: 'normalSaline250' },
  { value: 'Soluție NaCl 0.9% 500ml', key: 'normalSaline500' },
  { value: 'Soluție glucoză 5% 100ml', key: 'dextrose5_100' },
  { value: 'Soluție glucoză 5% 250ml', key: 'dextrose5_250' },
  { value: 'Soluție glucoză 5% 500ml', key: 'dextrose5_500' },
  { value: 'Ringer Solution', key: 'ringer' }
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
      if (!group.solvent.trim()) {
        errors.push(tSafe('solventGroups.validation.noSolvent', `PEV ${index + 1}: Niciun solvent selectat`, { pev: index + 1 }));
      }
      if (group.medications.length === 0) {
        errors.push(tSafe('solventGroups.validation.emptyPev', `PEV ${index + 1}: Niciun medicament asignat`, { pev: index + 1 }));
      }
    });
    
    return { isValid: errors.length === 0, errors };
  };

  const createNewGroup = () => {
    const newGroup: PremedSolventGroup = {
      id: `group-${Date.now()}`,
      solvent: '',
      medications: []
    };
    
    updateGrouping({
      ...localGrouping,
      groups: [...localGrouping.groups, newGroup]
    });
  };

  const deleteGroup = (groupId: string) => {
    const group = localGrouping.groups.find(g => g.id === groupId);
    if (!group) return;

    updateGrouping({
      groups: localGrouping.groups.filter(g => g.id !== groupId),
      individual: [...localGrouping.individual, ...group.medications]
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

  const addMedicationsToGroup = (groupId: string, medications: PremedAgent[]) => {
    updateGrouping({
      ...localGrouping,
      groups: localGrouping.groups.map(group =>
        group.id === groupId ? { ...group, medications: [...group.medications, ...medications] } : group
      )
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    const sourceDroppableId = source.droppableId;
    const destDroppableId = destination.droppableId;
    
    // Find the medication being moved
    let medicationToMove: PremedAgent | null = null;
    
    if (sourceDroppableId === 'individual') {
      medicationToMove = localGrouping.individual[source.index];
    } else {
      const sourceGroup = localGrouping.groups.find(g => g.id === sourceDroppableId);
      if (sourceGroup) {
        medicationToMove = sourceGroup.medications[source.index];
      }
    }
    
    if (!medicationToMove) return;
    
    // Remove from source
    let newIndividual = [...localGrouping.individual];
    let newGroups = [...localGrouping.groups];
    
    if (sourceDroppableId === 'individual') {
      newIndividual.splice(source.index, 1);
    } else {
      newGroups = newGroups.map(group => {
        if (group.id === sourceDroppableId) {
          const newMedications = [...group.medications];
          newMedications.splice(source.index, 1);
          return { ...group, medications: newMedications };
        }
        return group;
      });
    }
    
    // Add to destination
    if (destDroppableId === 'individual') {
      newIndividual.splice(destination.index, 0, medicationToMove);
    } else {
      newGroups = newGroups.map(group => {
        if (group.id === destDroppableId) {
          const newMedications = [...group.medications];
          newMedications.splice(destination.index, 0, medicationToMove);
          return { ...group, medications: newMedications };
        }
        return group;
      });
    }
    
    updateGrouping({
      groups: newGroups,
      individual: newIndividual
    });
  };

  const renderMedication = (medication: PremedAgent, index: number) => (
    <Draggable key={medication.name} draggableId={medication.name} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center gap-2 p-2 bg-background border rounded-md transition-all ${
            snapshot.isDragging ? 'shadow-lg border-primary' : 'border-border hover:bg-muted/50'
          }`}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="font-medium text-sm">{medication.name}</div>
            <div className="text-xs text-muted-foreground">
              {medication.dosage} {medication.route}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {medication.category}
          </Badge>
        </div>
      )}
    </Draggable>
  );

  const unassignedMedications = selectedAgents.filter(agent => 
    !localGrouping.individual.some(ind => ind.name === agent.name) &&
    !localGrouping.groups.some(group => group.medications.some(med => med.name === agent.name))
  );

  return (
    <div className="space-y-6">
      <Alert>
        <Beaker className="h-4 w-4" />
        <AlertDescription>
          {t('solventGroups.description')}
        </AlertDescription>
      </Alert>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Solvent Groups */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('solventGroups.pevTitle')}</h3>
            <Button onClick={createNewGroup} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              {t('solventGroups.addNewPev')}
            </Button>
          </div>

          {localGrouping.groups.map((group, index) => (
            <Card key={group.id} className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Droplets className="h-4 w-4 text-primary" />
                    {t('solventGroups.pevNumber', { number: index + 1 })}
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
                  <Label className="text-sm font-medium">{tSafe('unifiedSelector.solvent', 'Solvent')}</Label>
                  <Select
                    value={group.solvent}
                    onValueChange={(value) => updateGroupSolvent(group.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={tSafe('doseCalculator.selectSolvent', 'Selectează solventul')} />
                    </SelectTrigger>
                    <SelectContent>
                      {SOLVENT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(`doseCalculator.solvents.${option.key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={group.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[60px] p-3 border-2 border-dashed rounded-lg transition-colors ${
                        snapshot.isDraggingOver
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 bg-muted/25'
                      }`}
                    >
                      {group.medications.length === 0 ? (
                        <div className="space-y-4">
                          <MedicationMultiSelector
                            selectedMedications={[]}
                            onSelectionChange={(medications) => addMedicationsToGroup(group.id, medications)}
                            placeholder="Selectează medicamente pentru acest PEV..."
                          />
                          <div className="text-center text-muted-foreground text-xs border-t pt-2">
                            {t('solventGroups.dropHere')}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {group.medications.map((medication, index) =>
                            renderMedication(medication, index)
                          )}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Individual Medications */}
        <Card className="border-2 border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Beaker className="h-4 w-4" />
              {t('solventGroups.individual')} ({localGrouping.individual.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Droppable droppableId="individual">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[60px] p-3 border-2 border-dashed rounded-lg transition-colors ${
                    snapshot.isDraggingOver
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 bg-muted/25'
                  }`}
                >
                  {localGrouping.individual.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      {t('solventGroups.noIndividual')}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {localGrouping.individual.map((medication, index) =>
                        renderMedication(medication, index)
                      )}
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        {/* Unassigned Medications */}
        {unassignedMedications.length > 0 && (
          <Card className="border-2 border-warning/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-warning">
                <GripVertical className="h-4 w-4" />
                {t('solventGroups.unassigned')} ({unassignedMedications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {unassignedMedications.map((medication, index) => (
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
                {t('solventGroups.unassignedHelp')}
              </p>
            </CardContent>
          </Card>
        )}
      </DragDropContext>

      {/* Validation Errors */}
      {(() => {
        const validation = validateGrouping();
        if (!validation.isValid) {
          return (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-medium">{t('solventGroups.validation.title')}</div>
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