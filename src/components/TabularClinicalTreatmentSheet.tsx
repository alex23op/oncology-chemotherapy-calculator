import React, { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { TreatmentData } from '@/types/clinicalTreatment';
import { Calendar, FileText, Pill, Shield, AlertTriangle, CheckCircle, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/dateFormat';

interface TabularClinicalTreatmentSheetProps {
  treatmentData: TreatmentData;
  className?: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
}

export const TabularClinicalTreatmentSheet = forwardRef<HTMLDivElement, TabularClinicalTreatmentSheetProps>(
  ({ treatmentData, className, showPrintButton, onPrint }, ref) => {
    const { t } = useTranslation();
    const { patient, regimen, calculatedDrugs, emetogenicRisk, premedications, solventGroups } = treatmentData;

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

    const hasPevGroups = solventGroups && (solventGroups.groups.length > 0 || solventGroups.individual.length > 0);

    return (
      <div ref={ref} className={`${className} print:bg-background print:text-foreground space-y-6`}>
        {/* Header Section */}
        <div className="print:mb-4">
          <div className="text-center border-b-2 border-primary pb-4 mb-6 print:border-border">
            <h1 className="text-3xl font-bold text-primary print:text-2xl">
              {t('compactSheet.mainTitle')}
            </h1>
            <p className="text-muted-foreground mt-2 print:text-foreground">
              {t('compactSheet.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{t('compactSheet.patientId')}</span>
              <p className="font-bold text-lg print:text-base">{patient.cnp}</p>
              {patient.foNumber && (
                <p className="text-sm text-muted-foreground print:text-foreground">{t('compactSheet.foNumber')}: {patient.foNumber}</p>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{t('compactSheet.date')}</span>
              <p className="font-bold text-lg print:text-base">{formatDate(patient.treatmentDate)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{t('compactSheet.regimen')}</span>
              <p className="font-bold text-lg print:text-base">{regimen.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">{t('compactSheet.cycle')}</span>
              <p className="font-bold text-lg print:text-base">{patient.cycleNumber}</p>
            </div>
          </div>
        </div>

        {/* Print Button */}
        {showPrintButton && onPrint && (
          <div className="flex justify-end print:hidden mb-4">
            <Button onClick={onPrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              {t('compactSheet.print')}
            </Button>
          </div>
        )}

        {/* Section 1: Chemotherapy Regimen */}
        <Card className="print:border print:border-border print:shadow-none">
          <CardHeader className="pb-3 print:pb-2">
            <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
              <Pill className="h-5 w-5" />
              {t('compactSheet.regimenDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 print:space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg print:bg-background print:border print:border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{t('compactSheet.weight')}</p>
                <p className="font-bold">{patient.weight} kg</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{t('compactSheet.bsa')}</p>
                <p className="font-bold">{patient.bsa} m²</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{t('compactSheet.crcl')}</p>
                <p className="font-bold">{patient.creatinineClearance} mL/min</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">{t('compactSheet.schedule')}</p>
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
                        <span className="font-medium">{t('compactSheet.calculatedDose')}:</span>
                        <p className="text-accent font-bold print:text-foreground">{drug.calculatedDose}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('compactSheet.finalDose')}:</span>
                        <p className="text-primary font-bold print:text-foreground">{drug.finalDose}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">{t('compactSheet.route')}:</span> {drug.route}
                      </div>
                      {drug.day && (
                        <div>
                          <span className="font-medium">{t('compactSheet.day')}:</span> {drug.day}
                        </div>
                      )}
                      {drug.administrationDuration && (
                        <div>
                          <span className="font-medium">{t('compactSheet.duration')}:</span> {drug.administrationDuration}
                        </div>
                      )}
                      {drug.solvent && (
                        <div>
                          <span className="font-medium">{t('compactSheet.solvent')}:</span> {drug.solvent}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {drug.dilution && (
                        <div>
                          <span className="font-medium">{t('compactSheet.dilution')}:</span> {drug.dilution}
                        </div>
                      )}
                      {drug.preparationInstructions && (
                        <div>
                          <span className="font-medium">{t('compactSheet.preparation')}:</span> {drug.preparationInstructions}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {drug.adjustmentNotes && (
                    <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-sm print:bg-background print:border-border print:text-xs">
                      <span className="font-medium">{t('compactSheet.doseAdjustment')}:</span> {drug.adjustmentNotes}
                    </div>
                  )}
                  
                  {drug.notes && (
                    <div className="mt-2 p-2 bg-info/10 border border-info/20 rounded text-sm print:bg-background print:border-border print:text-xs">
                      <span className="font-medium">{t('compactSheet.notes')}:</span> {drug.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Emetogenic Risk Classification */}
        <Card className="print:border print:border-border print:shadow-none">
          <CardHeader className="pb-3 print:pb-2">
            <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
              {getRiskIcon(emetogenicRisk.level)}
              {t('compactSheet.emetogenicRiskSection')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 print:space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={getRiskBadgeVariant(emetogenicRisk.level)} className="text-sm">
                {t('compactSheet.riskBadge', { level: emetogenicRisk.level.toUpperCase() })}
              </Badge>
              <span className="text-sm text-muted-foreground print:text-foreground">
                {emetogenicRisk.justification}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
              <div className="p-3 bg-muted/30 rounded-lg print:bg-background print:border print:border-border">
                <h5 className="font-medium mb-2">{t('compactSheet.acutePhase')}</h5>
                <p className="text-sm text-muted-foreground print:text-foreground">{emetogenicRisk.acuteRisk}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg print:bg-background print:border print:border-border">
                <h5 className="font-medium mb-2">{t('compactSheet.delayedPhase')}</h5>
                <p className="text-sm text-muted-foreground print:text-foreground">{emetogenicRisk.delayedRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: PEV Groups - Only if they exist */}
        {hasPevGroups && (
          <Card className="print:border print:border-border print:shadow-none">
            <CardHeader className="pb-3 print:pb-2">
              <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
                <Shield className="h-5 w-5" />
                {t('compactSheet.pevGroups')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 print:text-xs">
                  <thead>
                    <tr className="bg-gray-50 print:bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.pevNumber')}</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.medications')}</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.solvent')}</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.given')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render PEV Groups */}
                    {solventGroups!.groups.map((group, index) => (
                      <tr key={`group-${group.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                        <td className="border border-gray-300 px-3 py-2 font-medium print:px-1 print:py-0.5">
                          {index + 1} PEV
                        </td>
                        <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">
                          {group.medications.map((med, medIndex) => (
                            <span key={medIndex}>
                              {medIndex > 0 && ' + '}
                              <span className="font-medium">{med.name}</span>
                              <span className="text-muted-foreground ml-1">({med.dosage})</span>
                            </span>
                          ))}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">{group.solvent}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center print:px-1 print:py-0.5">☐</td>
                      </tr>
                    ))}
                    {/* Render Individual Medications as separate PEVs */}
                    {solventGroups!.individual.map((med, index) => {
                      const pevNumber = solventGroups!.groups.length + index + 1;
                      const rowIndex = solventGroups!.groups.length + index;
                      return (
                        <tr key={`individual-${index}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                          <td className="border border-gray-300 px-3 py-2 font-medium print:px-1 print:py-0.5">
                            {pevNumber} PEV
                          </td>
                          <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-muted-foreground ml-1">({med.dosage})</span>
                          </td>
                          <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">{med.solvent || t('compactSheet.na')}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center print:px-1 print:py-0.5">☐</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 4: Premedication & Supportive Care Protocol */}
        <Card className="print:border print:border-border print:shadow-none">
          <CardHeader className="pb-3 print:pb-2">
            <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
              <Shield className="h-5 w-5" />
              {t('compactSheet.premedTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 print:space-y-3">
            {/* Antiemetics */}
            {premedications.antiemetics.length > 0 && (
              <div>
                <h4 className="font-semibold text-base mb-3 text-accent print:text-foreground">{t('compactSheet.antiemeticTherapy')}</h4>
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
                         <div><span className="font-medium">{t('compactSheet.dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{t('compactSheet.route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{t('compactSheet.timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{t('compactSheet.duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{t('compactSheet.solvent')}:</span> {med.solvent}</div>
                         )}
                       </div>
                      {med.rationale && (
                        <div className="mt-1 text-xs text-muted-foreground print:text-foreground">
                          <span className="font-medium">{t('compactSheet.rationale')}:</span> {med.rationale}
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
                <h4 className="font-semibold text-base mb-3 text-warning print:text-foreground">{t('compactSheet.infusionProphylaxis')}</h4>
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
                         <div><span className="font-medium">{t('compactSheet.dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{t('compactSheet.route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{t('compactSheet.timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{t('compactSheet.duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{t('compactSheet.solvent')}:</span> {med.solvent}</div>
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
                <h4 className="font-semibold text-base mb-3 text-info print:text-foreground">{t('compactSheet.giProtection')}</h4>
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
                         <div><span className="font-medium">{t('compactSheet.dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{t('compactSheet.route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{t('compactSheet.timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{t('compactSheet.duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{t('compactSheet.solvent')}:</span> {med.solvent}</div>
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
                <h4 className="font-semibold text-base mb-3 text-success print:text-foreground">{t('compactSheet.organProtection')}</h4>
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
                          <div><span className="font-medium">{t('compactSheet.dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{t('compactSheet.route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{t('compactSheet.timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{t('compactSheet.duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{t('compactSheet.solvent')}:</span> {med.solvent}</div>
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
                <h4 className="font-semibold text-base mb-3 print:text-foreground">{t('compactSheet.additionalSupport')}</h4>
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
                         <div><span className="font-medium">{t('compactSheet.dose')}:</span> {med.dosage}</div>
                         <div><span className="font-medium">{t('compactSheet.route')}:</span> {med.route}</div>
                         <div><span className="font-medium">{t('compactSheet.timing')}:</span> {med.timing}</div>
                         {med.administrationDuration && (
                           <div><span className="font-medium">{t('compactSheet.duration')}:</span> {med.administrationDuration}</div>
                         )}
                         {med.solvent && (
                           <div><span className="font-medium">{t('compactSheet.solvent')}:</span> {med.solvent}</div>
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
                    {t('compactSheet.clinicalNotesHeader')}
                  </h5>
                  <p className="text-sm text-muted-foreground print:text-foreground">{treatmentData.clinicalNotes}</p>
                </div>
              )}

              {/* Signature Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                <div className="space-y-3">
                  <h5 className="font-medium">{t('compactSheet.pharmacyVerification')}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('compactSheet.preparedBy')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('compactSheet.dateTime')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('compactSheet.signature')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">{t('compactSheet.nursingVerification')}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('compactSheet.verifiedBy')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('compactSheet.dateTime')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('compactSheet.signature')}</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp & Disclaimer */}
              <Separator className="print:border-border" />
              <div className="text-xs text-muted-foreground print:text-foreground space-y-2">
                <div className="flex justify-between items-center">
                  <span>{t('compactSheet.generatedLabel')} {new Date().toLocaleString()}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t('compactSheet.documentVersion')} {new Date().toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="text-center pt-2 border-t border-muted print:border-foreground">
                  <em className="text-xs">{t('compactSheet.disclaimer')}</em>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

TabularClinicalTreatmentSheet.displayName = 'TabularClinicalTreatmentSheet';