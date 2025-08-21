import React from 'react';
import { PatientInfo } from '@/types/clinicalTreatment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { EditableDateField } from './EditableDateField';

interface PatientInfoTableProps {
  patient: PatientInfo;
  onPatientUpdate?: (updatedPatient: Partial<PatientInfo>) => void;
}

export const PatientInfoTable: React.FC<PatientInfoTableProps> = ({ patient, onPatientUpdate }) => {
  const calculateAge = (cnp: string): number => {
    if (!cnp || cnp.length < 7) return patient.age;
    
    const year = parseInt(cnp.substring(1, 3));
    const month = parseInt(cnp.substring(3, 5)) - 1;
    const day = parseInt(cnp.substring(5, 7));
    
    let birthYear = year;
    const firstDigit = parseInt(cnp.charAt(0));
    
    if (firstDigit === 1 || firstDigit === 2) {
      birthYear += 1900;
    } else if (firstDigit === 5 || firstDigit === 6) {
      birthYear += 2000;
    }
    
    const birthDate = new Date(birthYear, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-3">
        {/* Patient Identity Section */}
        <div>
          <h4 className="text-xs font-bold bg-gray-50 p-2 border-l-2 border-primary">IDENTITATE PACIENT</h4>
          <Table className="w-full border-collapse border border-gray-300">
            <TableBody>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Nume și prenume:</TableCell>
                <TableCell className="p-1 text-xs">{patient.fullName || 'N/A'}</TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">CNP:</TableCell>
                <TableCell className="p-1 text-xs">{patient.cnp || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Nr. F.O.:</TableCell>
                <TableCell className="p-1 text-xs">{patient.foNumber || 'N/A'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Anthropometric Data Section */}
        <div>
          <h4 className="text-xs font-bold bg-gray-50 p-2 border-l-2 border-primary">DATE ANTROPOMETRICE</h4>
          <Table className="w-full border-collapse border border-gray-300">
            <TableBody>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Vârsta:</TableCell>
                <TableCell className="p-1 text-xs">{patient.cnp ? `${calculateAge(patient.cnp)} ani` : `${patient.age || 0} ani`}</TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Greutate:</TableCell>
                <TableCell className="p-1 text-xs">{patient.weight} kg</TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Înălțime:</TableCell>
                <TableCell className="p-1 text-xs">{patient.height} cm</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">BSA:</TableCell>
                <TableCell className="p-1 text-xs">{patient.bsa.toFixed(2)} m²</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Right Column */}
      <div>
        {/* Treatment Protocol Section */}
        <div>
          <h4 className="text-xs font-bold bg-gray-50 p-2 border-l-2 border-primary">PROTOCOL TRATAMENT</h4>
          <Table className="w-full border-collapse border border-gray-300">
            <TableBody>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Ciclu nr.:</TableCell>
                <TableCell className="p-1 text-xs">{patient.cycleNumber?.toString() || 'N/A'}</TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Data tratament:</TableCell>
                <TableCell className="p-1 text-xs">
                  <EditableDateField
                    value={patient.treatmentDate || ''}
                    onChange={(newDate: string) => onPatientUpdate?.({ treatmentDate: newDate })}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-300">
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Data ciclu următor:</TableCell>
                <TableCell className="p-1 text-xs">
                  <EditableDateField
                    value={patient.nextCycleDate || ''}
                    onChange={(newDate: string) => onPatientUpdate?.({ nextCycleDate: newDate })}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold border-r border-gray-300 w-2/5 p-1 text-xs bg-gray-50">Clearance creatinină:</TableCell>
                <TableCell className="p-1 text-xs">{patient.creatinineClearance} ml/min</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};