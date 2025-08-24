import React, { useState, useEffect } from 'react';
import type { PremedAgent, GroupedPremedications } from '@/types/clinicalTreatment';
import { SolventGroupManager } from './SolventGroupManager';

interface UnifiedProtocolSelectorProps {
  drugNames: string[];
  emetogenicRisk: "high" | "moderate" | "low" | "minimal";
  selectedAgents?: LocalPremedAgent[];
  onSelectionChange?: (agents: LocalPremedAgent[]) => void;
  onGroupingChange?: (groupedPremedications: GroupedPremedications) => void;
  patientWeight?: number;
}

interface LocalPremedAgent extends PremedAgent {
  administrationDuration?: string;
  weightBased?: boolean;
  notes?: string;
  evidenceLevel?: string;
  drugSpecific?: string[];
}

export default function UnifiedProtocolSelector({
  drugNames = [],
  emetogenicRisk,
  selectedAgents = [],
  onSelectionChange,
  onGroupingChange,
  patientWeight
}: UnifiedProtocolSelectorProps) {
  const [localSelectedAgents, setLocalSelectedAgents] = useState<LocalPremedAgent[]>(selectedAgents);
  const [groupedPremedications, setGroupedPremedications] = useState<GroupedPremedications>({
    groups: [],
    individual: []
  });

  // Notify parent component when selection changes
  useEffect(() => {
    onSelectionChange?.(localSelectedAgents);
  }, [localSelectedAgents, onSelectionChange]);

  // Update grouped medications when selection changes
  useEffect(() => {
    const updatedGrouped = {
      ...groupedPremedications,
      individual: localSelectedAgents.filter(agent => 
        !groupedPremedications.groups.some(group => 
          group.medications.some(med => med.name === agent.name)
        )
      )
    };
    setGroupedPremedications(updatedGrouped);
    onGroupingChange?.(updatedGrouped);
  }, [localSelectedAgents, groupedPremedications.groups, onGroupingChange]);

  return (
    <div className="space-y-6">
      <SolventGroupManager
        selectedAgents={localSelectedAgents}
        groupedPremedications={groupedPremedications}
        onGroupingChange={(newGrouping) => {
          setGroupedPremedications(newGrouping);
          onGroupingChange?.(newGrouping);
        }}
      />
    </div>
  );
}
