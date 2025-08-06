import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TreatmentData } from '@/types/clinicalTreatment';
import { Calendar, FileText, Pill, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ClinicalTreatmentSheetProps {
  treatmentData: TreatmentData;
  className?: string;
}

export const ClinicalTreatmentSheet = React.forwardRef<HTMLDivElement, ClinicalTreatmentSheetProps>(
  ({ treatmentData, className }, ref) => {
    const { patient, regimen, calculatedDrugs, emetogenicRisk, premedications } = treatmentData;

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
              CHEMOTHERAPY TREATMENT PROTOCOL
            </h1>
            <p className="text-muted-foreground mt-2 print:text-foreground">
              Clinical Preparation & Administration Guide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">Patient ID</span>
              <p className="font-bold text-lg print:text-base">{patient.patientId}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">Treatment Date</span>
              <p className="font-bold text-lg print:text-base">{patient.treatmentDate}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">Regimen</span>
              <p className="font-bold text-lg print:text-base">{regimen.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground print:text-foreground">Cycle #</span>
              <p className="font-bold text-lg print:text-base">{patient.cycleNumber}</p>
            </div>
          </div>
        </div>

        {/* Section 1: Chemotherapy Regimen */}
        <Card className="print:border print:border-border print:shadow-none">
          <CardHeader className="pb-3 print:pb-2">
            <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
              <Pill className="h-5 w-5" />
              Chemotherapy Regimen Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 print:space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg print:bg-background print:border print:border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">Weight</p>
                <p className="font-bold">{patient.weight} kg</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">BSA</p>
                <p className="font-bold">{patient.bsa} m²</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">CrCl</p>
                <p className="font-bold">{patient.creatinineClearance} mL/min</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground print:text-foreground">Schedule</p>
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
                        <span className="font-medium">Calculated Dose:</span>
                        <p className="text-accent font-bold print:text-foreground">{drug.calculatedDose}</p>
                      </div>
                      <div>
                        <span className="font-medium">Final Dose:</span>
                        <p className="text-primary font-bold print:text-foreground">{drug.finalDose}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Route:</span> {drug.route}
                      </div>
                      {drug.day && (
                        <div>
                          <span className="font-medium">Day:</span> {drug.day}
                        </div>
                      )}
                      {drug.administrationDuration && (
                        <div>
                          <span className="font-medium">Duration:</span> {drug.administrationDuration}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {drug.dilution && (
                        <div>
                          <span className="font-medium">Dilution:</span> {drug.dilution}
                        </div>
                      )}
                      {drug.preparationInstructions && (
                        <div>
                          <span className="font-medium">Preparation:</span> {drug.preparationInstructions}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {drug.adjustmentNotes && (
                    <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-sm print:bg-background print:border-border print:text-xs">
                      <span className="font-medium">Dose Adjustment:</span> {drug.adjustmentNotes}
                    </div>
                  )}
                  
                  {drug.notes && (
                    <div className="mt-2 p-2 bg-info/10 border border-info/20 rounded text-sm print:bg-background print:border-border print:text-xs">
                      <span className="font-medium">Notes:</span> {drug.notes}
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
              Emetogenic Risk Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 print:space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={getRiskBadgeVariant(emetogenicRisk.level) as any} className="text-sm">
                {emetogenicRisk.level.toUpperCase()} EMETOGENIC RISK
              </Badge>
              <span className="text-sm text-muted-foreground print:text-foreground">
                {emetogenicRisk.justification}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
              <div className="p-3 bg-muted/30 rounded-lg print:bg-background print:border print:border-border">
                <h5 className="font-medium mb-2">Acute Phase (0-24h)</h5>
                <p className="text-sm text-muted-foreground print:text-foreground">{emetogenicRisk.acuteRisk}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg print:bg-background print:border print:border-border">
                <h5 className="font-medium mb-2">Delayed Phase (24-120h)</h5>
                <p className="text-sm text-muted-foreground print:text-foreground">{emetogenicRisk.delayedRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Premedication & Supportive Care Protocol */}
        <Card className="print:border print:border-border print:shadow-none">
          <CardHeader className="pb-3 print:pb-2">
            <CardTitle className="flex items-center gap-2 text-primary print:text-foreground">
              <Shield className="h-5 w-5" />
              Premedication & Supportive Care Protocol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 print:space-y-3">
            {/* Antiemetics */}
            {premedications.antiemetics.length > 0 && (
              <div>
                <h4 className="font-semibold text-base mb-3 text-accent print:text-foreground">Antiemetic Therapy</h4>
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
                        <div><span className="font-medium">Dose:</span> {med.dosage}</div>
                        <div><span className="font-medium">Route:</span> {med.route}</div>
                        <div><span className="font-medium">Timing:</span> {med.timing}</div>
                        {med.administrationDuration && (
                          <div><span className="font-medium">Duration:</span> {med.administrationDuration}</div>
                        )}
                      </div>
                      {med.rationale && (
                        <div className="mt-1 text-xs text-muted-foreground print:text-foreground">
                          <span className="font-medium">Rationale:</span> {med.rationale}
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
                <h4 className="font-semibold text-base mb-3 text-warning print:text-foreground">Infusion Reaction Prophylaxis</h4>
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
                        <div><span className="font-medium">Dose:</span> {med.dosage}</div>
                        <div><span className="font-medium">Route:</span> {med.route}</div>
                        <div><span className="font-medium">Timing:</span> {med.timing}</div>
                        {med.administrationDuration && (
                          <div><span className="font-medium">Duration:</span> {med.administrationDuration}</div>
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
                <h4 className="font-semibold text-base mb-3 text-info print:text-foreground">Gastrointestinal Protection</h4>
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
                        <div><span className="font-medium">Dose:</span> {med.dosage}</div>
                        <div><span className="font-medium">Route:</span> {med.route}</div>
                        <div><span className="font-medium">Timing:</span> {med.timing}</div>
                        {med.administrationDuration && (
                          <div><span className="font-medium">Duration:</span> {med.administrationDuration}</div>
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
                <h4 className="font-semibold text-base mb-3 text-success print:text-foreground">Organ Protection</h4>
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
                        <div><span className="font-medium">Dose:</span> {med.dosage}</div>
                        <div><span className="font-medium">Route:</span> {med.route}</div>
                        <div><span className="font-medium">Timing:</span> {med.timing}</div>
                        {med.administrationDuration && (
                          <div><span className="font-medium">Duration:</span> {med.administrationDuration}</div>
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
                <h4 className="font-semibold text-base mb-3 print:text-foreground">Additional Supportive Care</h4>
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
                        <div><span className="font-medium">Dose:</span> {med.dosage}</div>
                        <div><span className="font-medium">Route:</span> {med.route}</div>
                        <div><span className="font-medium">Timing:</span> {med.timing}</div>
                        {med.administrationDuration && (
                          <div><span className="font-medium">Duration:</span> {med.administrationDuration}</div>
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
                    Clinical Notes
                  </h5>
                  <p className="text-sm text-muted-foreground print:text-foreground">{treatmentData.clinicalNotes}</p>
                </div>
              )}

              {/* Signature Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                <div className="space-y-3">
                  <h5 className="font-medium">Pharmacy Verification</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prepared by:</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Date/Time:</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Signature:</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Nursing Verification</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Verified by:</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Date/Time:</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Signature:</span>
                      <div className="border-b border-muted-foreground w-32 print:border-foreground"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp & Disclaimer */}
              <Separator className="print:border-border" />
              <div className="text-xs text-muted-foreground print:text-foreground space-y-2">
                <div className="flex justify-between items-center">
                  <span>Generated: {new Date().toLocaleString()}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Document Version: {new Date().toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="text-center pt-2 border-t border-muted print:border-foreground">
                  <em className="text-xs">
                    This treatment protocol is computer-generated and must be reviewed by qualified healthcare professionals. 
                    Verify all calculations and dosing before administration. Report any discrepancies immediately.
                  </em>
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
