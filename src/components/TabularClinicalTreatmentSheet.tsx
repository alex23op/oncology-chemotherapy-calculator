import React from 'react';
import { TreatmentData } from '@/types/clinicalTreatment';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/dateFormat';

interface TabularClinicalTreatmentSheetProps {
  treatmentData: TreatmentData;
  className?: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
}

export const TabularClinicalTreatmentSheet = React.forwardRef<HTMLDivElement, TabularClinicalTreatmentSheetProps>(
  ({ treatmentData, className, showPrintButton = false, onPrint }, ref) => {
    const { t } = useTranslation();
    const { patient, regimen, calculatedDrugs, emetogenicRisk, premedications, solventGroups } = treatmentData;

    const getRiskLevel = (level: string) => {
      switch (level) {
        case 'high': return t('emetogenicRisk.high');
        case 'moderate': return t('emetogenicRisk.moderate');
        case 'low': return t('emetogenicRisk.low');
        case 'minimal': return t('emetogenicRisk.minimal');
        default: return level;
      }
    };

    // Combine all premedications for unified display
    const allPremedications = [
      ...premedications.antiemetics,
      ...premedications.infusionReactionProphylaxis,
      ...premedications.gastroprotection,
      ...premedications.organProtection,
      ...premedications.other
    ];

    return (
      <div ref={ref} className={`${className} print:bg-white print:text-black space-y-6 print:space-y-4`}>
        {/* Print Button */}
        {showPrintButton && (
          <div className="print:hidden mb-4">
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {t('pdf.print')}
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center border-b-2 border-black pb-4 mb-6 print:mb-4">
          <h1 className="text-2xl font-bold print:text-xl">
            {t('compactSheet.mainTitle')}
          </h1>
          <p className="text-sm mt-2">
            {t('compactSheet.subtitle')}
          </p>
        </div>

        {/* Patient Data Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 print:text-base">{t('compactSheet.patientData')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black print:text-xs">
              <tbody>
                <tr>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100 w-1/4">
                    {t('compactSheet.fullName')}
                  </td>
                  <td className="border border-black px-3 py-2 w-1/4">
                    {patient.fullName || '_'.repeat(30)}
                  </td>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100 w-1/4">
                    {t('compactSheet.cnp')}
                  </td>
                  <td className="border border-black px-3 py-2 w-1/4">
                    {patient.cnp}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.foNumber')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {patient.foNumber || '_'.repeat(15)}
                  </td>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.cycleNumber')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {patient.cycleNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.weight')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {patient.weight}
                  </td>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.bsa')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {patient.bsa}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.treatmentDate')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {formatDate(patient.treatmentDate)}
                  </td>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.creatinineClearance')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {patient.creatinineClearance}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Regimen Information */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 print:text-base">{t('compactSheet.chemotherapyRegimen')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black print:text-xs">
              <tbody>
                <tr>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100 w-1/4">
                    {t('compactSheet.protocolName')}
                  </td>
                  <td className="border border-black px-3 py-2 w-3/4" colSpan={3}>
                    {regimen.name}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.schedule')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {regimen.schedule}
                  </td>
                  <td className="border border-black px-3 py-2 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.emetogenicRisk')}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {getRiskLevel(emetogenicRisk.level)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chemotherapy Drugs Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 print:text-base">{t('compactSheet.chemotherapyDrugs')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black print:text-xs">
              <thead>
                <tr className="bg-gray-50 print:bg-gray-100">
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.drug')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.calculatedDose')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.finalDose')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.route')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.day')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.duration')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.solvent')}</th>
                </tr>
              </thead>
              <tbody>
                {calculatedDrugs.map((drug, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                    <td className="border border-black px-2 py-2 font-medium">{drug.name}</td>
                    <td className="border border-black px-2 py-2">{drug.calculatedDose}</td>
                    <td className="border border-black px-2 py-2 font-medium">{drug.finalDose}</td>
                    <td className="border border-black px-2 py-2">{drug.route}</td>
                    <td className="border border-black px-2 py-2">{drug.day || '-'}</td>
                    <td className="border border-black px-2 py-2">{drug.administrationDuration || '-'}</td>
                    <td className="border border-black px-2 py-2">{drug.solvent || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premedication & Supportive Care */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 print:text-base">{t('compactSheet.premedSupport')}</h2>
          
          {/* PEV Groups if available */}
          {solventGroups && (solventGroups.groups.length > 0 || solventGroups.individual.length > 0) && (
            <div className="mb-4">
              <h3 className="text-base font-semibold mb-2 print:text-sm">{t('compactSheet.pevGroups')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-black print:text-xs">
                  <thead>
                    <tr className="bg-gray-50 print:bg-gray-100">
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.pevNumber')}</th>
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.medications')}</th>
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.solvent')}</th>
                      <th className="border border-black px-2 py-2 text-center font-bold">{t('compactSheet.administered')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solventGroups.groups.map((group, index) => (
                      <tr key={`group-${group.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                        <td className="border border-black px-2 py-2 font-medium">{index + 1} PEV</td>
                        <td className="border border-black px-2 py-2">
                          {group.medications.map((med, medIndex) => (
                            <span key={medIndex}>
                              {medIndex > 0 && ' + '}
                              <span className="font-medium">{med.name}</span>
                              <span className="text-sm"> ({med.dosage})</span>
                            </span>
                          ))}
                        </td>
                        <td className="border border-black px-2 py-2">{group.solvent}</td>
                        <td className="border border-black px-2 py-2 text-center">☐</td>
                      </tr>
                    ))}
                    {solventGroups.individual.map((med, index) => {
                      const pevNumber = solventGroups.groups.length + index + 1;
                      const rowIndex = solventGroups.groups.length + index;
                      return (
                        <tr key={`individual-${index}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                          <td className="border border-black px-2 py-2 font-medium">{pevNumber} PEV</td>
                          <td className="border border-black px-2 py-2">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-sm"> ({med.dosage})</span>
                          </td>
                          <td className="border border-black px-2 py-2">{med.solvent || '-'}</td>
                          <td className="border border-black px-2 py-2 text-center">☐</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Individual Premedications */}
          {allPremedications.length > 0 && (
            <div>
              <h3 className="text-base font-semibold mb-2 print:text-sm">{t('compactSheet.individualPremedications')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-black print:text-xs">
                  <thead>
                    <tr className="bg-gray-50 print:bg-gray-100">
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.medication')}</th>
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.dose')}</th>
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.route')}</th>
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.timing')}</th>
                      <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.category')}</th>
                      <th className="border border-black px-2 py-2 text-center font-bold">{t('compactSheet.administered')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPremedications.map((med, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                        <td className="border border-black px-2 py-2 font-medium">{med.name}</td>
                        <td className="border border-black px-2 py-2">{med.dosage}</td>
                        <td className="border border-black px-2 py-2">{med.route}</td>
                        <td className="border border-black px-2 py-2">{med.timing}</td>
                        <td className="border border-black px-2 py-2">{med.category}</td>
                        <td className="border border-black px-2 py-2 text-center">☐</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Clinical Verification Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 print:text-base">{t('compactSheet.clinicalVerification')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black print:text-xs">
              <thead>
                <tr className="bg-gray-50 print:bg-gray-100">
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.function')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.nameAndSurname')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.dateTime')}</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">{t('compactSheet.signature')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-3 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.preparingPharmacist')}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {treatmentData.preparingPharmacist || '_'.repeat(25)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(15)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(20)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-3 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.verifyingNurse')}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {treatmentData.verifyingNurse || '_'.repeat(25)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(15)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(20)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-3 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.verifyingPhysician')}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(25)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(15)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(20)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-2 py-3 font-medium bg-gray-50 print:bg-gray-100">
                    {t('compactSheet.administeringNurse')}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(25)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(15)}
                  </td>
                  <td className="border border-black px-2 py-3">
                    {'_'.repeat(20)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes Section */}
        {treatmentData.clinicalNotes && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 print:text-base">{t('compactSheet.clinicalNotes')}</h2>
            <div className="border-2 border-black p-3 min-h-20">
              <p className="text-sm">{treatmentData.clinicalNotes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-black text-xs print:text-xs">
          <div className="flex justify-between">
            <div>
              <strong>{t('compactSheet.generated')}:</strong> {new Date().toLocaleDateString('ro-RO')} la {new Date().toLocaleTimeString('ro-RO')}
            </div>
            <div>
              <strong>{t('compactSheet.page')}:</strong> 1
            </div>
          </div>
          <div className="text-center mt-2">
            <em>{t('compactSheet.completionNote')}</em>
          </div>
        </div>
      </div>
    );
  }
);

TabularClinicalTreatmentSheet.displayName = 'TabularClinicalTreatmentSheet';