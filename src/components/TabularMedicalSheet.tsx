import React, { forwardRef } from 'react';
import { TreatmentData } from '@/types/clinicalTreatment';
import { useTranslation } from 'react-i18next';
import { PatientInfoTable } from './medical-tables/PatientInfoTable';
import { ChemotherapyProtocolTable } from './medical-tables/ChemotherapyProtocolTable';
import { PremedsTable } from './medical-tables/PremedsTable';
import { CertificationTable } from './medical-tables/CertificationTable';
import { AdditionalObservationsSection } from './medical-tables/AdditionalObservationsSection';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';

interface TabularMedicalSheetProps {
  treatmentData: TreatmentData;
  className?: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
}

export const TabularMedicalSheet = forwardRef<HTMLDivElement, TabularMedicalSheetProps>(
  ({ treatmentData, className, showPrintButton, onPrint }, ref) => {
    const { t } = useTranslation();

    return (
      <div ref={ref} className={`medical-sheet-print ${className || ''}`}>
        {/* Header */}
        <div className="mb-1 text-center border-b border-gray-300 pb-1">
          <h1 className="text-sm font-bold">FIȘĂ DE TRATAMENT CHIMIOTERAPIC</h1>
          {showPrintButton && onPrint && (
            <Button
              onClick={onPrint}
              variant="outline"
              size="sm"
              className="mt-1 print:hidden text-xs"
            >
              <Printer className="h-3 w-3 mr-1" />
              {t('common.print', 'Print')}
            </Button>
          )}
        </div>

        {/* Patient Information */}
        <div className="mb-1">
          <h2 className="text-xs font-bold bg-gray-100 p-0.5 border-l-2 border-primary mb-0.5">
            IDENTITATE PACIENT
          </h2>
          <PatientInfoTable patient={treatmentData.patient} />
        </div>

        {/* Premedication */}
        <div className="mb-1">
          <h2 className="text-xs font-bold bg-gray-100 p-0.5 border-l-2 border-primary mb-0.5">
            PREMEDICAȚIE ȘI ÎNGRIJIRI SUPORTIVE
          </h2>
          <PremedsTable 
            premedications={treatmentData.premedications}
            solventGroups={treatmentData.solventGroups}
          />
        </div>

        {/* Chemotherapy Protocol */}
        <div className="mb-1">
          <h2 className="text-xs font-bold bg-gray-100 p-0.5 border-l-2 border-primary mb-0.5">
            PROTOCOL CHIMIOTERAPIE
          </h2>
          <ChemotherapyProtocolTable 
            calculatedDrugs={treatmentData.calculatedDrugs}
            regimenName={treatmentData.regimen.name}
            clinicalNotes={treatmentData.clinicalNotes}
          />
        </div>

        {/* Additional Observations */}
        <div className="mb-1">
          <AdditionalObservationsSection observations={undefined} />
        </div>

        {/* Certification */}
        <div className="mb-1">
          <h2 className="text-xs font-bold bg-gray-100 p-0.5 border-l-2 border-primary mb-0.5">
            CERTIFICARE ȘI VALIDARE
          </h2>
          <CertificationTable 
            preparingPharmacist={treatmentData.preparingPharmacist}
            verifyingNurse={treatmentData.verifyingNurse}
          />
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center border-t border-gray-300 pt-0.5 mt-1">
          <p>Generat: {new Date().toLocaleString('ro-RO')} | Protocol: {treatmentData.regimen.name} | Ciclu: {treatmentData.patient.cycleNumber}</p>
          <p>Acest document a fost generat automat și necesită verificare clinică</p>
        </div>
      </div>
    );
  }
);

TabularMedicalSheet.displayName = 'TabularMedicalSheet';