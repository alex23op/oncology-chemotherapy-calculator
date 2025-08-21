import React from 'react';
import { PatientInfo } from '@/types/clinicalTreatment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { EditableDateField } from './EditableDateField';

interface PatientInfoTableProps {
  patient: PatientInfo;
  onPatientUpdate?: (updatedPatient: Partial<PatientInfo>) => void;
}

export const PatientInfoTable: React.FC<PatientInfoTableProps> = ({ patient, onPatientUpdate }) => {
  return (
    <Table className="w-full border-collapse border border-gray-300">
      <TableBody>
        <TableRow className="border-b border-gray-300">
          <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-0.5 text-xs bg-gray-50">Nume și prenume:</TableCell>
          <TableCell className="p-0.5 text-xs">{patient.fullName || 'N/A'}</TableCell>
        </TableRow>
        <TableRow className="border-b border-gray-300">
          <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-0.5 text-xs bg-gray-50">CNP:</TableCell>
          <TableCell className="p-0.5 text-xs">{patient.cnp || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-0.5 text-xs bg-gray-50">Nr. F.O.:</TableCell>
          <TableCell className="p-0.5 text-xs">{patient.foNumber || 'N/A'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};