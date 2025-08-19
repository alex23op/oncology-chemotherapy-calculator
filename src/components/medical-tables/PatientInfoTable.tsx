import React from 'react';
import { PatientInfo } from '@/types/clinicalTreatment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface PatientInfoTableProps {
  patient: PatientInfo;
}

export const PatientInfoTable: React.FC<PatientInfoTableProps> = ({ patient }) => {
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

  // Organize data in 3 columns for compact display
  const patientData = [
    [
      { label: 'CNP', value: patient.cnp || 'N/A' },
      { label: 'Nr. FO', value: patient.foNumber || 'N/A' },
      { label: 'Nume complet', value: patient.fullName || 'N/A' },
      { label: 'Diagnostic', value: patient.diagnosis || 'N/A' },
      { label: 'Grupa sanguină', value: patient.bloodType || 'N/A' },
    ],
    [
      { label: 'Vârsta', value: patient.cnp ? `${calculateAge(patient.cnp)} ani` : `${patient.age || 0} ani` },
      { label: 'Sex', value: patient.sex || 'N/A' },
      { label: 'Greutate', value: `${patient.weight} kg` },
      { label: 'Înălțime', value: `${patient.height} cm` },
      { label: 'BSA', value: `${patient.bsa.toFixed(2)} m²` },
    ],
    [
      { label: 'Clearance creatinină', value: `${patient.creatinineClearance} ml/min` },
      { label: 'Ciclu nr.', value: patient.cycleNumber?.toString() || 'N/A' },
      { label: 'Data tratament', value: new Date(patient.treatmentDate).toLocaleDateString('ro-RO') },
      { label: 'Data ciclu următor', value: patient.nextCycleDate ? new Date(patient.nextCycleDate).toLocaleDateString('ro-RO') : 'N/A' },
      { label: '', value: '' }, // Empty cell for alignment
    ]
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {patientData.map((column, colIndex) => (
        <Table key={colIndex} className="w-full border-collapse border border-gray-300">
          <TableBody>
            {column.map((item, index) => (
              item.label ? (
                <TableRow key={index} className="border-b border-gray-300">
                  <TableCell className="font-semibold border-r border-gray-300 w-1/2 p-1 text-xs">
                    {item.label}:
                  </TableCell>
                  <TableCell className="p-1 w-1/2 text-xs">
                    {item.value}
                  </TableCell>
                </TableRow>
              ) : null
            ))}
          </TableBody>
        </Table>
      ))}
    </div>
  );
};