import React, { forwardRef } from 'react';
import { TreatmentData } from '@/types/clinicalTreatment';
import { useTranslation } from 'react-i18next';
import { PatientInfoTable } from './medical-tables/PatientInfoTable';
import { ChemotherapyProtocolTable } from './medical-tables/ChemotherapyProtocolTable';
import { PremedsTable } from './medical-tables/PremedsTable';
import { CertificationTable } from './medical-tables/CertificationTable';
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
        <div className="mb-6 text-center border-b-2 border-primary pb-4">
          <h1 className="text-2xl font-bold mb-2">FIȘĂ DE TRATAMENT CHIMIOTERAPIC</h1>
          <p className="text-muted-foreground">
            Protocol: {treatmentData.regimen.name} | Ciclu: {treatmentData.patient.cycleNumber}
          </p>
          {showPrintButton && onPrint && (
            <Button
              onClick={onPrint}
              variant="outline"
              size="sm"
              className="mt-2 print:hidden"
            >
              <Printer className="h-4 w-4 mr-2" />
              {t('common.print', 'Print')}
            </Button>
          )}
        </div>

        {/* Patient Information */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2 bg-muted p-1.5 rounded text-sm">
            1. INFORMAȚII PACIENT
          </h2>
          <PatientInfoTable patient={treatmentData.patient} />
        </div>

        {/* Premedication - BEFORE chemotherapy as requested by user */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2 bg-muted p-1.5 rounded text-sm">
            2. PREMEDICAȚIE ȘI ÎNGRIJIRI SUPORTIVE
          </h2>
          <PremedsTable 
            premedications={treatmentData.premedications}
            solventGroups={treatmentData.solventGroups}
          />
        </div>

        {/* Chemotherapy Protocol - AFTER premedication as requested by user */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2 bg-muted p-1.5 rounded text-sm">
            3. PROTOCOL CHIMIOTERAPIE
          </h2>
          <ChemotherapyProtocolTable 
            calculatedDrugs={treatmentData.calculatedDrugs}
            regimenName={treatmentData.regimen.name}
            clinicalNotes={treatmentData.clinicalNotes}
          />
        </div>

        {/* Certification */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2 bg-muted p-1.5 rounded text-sm">
            4. CERTIFICARE ȘI VALIDARE
          </h2>
          <CertificationTable 
            preparingPharmacist={treatmentData.preparingPharmacist}
            verifyingNurse={treatmentData.verifyingNurse}
          />
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground text-center border-t pt-4">
          <p>Generat: {new Date().toLocaleString('ro-RO')}</p>
          <p>Acest document a fost generat automat și necesită verificare clinică</p>
        </div>
      </div>
    );
  }
);

TabularMedicalSheet.displayName = 'TabularMedicalSheet';