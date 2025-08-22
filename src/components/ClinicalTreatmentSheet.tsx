import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TreatmentData } from '@/types/clinicalTreatment';
import { Calendar, FileText, Pill, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTSafe } from '@/i18n/tSafe';
import { formatDate, toLocalISODate } from '@/utils/dateFormat';

interface ClinicalTreatmentSheetProps {
  treatmentData: TreatmentData;
  className?: string;
}

export const ClinicalTreatmentSheet = React.forwardRef<HTMLDivElement, ClinicalTreatmentSheetProps>(
  ({ treatmentData, className }, ref) => {
    const tSafe = useTSafe();
    const { patient, regimen, calculatedDrugs, premedications } = treatmentData;

    const getRiskIcon = (level: string) => {
      switch (level) {
        case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />;
        case 'moderate': return <Shield className="h-4 w-4 text-warning" />;
        case 'low': return <CheckCircle className="h-4 w-4 text-success" />;
        default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
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

    return (
      <div ref={ref} className={`${className} print:bg-background print:text-foreground space-y-6`}>
        {/* Header Section */}
        <div className="print:mb-4">
          <div className="text-center border-b-2 border-primary pb-4 mb-6 print:border-border">
            <h1 className="text-3xl font-bold text-primary print:text-2xl">
              {tSafe('clinicalSheet.mainTitle', 'Clinical Treatment Sheet')}
            </h1>
            <p className="text-muted-foreground mt-2 print:text-foreground">
              {tSafe('clinicalSheet.subtitle', 'Oncology Treatment Protocol')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.patientId', 'Patient ID')}</span>
              <p className="font-bold text-lg print:text-base">{patient.cnp}</p>
              {patient.foNumber && (
                <p className="text-sm text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.foNumber', 'FO Number')}: {patient.foNumber}</p>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{tSafe('pdf.date', 'Date')}</span>
              <p className="font-bold text-lg print:text-base">{formatDate(patient.treatmentDate)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.regimen', 'Regimen')}</span>
              <p className="font-bold text-lg print:text-base">{regimen.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.cycle', 'Cycle')}</span>
              <p className="font-bold text-lg print:text-base">{patient.cycleNumber}</p>
            </div>
          </div>
        </div>

        {/* Section 1: Chemotherapy Regimen */}
        <Card className="print:border print:border-border print:shadow-none">
          <CardHeader className="pb-3 print:pb-2">
            <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
              <Pill className="h-5 w-5" />
              {tSafe('clinicalSheet.regimenDetails', 'Regimen Details')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 print:space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg print:bg-background print:border print:border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.weight', 'Weight')}</p>
                <p className="font-bold">{patient.weight} kg</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.bsa', 'BSA')}</p>
                <p className="font-bold">{patient.bsa} m²</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.crcl', 'CrCl')}</p>
                <p className="font-bold">{patient.creatinineClearance} mL/min</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{tSafe('clinicalSheet.schedule', 'Schedule')}</p>
                <p className="font-bold">{regimen.schedule}</p>
              </div>
            </div>

            <div className="space-y-3">
              {calculatedDrugs.map((drug, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 print:border-l-2 print:border-border">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-lg print:text-base">{drug.name}</h4>
                    <Badge variant="outline" className="print:border-border print:text-foreground">
                      {drug.route}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm print:text-xs">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">{tSafe('clinicalSheet.calculatedDose', 'Calculated Dose')}:</span>
                        <p className="text-accent font-bold print:text-foreground">{drug.calculatedDose}</p>
                      </div>
                      <div>
                        <span className="font-medium">{tSafe('clinicalSheet.finalDose', 'Final Dose')}:</span>
                        <p className="text-primary font-bold print:text-foreground">{drug.finalDose}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">{tSafe('printableProtocol.route', 'Route')}:</span> {drug.route}
                      </div>
                      {drug.day && (
                        <div>
                          <span className="font-medium">{tSafe('compactSheet.day', 'Day')}:</span> {drug.day}
                        </div>
                      )}
                      {drug.administrationDuration && (
                        <div>
                          <span className="font-medium">{tSafe('printableProtocol.duration', 'Duration')}:</span> {drug.administrationDuration}
                        </div>
                      )}
                      {drug.solvent && (
                        <div>
                          <span className="font-medium">{tSafe('doseCalculator.diluent', 'Diluent')}:</span> {drug.solvent}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {drug.dilution && (
                        <div>
                          <span className="font-medium">{tSafe('clinicalSheet.dilution', 'Dilution')}:</span> {drug.dilution}
                        </div>
                      )}
                      {drug.preparationInstructions && (
                        <div>
                          <span className="font-medium">{tSafe('clinicalSheet.preparation', 'Preparation')}:</span> {drug.preparationInstructions}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {drug.adjustmentNotes && (
                    <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-sm print:bg-background print:border-border print:text-xs">
                      <span className="font-medium">{tSafe('clinicalSheet.doseAdjustment', 'Dose Adjustment')}:</span> {drug.adjustmentNotes}
                    </div>
                  )}
                  
                  {drug.notes && (
                    <div className="mt-2 p-2 bg-info/10 border border-info/20 rounded text-sm print:bg-background print:border-border print:text-xs">
                      <span className="font-medium">{tSafe('clinicalSheet.notes', 'Notes')}:</span> {drug.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Premedication & Supportive Care Protocol */}
        <Card className="print:border print:border-border print:shadow-none">
          <CardHeader className="pb-3 print:pb-2">
            <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
              <Shield className="h-5 w-5" />
              {tSafe('clinicalSheet.premedTitle', 'Premedication & Supportive Care')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 print:space-y-3">
            {/* Antiemetics */}
            {premedications.antiemetics.length > 0 && (
              <div>
                <h4 className="font-semibold text-base mb-3 text-accent print:text-foreground">{tSafe('clinicalSheet.antiemeticTherapy', 'Antiemetic Therapy')}</h4>
                <div className="space-y-2">
                  {premedications.antiemetics.map((med, index) => (
                    <div key={index} className="border-l-4 border-accent pl-3 print:border-l-2 print:border-border">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline" className="text-xs print:border-border print:text-foreground">
                          {med.indication}
                        </Badge>
                      </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm print:text-xs">
                         <div><span className="font-medium">{tSafe('clinicalSheet.dose', 'Dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.route', 'Route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.timing', 'Timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{tSafe('printableProtocol.duration', 'Duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{tSafe('premedSelector.solvent', 'Solvent')}:</span> {med.solvent}</div>
                         )}
                       </div>
                      {med.rationale && (
                        <div className="mt-1 text-xs text-muted-foreground print:text-foreground">
                          <span className="font-medium">{tSafe('clinicalSheet.rationale', 'Rationale')}:</span> {med.rationale}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Separator className="my-4 print:border-border" />
              </div>
            )}

            {/* Infusion Reaction Prophylaxis */}
            {premedications.infusionReactionProphylaxis.length > 0 && (
              <div>
                <h4 className="font-semibold text-base mb-3 text-warning print:text-foreground">{tSafe('clinicalSheet.infusionProphylaxis', 'Infusion Reaction Prophylaxis')}</h4>
                <div className="space-y-2">
                  {premedications.infusionReactionProphylaxis.map((med, index) => (
                    <div key={index} className="border-l-4 border-warning pl-3 print:border-l-2 print:border-border">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline" className="text-xs print:border-border print:text-foreground">
                          {med.indication}
                        </Badge>
                      </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm print:text-xs">
                         <div><span className="font-medium">{tSafe('clinicalSheet.dose', 'Dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.route', 'Route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.timing', 'Timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{tSafe('printableProtocol.duration', 'Duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{tSafe('premedSelector.solvent', 'Solvent')}:</span> {med.solvent}</div>
                         )}
                       </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4 print:border-border" />
              </div>
            )}

            {/* GI Protection */}
            {premedications.gastroprotection.length > 0 && (
              <div>
                <h4 className="font-semibold text-base mb-3 text-info print:text-foreground">{tSafe('clinicalSheet.giProtection', 'GI Protection')}</h4>
                <div className="space-y-2">
                  {premedications.gastroprotection.map((med, index) => (
                    <div key={index} className="border-l-4 border-info pl-3 print:border-l-2 print:border-border">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline" className="text-xs print:border-border print:text-foreground">
                          {med.indication}
                        </Badge>
                      </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm print:text-xs">
                         <div><span className="font-medium">{tSafe('clinicalSheet.dose', 'Dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.route', 'Route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.timing', 'Timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{tSafe('printableProtocol.duration', 'Duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{tSafe('premedSelector.solvent', 'Solvent')}:</span> {med.solvent}</div>
                         )}
                       </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4 print:border-border" />
              </div>
            )}

            {/* Organ Protection */}
            {premedications.organProtection.length > 0 && (
              <div>
                <h4 className="font-semibold text-base mb-3 text-success print:text-foreground">{tSafe('clinicalSheet.organProtection', 'Organ Protection')}</h4>
                <div className="space-y-2">
                  {premedications.organProtection.map((med, index) => (
                    <div key={index} className="border-l-4 border-success pl-3 print:border-l-2 print:border-border">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline" className="text-xs print:border-border print:text-foreground">
                          {med.indication}
                        </Badge>
                      </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm print:text-xs">
                          <div><span className="font-medium">{tSafe('clinicalSheet.dose', 'Dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.route', 'Route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.timing', 'Timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{tSafe('printableProtocol.duration', 'Duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{tSafe('premedSelector.solvent', 'Solvent')}:</span> {med.solvent}</div>
                         )}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Medications */}
            {premedications.other.length > 0 && (
              <div>
                <Separator className="my-4 print:border-border" />
                <h4 className="font-semibold text-base mb-3 print:text-foreground">{tSafe('clinicalSheet.additionalSupport', 'Additional Support')}</h4>
                <div className="space-y-2">
                  {premedications.other.map((med, index) => (
                    <div key={index} className="border-l-4 border-muted-foreground pl-3 print:border-l-2 print:border-border">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline" className="text-xs print:border-border print:text-foreground">
                          {med.indication}
                        </Badge>
                      </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm print:text-xs">
                         <div><span className="font-medium">{tSafe('clinicalSheet.dose', 'Dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.route', 'Route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{tSafe('printableProtocol.timing', 'Timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{tSafe('printableProtocol.duration', 'Duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{tSafe('premedSelector.solvent', 'Solvent')}:</span> {med.solvent}</div>
                         )}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Section */}
        <Card className="print:border print:border-border print:shadow-none print:mt-4">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Clinical Notes */}
              {treatmentData.clinicalNotes && (
                <div className="p-4 bg-muted/30 rounded-lg print:bg-background print:border print:border-border">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {tSafe('clinicalSheet.clinicalNotesHeader', 'Clinical Notes')}
                  </h5>
                  <p className="text-sm text-muted-foreground print:text-foreground">{treatmentData.clinicalNotes}</p>
                </div>
              )}

              {/* Signature Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                <div className="space-y-3">
                  <h5 className="font-medium">{tSafe('clinicalSheet.pharmacyVerification', 'Pharmacy Verification')}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tSafe('clinicalSheet.preparedBy', 'Prepared by')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tSafe('clinicalSheet.dateTime', 'Date/Time')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tSafe('clinicalSheet.signature', 'Signature')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">{tSafe('clinicalSheet.nursingVerification', 'Nursing Verification')}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tSafe('clinicalSheet.verifiedBy', 'Verified by')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tSafe('clinicalSheet.dateTime', 'Date/Time')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tSafe('clinicalSheet.signature', 'Signature')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp & Disclaimer */}
              <Separator className="print:border-border" />
              <div className="text-xs text-muted-foreground print:text-foreground space-y-2">
                <div className="flex justify-between items-center">
                  <span>{tSafe('clinicalSheet.generatedLabel', 'Generated')} {new Date().toLocaleString()}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {tSafe('clinicalSheet.documentVersion', 'Document Version')} {toLocalISODate(new Date())}
                  </span>
                </div>
                <div className="text-center pt-2 border-t border-muted print:border-foreground">
                  <em className="text-xs">{tSafe('clinicalSheet.disclaimer', 'This document is for clinical use only. Verify all calculations independently.')}</em>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

ClinicalTreatmentSheet.displayName = 'ClinicalTreatmentSheet';
