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
    <div className="space-y-1">
      {/* Protocol header - minimal */}
      <div className="mb-1">
        <p className="font-semibold text-xs">Regim: {regimenName}</p>
      </div>

      {/* Ultra-compact drugs table */}
      <Table className="w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-20">MEDICAMENT</TableHead>
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-16">DOZĂ</TableHead>
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-20">SOLVENȚI/<br/>DILUANȚI</TableHead>
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-16">DURATA<br/>ADM.</TableHead>
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center">OBSERVAȚII SUPLIMENTARE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculatedDrugs.map((drug, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="border border-gray-300 p-0.5 text-xs">
                <div className="font-medium">{drug.name}</div>
                <div className="text-gray-600 text-xs">{drug.route}, Z{drug.day}</div>
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-xs text-center">
                <div className="font-medium">{drug.finalDose} mg</div>
                <div className="text-gray-600 text-xs">({drug.calculatedDose} mg/m²)</div>
                {drug.adjustmentNotes && (
                  <div className="text-gray-600 text-xs">{drug.adjustmentNotes}</div>
                )}
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-xs text-center">
                <div>{drug.solvent}</div>
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-xs text-center">
                <div>{drug.administrationDuration || 'Standard'}</div>
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-xs">
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

      {/* Clinical Notes - ultra compact */}
      {clinicalNotes && (
        <div className="mt-1 p-1 bg-gray-50 border border-gray-300">
          <h4 className="font-semibold mb-1 text-xs">Notificări clinice:</h4>
          <p className="text-xs">{clinicalNotes}</p>
        </div>
      )}
    </div>
  );
};