import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TreatmentData } from '@/types/clinicalTreatment';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

interface CompactClinicalTreatmentSheetProps {
  treatmentData: TreatmentData;
  className?: string;
}

export const CompactClinicalTreatmentSheet = React.forwardRef<HTMLDivElement, CompactClinicalTreatmentSheetProps>(
  ({ treatmentData, className }, ref) => {
    const { patient, regimen, calculatedDrugs, emetogenicRisk, premedications } = treatmentData;

    const getRiskIcon = (level: string) => {
      switch (level) {
        case 'high': return <AlertTriangle className="h-3 w-3 text-destructive" />;
        case 'moderate': return <Shield className="h-3 w-3 text-warning" />;
        case 'low': return <CheckCircle className="h-3 w-3 text-success" />;
        default: return <CheckCircle className="h-3 w-3 text-muted-foreground" />;
      }
    };

    const getRiskBadgeVariant = (level: string) => {
      switch (level) {
        case 'high': return 'destructive';
        case 'moderate': return 'secondary';
        case 'low': return 'outline';
        default: return 'outline';
      }
    };

    const allMedications = [
      ...premedications.antiemetics.map(med => ({ ...med, category: 'Antiemetics' })),
      ...premedications.infusionReactionProphylaxis.map(med => ({ ...med, category: 'Infusion Reaction Prevention' })),
      ...premedications.gastroprotection.map(med => ({ ...med, category: 'GI Protection' })),
      ...premedications.organProtection.map(med => ({ ...med, category: 'Organ Protection' })),
      ...premedications.other.map(med => ({ ...med, category: 'Other' }))
    ];

    return (
      <div ref={ref} className={`${className} compact-treatment-sheet print:bg-white print:text-black print:text-xs print:leading-tight print:max-w-none`}>
        
        {/* Compact Header */}
        <div className="print:mb-3">
          <div className="text-center border-b-2 border-gray-800 pb-2 mb-3 print:border-black">
            <h1 className="text-lg font-bold print:text-base print:mb-1">
              CHEMOTHERAPY TREATMENT PROTOCOL
            </h1>
            <div className="flex justify-between items-center print:text-xs">
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span className="flex items-center gap-2">
                {getRiskIcon(emetogenicRisk.level)}
                <Badge variant={getRiskBadgeVariant(emetogenicRisk.level) as any} className="print:text-xs print:px-1 print:py-0">
                  {emetogenicRisk.level.toUpperCase()} RISK
                </Badge>
              </span>
            </div>
          </div>
          
          {/* Patient Info Table */}
          <table className="w-full print:text-xs print:mb-3 border border-gray-300 print:border-black">
            <tbody>
              <tr>
                <td className="font-semibold border-r border-gray-300 print:border-black print:px-1 print:py-0.5 w-1/6">Patient ID:</td>
                <td className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 w-1/6">{patient.patientId}</td>
                <td className="font-semibold border-r border-gray-300 print:border-black print:px-1 print:py-0.5 w-1/6">Weight:</td>
                <td className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 w-1/6">{patient.weight} kg</td>
                <td className="font-semibold border-r border-gray-300 print:border-black print:px-1 print:py-0.5 w-1/6">BSA:</td>
                <td className="print:px-1 print:py-0.5 w-1/6">{patient.bsa} m²</td>
              </tr>
              <tr className="border-t border-gray-300 print:border-black">
                <td className="font-semibold border-r border-gray-300 print:border-black print:px-1 print:py-0.5">Date:</td>
                <td className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5">{patient.treatmentDate}</td>
                <td className="font-semibold border-r border-gray-300 print:border-black print:px-1 print:py-0.5">CrCl:</td>
                <td className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5">{patient.creatinineClearance} mL/min</td>
                <td className="font-semibold border-r border-gray-300 print:border-black print:px-1 print:py-0.5">Cycle:</td>
                <td className="print:px-1 print:py-0.5">{patient.cycleNumber}</td>
              </tr>
              <tr className="border-t border-gray-300 print:border-black">
                <td className="font-semibold border-r border-gray-300 print:border-black print:px-1 print:py-0.5">Regimen:</td>
                <td className="print:px-1 print:py-0.5" colSpan={3}>{regimen.name}</td>
                <td className="font-semibold border-l border-r border-gray-300 print:border-black print:px-1 print:py-0.5">Schedule:</td>
                <td className="print:px-1 print:py-0.5">{regimen.schedule}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chemotherapy Drugs Table */}
        <div className="print:mb-3">
          <h3 className="font-bold print:text-sm print:mb-1 bg-gray-100 print:bg-gray-200 print:px-2 print:py-1 border-l-4 border-gray-800 print:border-black">
            CHEMOTHERAPY REGIMEN
          </h3>
          <table className="w-full print:text-xs border border-gray-300 print:border-black">
            <thead>
              <tr className="bg-gray-50 print:bg-gray-100">
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Drug</th>
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Calculated Dose</th>
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Final Dose</th>
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Route</th>
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Day</th>
                <th className="print:px-1 print:py-0.5 text-left font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {calculatedDrugs.map((drug, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                  <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 font-medium">{drug.name}</td>
                  <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">{drug.calculatedDose}</td>
                  <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 font-semibold">{drug.finalDose}</td>
                  <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">{drug.route}</td>
                  <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">{drug.day || 'N/A'}</td>
                  <td className="border-t border-gray-300 print:border-black print:px-1 print:py-0.5">{drug.administrationDuration || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Drug Notes */}
          {calculatedDrugs.some(drug => drug.adjustmentNotes || drug.preparationInstructions || drug.notes) && (
            <div className="print:mt-1">
              {calculatedDrugs.map((drug, index) => (
                (drug.adjustmentNotes || drug.preparationInstructions || drug.notes) && (
                  <div key={index} className="print:text-xs print:mb-1">
                    <span className="font-semibold">{drug.name}:</span>
                    {drug.adjustmentNotes && <span className="ml-1">Adjustment: {drug.adjustmentNotes}</span>}
                    {drug.preparationInstructions && <span className="ml-1">Prep: {drug.preparationInstructions}</span>}
                    {drug.notes && <span className="ml-1">Notes: {drug.notes}</span>}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Supportive Care Medications */}
        {allMedications.length > 0 && (
          <div className="print:mb-3">
            <h3 className="font-bold print:text-sm print:mb-1 bg-gray-100 print:bg-gray-200 print:px-2 print:py-1 border-l-4 border-gray-800 print:border-black">
              PREMEDICATION & SUPPORTIVE CARE
            </h3>
            <table className="w-full print:text-xs border border-gray-300 print:border-black">
              <thead>
                <tr className="bg-gray-50 print:bg-gray-100">
                  <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Medication</th>
                  <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Dose</th>
                  <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Route</th>
                  <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Timing</th>
                  <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Category</th>
                  <th className="print:px-1 print:py-0.5 text-left font-semibold">Given ☐</th>
                </tr>
              </thead>
              <tbody>
                {allMedications.map((med, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 font-medium">{med.name}</td>
                    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">{med.dosage}</td>
                    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">{med.route}</td>
                    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">{med.timing}</td>
                    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 print:text-xs">{med.category}</td>
                    <td className="border-t border-gray-300 print:border-black print:px-1 print:py-0.5 text-center">☐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Risk Details */}
        <div className="print:mb-3">
          <div className="grid grid-cols-2 gap-2 print:gap-1">
            <div className="border border-gray-300 print:border-black print:px-2 print:py-1">
              <div className="font-semibold print:text-xs">Acute Phase (0-24h)</div>
              <div className="print:text-xs">{emetogenicRisk.acuteRisk}</div>
            </div>
            <div className="border border-gray-300 print:border-black print:px-2 print:py-1">
              <div className="font-semibold print:text-xs">Delayed Phase (24-120h)</div>
              <div className="print:text-xs">{emetogenicRisk.delayedRisk}</div>
            </div>
          </div>
        </div>

        {/* Clinical Notes */}
        {treatmentData.clinicalNotes && (
          <div className="print:mb-3">
            <h4 className="font-semibold print:text-xs print:mb-1">Clinical Notes:</h4>
            <div className="border border-gray-300 print:border-black print:px-2 print:py-1 print:text-xs">
              {treatmentData.clinicalNotes}
            </div>
          </div>
        )}

        {/* Compact Signature Section */}
        <div className="print:mb-2">
          <table className="w-full print:text-xs border border-gray-300 print:border-black">
            <thead>
              <tr className="bg-gray-50 print:bg-gray-100">
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Verification</th>
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Name</th>
                <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold">Date/Time</th>
                <th className="print:px-1 print:py-0.5 text-left font-semibold">Signature</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-2 font-medium">Pharmacy:</td>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-2"></td>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-2"></td>
                <td className="border-t border-gray-300 print:border-black print:px-1 print:py-2"></td>
              </tr>
              <tr>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-2 font-medium">Nursing:</td>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-2"></td>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-2"></td>
                <td className="border-t border-gray-300 print:border-black print:px-1 print:py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center print:text-xs print:text-gray-600 border-t border-gray-300 print:border-black print:pt-1">
          <em>
            Computer-generated protocol. Verify all calculations before administration. 
            Document version: {new Date().toISOString().split('T')[0]}
          </em>
        </div>
      </div>
    );
  }
);

CompactClinicalTreatmentSheet.displayName = 'CompactClinicalTreatmentSheet';