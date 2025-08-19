import React from 'react';
import { CalculatedDrug } from '@/types/clinicalTreatment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ChemotherapyProtocolTableProps {
  calculatedDrugs: CalculatedDrug[];
  regimenName: string;
  clinicalNotes?: string;
}

export const ChemotherapyProtocolTable: React.FC<ChemotherapyProtocolTableProps> = ({ 
  calculatedDrugs, 
  regimenName,
  clinicalNotes
}) => {
  return (
    <div className="space-y-2">
      {/* Protocol header - more compact */}
      <div className="mb-1">
        <p className="font-semibold text-xs">Regim: {regimenName}</p>
      </div>

      {/* Compact Drugs table */}
      <Table className="w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-24">MEDICAMENT<br/>(Cale, Zi)</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-20">DOZĂ CALC.<br/>(mg/m²)</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-20">DOZĂ FINALĂ<br/>(mg)</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-20">SOLVENT<br/>(ml)</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center w-16">TIMP ADM.<br/>(min)</TableHead>
            <TableHead className="border border-gray-300 p-1 text-xs font-bold text-center">OBSERVAȚII</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculatedDrugs.map((drug, index) => (
            <TableRow key={index}>
              <TableCell className="border border-gray-300 p-1 text-xs">
                <div className="font-medium">{drug.name}</div>
                <div className="text-gray-600">{drug.route}, Z{drug.day}</div>
              </TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs text-center">
                {drug.calculatedDose}
              </TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs text-center">
                <div className="font-medium">{drug.finalDose}</div>
                {drug.adjustmentNotes && (
                  <div className="text-gray-600 text-xs">{drug.adjustmentNotes}</div>
                )}
              </TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs text-center">
                <div>{drug.solvent}</div>
              </TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs text-center">
                {drug.administrationDuration || 'Standard'}
              </TableCell>
              <TableCell className="border border-gray-300 p-1 text-xs">
                <div className="space-y-0.5">
                  {drug.preparationInstructions && (
                    <div>{drug.preparationInstructions}</div>
                  )}
                  {drug.notes && (
                    <div>{drug.notes}</div>
                  )}
                  {(drug.monitoring && Array.isArray(drug.monitoring) && drug.monitoring.length > 0) && (
                    <div className="text-gray-600">{drug.monitoring.join(', ')}</div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Clinical Notes - more compact */}
      {clinicalNotes && (
        <div className="mt-2 p-2 bg-gray-50 border border-gray-300 rounded">
          <h4 className="font-semibold mb-1 text-xs">Notificări clinice:</h4>
          <p className="text-xs">{clinicalNotes}</p>
        </div>
      )}
    </div>
  );
};