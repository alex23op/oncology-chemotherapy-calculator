import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface CertificationTableProps {
  preparingPharmacist?: string;
  verifyingNurse?: string;
}

export const CertificationTable: React.FC<CertificationTableProps> = ({ 
  preparingPharmacist, 
  verifyingNurse 
}) => {
  const certificationData = [
    {
      role: 'MEDIC PRESCRIPTOR',
      name: '___________________________',
      signature: '',
      date: '_______________',
      responsibilities: 'Prescripție, indicație tratament, monitorizare clinică'
    },
    {
      role: 'FARMACIST PREPARATOR',
      name: preparingPharmacist || '___________________________',
      signature: '',
      date: '_______________',
      responsibilities: 'Preparare, verificare doze, control calitate'
    },
    {
      role: 'ASISTENT MEDICAL',
      name: verifyingNurse || '___________________________',
      signature: '',
      date: '_______________',
      responsibilities: 'Verificare identitate pacient, administrare, monitorizare'
    }
  ];

  return (
    <div>
      <Table className="border-2 border-foreground">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="border-r border-foreground font-semibold w-1/6">FUNCȚIE</TableHead>
            <TableHead className="border-r border-foreground font-semibold w-1/4">NUME ȘI PRENUME</TableHead>
            <TableHead className="border-r border-foreground font-semibold w-1/4">SEMNĂTURĂ</TableHead>
            <TableHead className="border-r border-foreground font-semibold w-1/6">DATA</TableHead>
            <TableHead className="border-r border-foreground font-semibold w-1/4">RESPONSABILITĂȚI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificationData.map((cert, index) => (
            <TableRow key={index} className="border-b border-foreground">
              <TableCell className="border-r border-foreground font-medium bg-muted/20 text-center">
                <div className="font-semibold text-sm">{cert.role}</div>
              </TableCell>
              <TableCell className="border-r border-foreground h-16">
                <div className="flex items-center h-full">
                  {cert.name}
                </div>
              </TableCell>
              <TableCell className="border-r border-foreground h-16">
                <div className="border-b-2 border-dotted border-muted-foreground h-8 w-full mt-4">
                  {/* Space for signature */}
                </div>
              </TableCell>
              <TableCell className="border-r border-foreground h-16">
                <div className="flex items-center h-full">
                  {cert.date}
                </div>
              </TableCell>
              <TableCell className="border-r border-foreground h-16">
                <div className="text-xs text-muted-foreground p-1">
                  {cert.responsibilities}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 p-3 border rounded bg-muted/10">
        <h4 className="font-semibold mb-2">DECLARAȚII ȘI RESPONSABILITĂȚI:</h4>
        <div className="text-xs space-y-2">
          <p>• Medicul prescriptor declară că a verificat indicația, contraindicațiile și dozele prescrise.</p>
          <p>• Farmacistul preparator confirmă corectitudinea calculelor și preparării medicamentelor.</p>
          <p>• Asistentul medical confirmă verificarea identității pacientului și administrarea conform prescripției.</p>
        </div>
        
        <div className="mt-4 border-t pt-2">
          <h5 className="font-semibold text-sm mb-2">OBSERVAȚII CLINICE SUPLIMENTARE:</h5>
          <div className="min-h-[3rem] border-b-2 border-dotted border-muted-foreground">
            {/* Space for additional clinical notes */}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center border-t pt-2">
        <p className="font-semibold">IMPORTANT:</p>
        <p>Această fișă trebuie păstrată în dosarul medical al pacientului și arhivată conform reglementărilor în vigoare.</p>
        <p>Data și ora administrării: ____________________</p>
      </div>
    </div>
  );
};