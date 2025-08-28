import React from 'react';
import { TreatmentData } from '@/types/clinicalTreatment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface PremedsTableProps {
  premedications: TreatmentData['premedications'];
  solventGroups?: TreatmentData['solventGroups'];
}

export const PremedsTable: React.FC<PremedsTableProps> = ({ premedications, solventGroups }) => {
  // Collect all premedication agents
  const allPremedications = [
    ...premedications.antiemetics,
    ...premedications.infusionReactionProphylaxis,
    ...premedications.gastroprotection,
    ...premedications.organProtection,
    ...premedications.other
  ];

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'antiemetics': return 'ANT';
      case 'infusionReactionProphylaxis': return 'IRP';
      case 'gastroprotection': return 'GAP';
      case 'organProtection': return 'ORP';
      default: return 'ALT';
    }
  };

  return (
    <Table className="w-full border-collapse border border-gray-300">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center">MEDICAMENT</TableHead>
          <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-16">DOZĂ</TableHead>
          <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center">NOTE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Solvent Groups */}
        {solventGroups?.groups && solventGroups.groups.length > 0 && 
          solventGroups.groups.map((group, groupIndex) => (
            <React.Fragment key={`group-${group.id}`}>
              {/* Group header row */}
              <TableRow className="bg-gray-50 border-b-2 border-gray-400">
                <TableCell colSpan={3} className="border border-gray-300 p-1 text-xs font-bold">
                  PEV {groupIndex + 1} - {group.solvent}
                </TableCell>
              </TableRow>
              {/* Group medications */}
              {group.medications.map((med, medIndex) => (
                <TableRow key={`group-${group.id}-med-${medIndex}`} className="border-b border-gray-200">
                  <TableCell className="border border-gray-300 p-0.5 text-xs pl-4">• {med.name}</TableCell>
                  <TableCell className="border border-gray-300 p-0.5 text-xs text-center">
                    {med.unitCount && med.unitType ? (
                      `${med.unitCount} ${med.unitType}`
                    ) : (
                      `${med.dosage} ${med.unit}`
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-0.5 text-xs">{med.userNotes || ''}</TableCell>
                </TableRow>
              ))}
              {/* Group notes row */}
              {group.notes && (
                <TableRow className="border-b border-gray-300">
                  <TableCell colSpan={3} className="border border-gray-300 p-1 text-xs italic bg-gray-25">
                    <strong>Note:</strong> {group.notes}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        }
        
        {/* Individual Premedications */}
        {allPremedications.map((med, index) => (
          <TableRow key={`individual-${index}`} className="border-b border-gray-200">
            <TableCell className="border border-gray-300 p-0.5 text-xs">{med.name}</TableCell>
            <TableCell className="border border-gray-300 p-0.5 text-xs text-center">
              {med.unitCount && med.unitType ? (
                `${med.unitCount} ${med.unitType}`
              ) : (
                `${med.dosage} ${med.unit}`
              )}
            </TableCell>
            <TableCell className="border border-gray-300 p-0.5 text-xs">{med.userNotes || ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};