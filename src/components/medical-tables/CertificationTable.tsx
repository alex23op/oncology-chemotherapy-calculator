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
  const currentDate = new Date().toLocaleDateString('ro-RO');
  
  const certificationData = [
    {
      role: 'MEDIC',
      name: 'N/A',
      signature: '',
      date: currentDate
    },
    {
      role: 'ASISTENT',
      name: verifyingNurse || 'N/A',
      signature: '',
      date: currentDate
    },
    {
      role: 'FARMACIST',
      name: preparingPharmacist || 'N/A',
      signature: '',
      date: currentDate
    }
  ];

  return (
    <div className="space-y-2">
      {/* Main certification table - compact single table */}
      <Table className="w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-16">FUNCȚIE</TableHead>
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center">NUME ȘI PRENUME</TableHead>
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-24">SEMNĂTURĂ</TableHead>
            <TableHead className="border border-gray-300 p-0.5 text-xs font-bold text-center w-20">DATA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificationData.map((cert, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="border border-gray-300 p-0.5 text-xs font-semibold text-center bg-gray-50">
                {cert.role}
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-xs h-8">
                {cert.name}
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-xs h-8">
                <div className="border-b border-dotted border-gray-400 h-6 w-full">
                  {/* Space for signature */}
                </div>
              </TableCell>
              <TableCell className="border border-gray-300 p-0.5 text-xs text-center h-8">
                {cert.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};