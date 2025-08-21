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
          <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-16">ADMINISTRARE</TableHead>
          <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center">OBSERVAȚII</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Solvent Groups */}
        {solventGroups?.groups && solventGroups.groups.length > 0 && 
          solventGroups.groups.map((group) =>
            group.medications.map((med, index) => (
              <TableRow key={`group-${group.id}-${index}`} className="border-b border-gray-200">
                <TableCell className="border border-gray-300 p-0.5 text-xs">{med.name}</TableCell>
                <TableCell className="border border-gray-300 p-0.5 text-xs text-center">{med.dosage} {med.unit}</TableCell>
                <TableCell className="border border-gray-300 p-0.5 text-xs text-center">{med.route}, {med.timing}</TableCell>
                <TableCell className="border border-gray-300 p-0.5 text-xs">{group.solvent}, {med.administrationDuration || 'Standard'}</TableCell>
              </TableRow>
            ))
          )
        }
        
        {/* Individual Premedications */}
        {allPremedications.map((med, index) => (
          <TableRow key={`individual-${index}`} className="border-b border-gray-200">
            <TableCell className="border border-gray-300 p-0.5 text-xs">{med.name}</TableCell>
            <TableCell className="border border-gray-300 p-0.5 text-xs text-center">{med.dosage} {med.unit}</TableCell>
            <TableCell className="border border-gray-300 p-0.5 text-xs text-center">{med.route}, {med.timing}</TableCell>
            <TableCell className="border border-gray-300 p-0.5 text-xs">{med.solvent}, {med.administrationDuration || 'Standard'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};