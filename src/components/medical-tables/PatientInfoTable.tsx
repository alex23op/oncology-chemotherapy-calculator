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

  const patientData = [
    { label: 'Nume și prenume', value: patient.fullName || 'N/A' },
    { label: 'CNP', value: patient.cnp || 'N/A' },
    { label: 'Număr FO', value: patient.foNumber || 'N/A' },
    { label: 'Vârsta', value: `${calculateAge(patient.cnp)} ani` },
    { label: 'Greutate (kg)', value: `${patient.weight} kg` },
    { label: 'Înălțime (cm)', value: `${patient.height} cm` },
    { label: 'Suprafață corporală (m²)', value: `${patient.bsa.toFixed(2)} m²` },
    { label: 'Sex', value: patient.sex || 'N/A' },
    { label: 'Clearance-ul creatininei', value: `${patient.creatinineClearance} ml/min` },
    { label: 'Data tratament', value: new Date(patient.treatmentDate).toLocaleDateString('ro-RO') },
    { label: 'Data următorul ciclu', value: patient.nextCycleDate ? new Date(patient.nextCycleDate).toLocaleDateString('ro-RO') : 'N/A' },
    { label: 'Diagnostic', value: patient.diagnosis || 'N/A' },
    { label: 'Grupa sanguină', value: patient.bloodType || 'N/A' },
    { label: 'Ciclu numărul', value: `${patient.cycleNumber}` }
  ];

  return (
    <Table className="border-2 border-foreground">
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="border-r border-foreground font-semibold w-1/3">CÂMP</TableHead>
          <TableHead className="border-r border-foreground font-semibold w-2/3">VALOARE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patientData.map((item, index) => (
          <TableRow key={index} className="border-b border-foreground">
            <TableCell className="border-r border-foreground font-medium bg-muted/20">
              {item.label}
            </TableCell>
            <TableCell className="border-r border-foreground min-h-[2rem]">
              {item.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};