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
    <div className="space-y-2">
      {/* Combined Compact Table for all premedications */}
      <Table className="w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-16">TIP</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center">MEDICAMENT</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-20">DOZĂ</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-12">CALE</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-16">TIMING</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-20">SOLVENT</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center">OBSERVAȚII</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Solvent Groups */}
          {solventGroups?.groups && solventGroups.groups.length > 0 && 
            solventGroups.groups.map((group) =>
              group.medications.map((med, index) => (
                <TableRow key={`group-${group.id}-${index}`}>
                  <TableCell className="border border-gray-300 p-1 text-xs font-medium">PEV</TableCell>
                  <TableCell className="border border-gray-300 p-1 text-xs">{med.name}</TableCell>
                  <TableCell className="border border-gray-300 p-1 text-xs">{med.dosage} {med.unit}</TableCell>
                  <TableCell className="border border-gray-300 p-1 text-xs">{med.route}</TableCell>
                  <TableCell className="border border-gray-300 p-1 text-xs">{med.timing}</TableCell>
                  <TableCell className="border border-gray-300 p-1 text-xs">{group.solvent}</TableCell>
                  <TableCell className="border border-gray-300 p-1 text-xs">{med.administrationDuration || 'Standard'}</TableCell>
                </TableRow>
              ))
            )
          }
          
          {/* Individual Premedications */}
          {allPremedications.map((med, index) => (
            <TableRow key={`individual-${index}`}>
              <TableCell className="border border-gray-300 p-1 text-xs font-medium">{getCategoryName(med.category)}</TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs">{med.name}</TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs">{med.dosage} {med.unit}</TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs">{med.route}</TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs">{med.timing}</TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs">{med.solvent}</TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs">{med.administrationDuration || 'Standard'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};