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
    <div>
      <div className="mb-3 p-2 bg-accent/10 rounded border">
        <p className="font-medium">Protocol: <span className="font-bold">{regimenName}</span></p>
      </div>
      
      <Table className="border-2 border-foreground">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="border-r border-foreground font-semibold">MEDICAMENT</TableHead>
            <TableHead className="border-r border-foreground font-semibold">DOZĂ CALCULATĂ</TableHead>
            <TableHead className="border-r border-foreground font-semibold">DOZĂ FINALĂ</TableHead>
            <TableHead className="border-r border-foreground font-semibold">SOLVENT / DILUANT</TableHead>
            <TableHead className="border-r border-foreground font-semibold">TIMP ADMINISTRARE</TableHead>
            <TableHead className="border-r border-foreground font-semibold">OBSERVAȚII</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculatedDrugs.map((drug, index) => (
            <TableRow key={index} className="border-b border-foreground">
              <TableCell className="border-r border-foreground font-medium bg-muted/20">
                <div>
                  <div className="font-semibold">{drug.name}</div>
                  <div className="text-sm text-muted-foreground">{drug.route}</div>
                  {drug.day && <div className="text-xs">Ziua: {drug.day}</div>}
                </div>
              </TableCell>
              <TableCell className="border-r border-foreground">
                <div className="font-medium">{drug.calculatedDose}</div>
                <div className="text-sm text-muted-foreground">{drug.unit}</div>
              </TableCell>
              <TableCell className="border-r border-foreground">
                <div className="font-medium text-accent">{drug.finalDose}</div>
                <div className="text-sm text-muted-foreground">{drug.unit}</div>
                {drug.adjustmentNotes && (
                  <div className="text-xs text-warning mt-1">{drug.adjustmentNotes}</div>
                )}
              </TableCell>
              <TableCell className="border-r border-foreground">
                <div>{drug.solvent}</div>
                {drug.dilution && (
                  <div className="text-xs mt-1">{drug.dilution}</div>
                )}
              </TableCell>
              <TableCell className="border-r border-foreground">
                {drug.administrationDuration || 'Standard'}
              </TableCell>
              <TableCell className="border-r border-foreground">
                <div className="min-h-[3rem]">
                  {drug.preparationInstructions && (
                    <div className="text-sm mb-1">{drug.preparationInstructions}</div>
                  )}
                  {drug.notes && (
                    <div className="text-sm">{drug.notes}</div>
                  )}
                  {drug.monitoring && drug.monitoring.length > 0 && (
                    <div className="text-xs text-info mt-1">
                      Monitorizare: {drug.monitoring.join(', ')}
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {clinicalNotes && (
        <div className="mt-4 p-3 border rounded bg-muted/10">
          <h4 className="font-semibold mb-2">COMENTARII ȘI INSTRUCȚIUNI SUPLIMENTARE:</h4>
          <div className="min-h-[2rem] p-2 bg-background rounded">
            <div className="text-sm">{clinicalNotes}</div>
          </div>
        </div>
      )}
    </div>
  );
};