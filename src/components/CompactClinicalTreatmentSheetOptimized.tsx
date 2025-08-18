import React, { useMemo, forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { TreatmentData } from '@/types/clinicalTreatment';
import { AlertTriangle, Shield, CheckCircle, Printer, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/dateFormat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from './ErrorBoundary';

interface CompactClinicalTreatmentSheetProps {
  treatmentData: TreatmentData;
  className?: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
}

// Memoized components for performance
const PatientInfoSection = React.memo<{ patient: TreatmentData['patient']; t: any }>(
  ({ patient, t }) => (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm print:text-xs">
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.patientName')}:</span>
          <p className="font-semibold">{patient.fullName || 'N/A'}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">CNP:</span>
          <p className="font-semibold">{patient.cnp || 'N/A'}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.foNumber')}:</span>
          <p className="font-semibold">{patient.foNumber || 'N/A'}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.cycleNumber')}:</span>
          <p className="font-semibold">Ciclu {patient.cycleNumber || 'N/A'}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.treatmentDate')}:</span>
          <p className="font-semibold">{formatDate(patient.treatmentDate) || 'N/A'}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.nextCycleDate')}:</span>
          <p className="font-semibold">{patient.nextCycleDate ? formatDate(patient.nextCycleDate) : 'N/A'}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.age')}:</span>
          <p className="font-semibold">{patient.age} ani</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.sex')}:</span>
          <p className="font-semibold">{patient.sex === 'male' ? 'M' : 'F'}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.weight')}:</span>
          <p className="font-semibold">{patient.weight} kg</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">{t('compactSheet.height')}:</span>
          <p className="font-semibold">{patient.height} cm</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">BSA:</span>
          <p className="font-semibold">{patient.bsa.toFixed(2)} m²</p>
        </div>
        <div>
          <span className="text-muted-foreground font-medium">CrCl:</span>
          <p className="font-semibold">{patient.creatinineClearance} mL/min</p>
        </div>
      </div>
  )
);

PatientInfoSection.displayName = 'PatientInfoSection';

const RegimenInfoSection = React.memo<{ regimen: TreatmentData['regimen']; t: any }>(
  ({ regimen, t }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm print:text-xs">
      <div>
        <span className="text-muted-foreground font-medium">{t('compactSheet.regimen')}:</span>
        <p className="font-semibold">{regimen.name}</p>
      </div>
      <div>
        <span className="text-muted-foreground font-medium">{t('compactSheet.schedule')}:</span>
        <p className="font-semibold">{regimen.schedule}</p>
      </div>
      <div>
        <span className="text-muted-foreground font-medium">{t('compactSheet.cycles')}:</span>
        <p className="font-semibold">{regimen.cycles}</p>
      </div>
    </div>
  )
);

RegimenInfoSection.displayName = 'RegimenInfoSection';

const DrugTableRow = React.memo<{
  drug: TreatmentData['calculatedDrugs'][0];
  index: number;
  t: any;
}>(({ drug, index, t }) => (
  <tr key={`${drug.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 font-medium text-sm print:text-xs">
      <div className="flex flex-col">
        <span>{drug.name}</span>
        {drug.drugClass && (
          <Badge variant="outline" className="text-xs mt-1 w-fit">
            {drug.drugClass}
          </Badge>
        )}
      </div>
    </td>
    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 text-sm print:text-xs">
      {drug.calculatedDose}
    </td>
    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 font-semibold text-sm print:text-xs">
      {drug.finalDose}
    </td>
    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 text-sm print:text-xs">
      {drug.route}
    </td>
    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 text-sm print:text-xs">
      {drug.day || t('compactSheet.na')}
    </td>
    <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 text-sm print:text-xs">
      {drug.administrationDuration || t('compactSheet.na')}
    </td>
    <td className="border-t border-gray-300 print:border-black print:px-1 print:py-0.5 text-sm print:text-xs">
      <div className="flex flex-col gap-1">
        {drug.solvent && <span>{drug.solvent}</span>}
        {drug.dilution && <span className="text-muted-foreground text-xs">{drug.dilution}</span>}
      </div>
    </td>
  </tr>
));

DrugTableRow.displayName = 'DrugTableRow';

const EmetogenicRiskSection = React.memo<{
  emetogenicRisk: TreatmentData['emetogenicRisk'];
  t: any;
}>(({ emetogenicRisk, t }) => {
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

  return (
    <div className="print:mb-3">
      <h4 className="font-semibold print:text-xs print:mb-1 flex items-center gap-2">
        {getRiskIcon(emetogenicRisk.level)}
        {t('compactSheet.emetogenicRisk')}
      </h4>
      <div className="flex items-center gap-2 print:mb-1">
        <Badge variant={getRiskBadgeVariant(emetogenicRisk.level) as any} className="text-xs">
          {t(`emetogenicRisk.${emetogenicRisk.level}`)} Risk
        </Badge>
        <span className="text-sm print:text-xs text-muted-foreground">
          {emetogenicRisk.justification}
        </span>
      </div>
      <div className="text-xs print:text-xs text-muted-foreground mt-1">
        <div>Acute Risk: {emetogenicRisk.acuteRisk}</div>
        <div>Delayed Risk: {emetogenicRisk.delayedRisk}</div>
      </div>
    </div>
  );
});

EmetogenicRiskSection.displayName = 'EmetogenicRiskSection';

const PremedicationsSection = React.memo<{
  premedications: TreatmentData['premedications'];
  t: any;
}>(({ premedications, t }) => {
  const categoryMap: Record<string, string> = {
    'Antiemetics': t('clinicalSheet.antiemeticTherapy'),
    'Infusion Reaction Prevention': t('clinicalSheet.infusionProphylaxis'),
    'GI Protection': t('clinicalSheet.giProtection'),
    'Organ Protection': t('clinicalSheet.organProtection'),
    'Other': t('printableProtocol.otherCategory'),
  };

  const allMedications = useMemo(() => [
    ...premedications.antiemetics.map(med => ({ ...med, category: 'Antiemetics' })),
    ...premedications.infusionReactionProphylaxis.map(med => ({ ...med, category: 'Infusion Reaction Prevention' })),
    ...premedications.gastroprotection.map(med => ({ ...med, category: 'GI Protection' })),
    ...premedications.organProtection.map(med => ({ ...med, category: 'Organ Protection' })),
    ...premedications.other.map(med => ({ ...med, category: 'Other' }))
  ], [premedications]);

  if (allMedications.length === 0) return null;

  return (
    <div className="print:mb-3">
      <h4 className="font-semibold print:text-xs print:mb-1">{t('compactSheet.premedications')}</h4>
      <div className="border border-gray-300 print:border-black rounded print:rounded-none">
        <table className="w-full text-sm print:text-xs">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-200">
              <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                {t('compactSheet.medication')}
              </th>
              <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                {t('compactSheet.dose')}
              </th>
              <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                {t('compactSheet.route')}
              </th>
              <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                {t('compactSheet.timing')}
              </th>
              <th className="print:px-1 print:py-0.5 text-left font-semibold text-xs">
                {t('compactSheet.category')}
              </th>
            </tr>
          </thead>
          <tbody>
            {allMedications.map((med, index) => (
              <tr key={`${med.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5 font-medium">
                  <div className="flex flex-col">
                    <span>{med.name}</span>
                    {med.isRequired && (
                      <Badge variant="destructive" className="text-xs mt-1 w-fit">Required</Badge>
                    )}
                  </div>
                </td>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">
                  {med.dosage} {med.unit}
                </td>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">
                  {med.route}
                </td>
                <td className="border-r border-t border-gray-300 print:border-black print:px-1 print:py-0.5">
                  {med.timing}
                </td>
                <td className="border-t border-gray-300 print:border-black print:px-1 print:py-0.5">
                  <Badge variant="outline" className="text-xs">
                    {categoryMap[med.category] || med.category}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

PremedicationsSection.displayName = 'PremedicationsSection';

const CompactClinicalTreatmentSheetCore = forwardRef<HTMLDivElement, CompactClinicalTreatmentSheetProps>(
  ({ treatmentData, className = "", showPrintButton = false, onPrint }, ref) => {
    const { t } = useTranslation();
    const { patient, regimen, calculatedDrugs, emetogenicRisk, premedications, solventGroups } = treatmentData;

    // Memoized calculations for performance - with defensive checks
    const drugNotes = useMemo(() => 
      calculatedDrugs?.filter(drug => drug.adjustmentNotes || drug.preparationInstructions || drug.notes) || [],
      [calculatedDrugs]
    );

    const hasImportantAlerts = useMemo(() => 
      calculatedDrugs?.some(drug => drug.adjustmentNotes?.includes('ALERT') || drug.notes?.includes('WARNING')) || false,
      [calculatedDrugs]
    );

    return (
      <div ref={ref} className={`space-y-4 print:space-y-2 print:text-black print:bg-white ${className}`}>
        {/* Header Section */}
        <div className="flex items-center justify-between print:justify-center print:mb-4">
          <div className="text-center">
            <h1 className="text-xl font-bold print:text-lg">
              {t('compactSheet.title')}
            </h1>
            <p className="text-sm text-muted-foreground print:text-black">
              {t('compactSheet.subtitle')}
            </p>
          </div>
          {showPrintButton && (
            <div className="print:hidden">
              <Button
                onClick={onPrint}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          )}
        </div>

        {/* Important Alerts Banner */}
        {hasImportantAlerts && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 print:mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-semibold text-destructive">
                {t('compactSheet.importantAlerts')}
              </span>
            </div>
          </div>
        )}

        {/* Patient Information */}
        <Card className="print:border-black print:shadow-none">
          <CardHeader className="pb-3 print:pb-1">
            <CardTitle className="text-base print:text-sm">
              {t('compactSheet.patientInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PatientInfoSection patient={patient} t={t} />
          </CardContent>
        </Card>

        {/* Regimen Information */}
        <Card className="print:border-black print:shadow-none">
          <CardHeader className="pb-3 print:pb-1">
            <CardTitle className="text-base print:text-sm">
              {t('compactSheet.regimenInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RegimenInfoSection regimen={regimen} t={t} />
            {regimen.description && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm print:text-xs text-muted-foreground">
                  <strong>Description:</strong> {regimen.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Drug Table */}
        <Card className="print:border-black print:shadow-none">
          <CardHeader className="pb-3 print:pb-1">
            <CardTitle className="text-base print:text-sm">
              {t('compactSheet.chemotherapyDrugs')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 print:border-black rounded print:rounded-none overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-200">
                    <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                      {t('compactSheet.drug')}
                    </th>
                    <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                      {t('compactSheet.calculatedDose')}
                    </th>
                    <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                      {t('compactSheet.finalDose')}
                    </th>
                    <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                      {t('compactSheet.route')}
                    </th>
                    <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                      {t('compactSheet.day')}
                    </th>
                    <th className="border-r border-gray-300 print:border-black print:px-1 print:py-0.5 text-left font-semibold text-xs">
                      {t('compactSheet.duration')}
                    </th>
                    <th className="print:px-1 print:py-0.5 text-left font-semibold text-xs">
                      {t('doseCalculator.diluent')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedDrugs.map((drug, index) => (
                    <DrugTableRow key={`${drug.name}-${index}`} drug={drug} index={index} t={t} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Drug Notes and Adjustments */}
            {drugNotes.length > 0 && (
              <div className="print:mt-2">
                <h5 className="font-semibold text-sm print:text-xs mb-2">Note și ajustări specifice:</h5>
                {drugNotes.map((drug, index) => (
                  <div key={index} className="print:text-xs print:mb-1 text-sm mb-2 p-2 bg-muted/30 rounded print:bg-gray-50">
                    <span className="font-semibold">{drug.name}:</span>
                    {drug.adjustmentNotes && (
                      <div className="ml-2 text-warning">
                        <strong>Ajustare doză:</strong> {drug.adjustmentNotes}
                      </div>
                    )}
                    {drug.preparationInstructions && (
                      <div className="ml-2 text-info">
                        <strong>Instrucțiuni preparare:</strong> {drug.preparationInstructions}
                      </div>
                    )}
                    {drug.notes && (
                      <div className="ml-2 text-muted-foreground">
                        <strong>Note:</strong> {drug.notes}
                      </div>
                    )}
                    {drug.solvent && (
                      <div className="ml-2 text-sm">
                        <strong>Solvent:</strong> {drug.solvent}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emetogenic Risk */}
        <Card className="print:border-black print:shadow-none">
          <CardContent className="pt-6">
            <EmetogenicRiskSection emetogenicRisk={emetogenicRisk} t={t} />
          </CardContent>
        </Card>

        {/* Premedications & PEV Groups */}
        <Card className="print:border-black print:shadow-none">
          <CardHeader className="pb-3 print:pb-1">
            <CardTitle className="text-base print:text-sm">
              Premedicație & Îngrijiri suportive
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* PEV Groups */}
            {solventGroups && solventGroups.groups && solventGroups.groups.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold text-sm print:text-xs mb-2">Grupuri PEV:</h5>
                {solventGroups.groups.map((group, index) => (
                  <div key={group.id} className="mb-3 p-3 border rounded print:border-black print:mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{index + 1} PEV - {group.solvent}</span>
                      <span className="text-xs text-muted-foreground">ID: {group.id}</span>
                    </div>
                    <div className="space-y-1">
                      {group.medications.map((med, medIndex) => (
                        <div key={medIndex} className="text-sm print:text-xs flex justify-between">
                          <span><strong>{med.name}</strong> {med.dosage} {med.unit}</span>
                          <span className="text-muted-foreground">{med.route} • {med.timing}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Individual Premedications */}
            {(solventGroups?.individual && solventGroups.individual.length > 0) && (
              <div className="mb-4">
                <h5 className="font-semibold text-sm print:text-xs mb-2">Premedicații individuale:</h5>
                <div className="space-y-1">
                  {solventGroups.individual.map((med, index) => (
                    <div key={index} className="text-sm print:text-xs p-2 border rounded print:border-black">
                      <div className="flex justify-between">
                        <span><strong>{med.name}</strong> {med.dosage} {med.unit}</span>
                        <span className="text-muted-foreground">{med.route} • {med.timing}</span>
                      </div>
                      {med.solvent && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Solvent: {med.solvent}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Premedications Table */}
            <PremedicationsSection premedications={premedications} t={t} />
          </CardContent>
        </Card>

        {/* Clinical Notes */}
        {treatmentData.clinicalNotes && (
          <Card className="print:border-black print:shadow-none">
            <CardHeader className="pb-3 print:pb-1">
              <CardTitle className="text-base print:text-sm">
                {t('compactSheet.clinicalNotes')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-3 rounded print:bg-gray-50 print:px-2 print:py-1">
                <p className="text-sm print:text-xs whitespace-pre-wrap">
                  {treatmentData.clinicalNotes}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer & Signatures */}
        <div className="print:mt-6 print:pt-4 print:border-t-2 print:border-black">
          {/* Administration Section */}
          <Card className="print:border-black print:shadow-none mb-4">
            <CardHeader className="pb-2 print:pb-1">
              <CardTitle className="text-base print:text-sm">
                Administrare și Monitorizare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm print:text-xs">
                <div>
                  <p className="font-semibold mb-2">Farmacist responsabil:</p>
                  <div className="border-b border-dashed border-gray-400 h-6 print:h-4"></div>
                  <p className="text-xs text-muted-foreground mt-1">Nume, semnătură, data</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Asistent medical:</p>
                  <div className="border-b border-dashed border-gray-400 h-6 print:h-4"></div>
                  <p className="text-xs text-muted-foreground mt-1">Nume, semnătură, data</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Medic prescriptor:</p>
                  <div className="border-b border-dashed border-gray-400 h-6 print:h-4"></div>
                  <p className="text-xs text-muted-foreground mt-1">Nume, semnătură, data</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Ora începerii tratamentului:</p>
                  <div className="border-b border-dashed border-gray-400 h-6 print:h-4"></div>
                  <p className="text-xs text-muted-foreground mt-1">HH:MM</p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <p className="font-semibold mb-2 text-sm">Observații clinice:</p>
                <div className="border border-gray-300 rounded p-2 min-h-[60px] print:min-h-[40px]">
                  <div className="text-xs text-gray-400">
                    Spațiu pentru notarea observațiilor clinice, reacțiilor adverse, modificărilor de protocol...
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center text-xs print:text-xs text-muted-foreground">
            <div>
              Generat: {new Date().toLocaleString('ro-RO')}
            </div>
            <div>
              Pagina 1 din 1
            </div>
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            <p>
              ⚠️ Acest protocol trebuie verificat de un profesionist medical calificat înainte de administrare.
              Consultați ghidurile NCCN/ESMO și politicile locale.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CompactClinicalTreatmentSheetCore.displayName = 'CompactClinicalTreatmentSheetCore';

export const CompactClinicalTreatmentSheetOptimized = forwardRef<HTMLDivElement, CompactClinicalTreatmentSheetProps>(
  (props, ref) => (
    <ErrorBoundary>
      <CompactClinicalTreatmentSheetCore {...props} ref={ref} />
    </ErrorBoundary>
  )
);