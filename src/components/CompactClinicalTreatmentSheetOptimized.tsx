import React, { memo, forwardRef } from 'react';
import { TreatmentData } from '@/types/clinicalTreatment';
import { useTranslation } from 'react-i18next';
import { ClinicalErrorBoundary } from './ClinicalErrorBoundary';
import { TabularClinicalTreatmentSheet } from './TabularClinicalTreatmentSheet';

interface CompactClinicalTreatmentSheetProps {
  treatmentData: TreatmentData;
  className?: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
}

const CompactClinicalTreatmentSheetCore = memo(forwardRef<HTMLDivElement, CompactClinicalTreatmentSheetProps>(
  ({ treatmentData, className, showPrintButton, onPrint }, ref) => {
    const { t } = useTranslation();

    // Early return if required data is missing
    if (!treatmentData.calculatedDrugs || treatmentData.calculatedDrugs.length === 0) {
      return (
        <div className={className}>
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('compactSheet.noDrugsCalculated')}</p>
          </div>
        </div>
      );
    }

    return (
      <TabularClinicalTreatmentSheet 
        treatmentData={treatmentData}
        className={className}
        showPrintButton={showPrintButton}
        onPrint={onPrint}
        ref={ref}
      />
    );
  }
));

CompactClinicalTreatmentSheetCore.displayName = 'CompactClinicalTreatmentSheetCore';

export const CompactClinicalTreatmentSheetOptimized = forwardRef<HTMLDivElement, CompactClinicalTreatmentSheetProps>(
  (props, ref) => (
    <ClinicalErrorBoundary>
      <CompactClinicalTreatmentSheetCore {...props} ref={ref} />
    </ClinicalErrorBoundary>
  )
);

CompactClinicalTreatmentSheetOptimized.displayName = 'CompactClinicalTreatmentSheetOptimized';