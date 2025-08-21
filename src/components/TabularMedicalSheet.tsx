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
        <div className="mb-2 text-center border-b border-gray-300 pb-2">
          <h1 className="text-sm font-bold mb-1">FIȘĂ DE TRATAMENT CHIMIOTERAPIC</h1>
          <p className="text-xs text-gray-600">
            Protocol: {treatmentData.regimen.name} | Ciclu: {treatmentData.patient.cycleNumber}
          </p>
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
        <div className="mb-2">
          <h2 className="text-xs font-bold bg-gray-100 p-1 border-l-2 border-primary mb-1">
            1. INFORMAȚII PACIENT
          </h2>
          <PatientInfoTable patient={treatmentData.patient} />
        </div>

        {/* Premedication - BEFORE chemotherapy */}
        <div className="mb-2">
          <h2 className="text-xs font-bold bg-gray-100 p-1 border-l-2 border-primary mb-1">
            2. PREMEDICAȚIE ȘI ÎNGRIJIRI SUPORTIVE
          </h2>
          <PremedsTable 
            premedications={treatmentData.premedications}
            solventGroups={treatmentData.solventGroups}
          />
        </div>

        {/* Chemotherapy Protocol - AFTER premedication */}
        <div className="mb-2">
          <h2 className="text-xs font-bold bg-gray-100 p-1 border-l-2 border-primary mb-1">
            3. PROTOCOL CHIMIOTERAPIE
          </h2>
          <ChemotherapyProtocolTable 
            calculatedDrugs={treatmentData.calculatedDrugs}
            regimenName={treatmentData.regimen.name}
            clinicalNotes={treatmentData.clinicalNotes}
          />
        </div>

        {/* Additional Observations - NEW SECTION */}
        <div className="mb-2">
          <AdditionalObservationsSection observations={undefined} />
        </div>

        {/* Certification */}
        <div className="mb-2">
          <h2 className="text-xs font-bold bg-gray-100 p-1 border-l-2 border-primary mb-1">
            4. CERTIFICARE ȘI VALIDARE
          </h2>
          <CertificationTable 
            preparingPharmacist={treatmentData.preparingPharmacist}
            verifyingNurse={treatmentData.verifyingNurse}
          />
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center border-t border-gray-300 pt-1 mt-2">
          <p>Generat: {new Date().toLocaleString('ro-RO')}</p>
          <p>Acest document a fost generat automat și necesită verificare clinică</p>
        </div>
      </div>
    );
  }
);

TabularMedicalSheet.displayName = 'TabularMedicalSheet';