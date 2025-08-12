import { useState, useEffect, Suspense, lazy } from "react";
import { AppHeader } from "@/components/AppHeader";
import { PatientForm } from "@/components/PatientForm";
import { CancerTypeSelector } from "@/components/CancerTypeSelector";
import { DoseCalculator } from "@/components/DoseCalculator";
import { SafeComponentWrapper } from "@/components/SafeComponentWrapper";
import { toast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Regimen, Premedication } from "@/types/regimens";
import { useTranslation } from "react-i18next";
import { WizardProvider, useWizard } from "@/components/wizard/WizardProvider";
import { WizardStep } from "@/components/wizard/WizardStep";
import { ProgressBar } from "@/components/wizard/ProgressBar";
import { useSmartNav } from "@/context/SmartNavContext";
import { EmetogenicRiskClassifier } from "@/components/EmetogenicRiskClassifier";
import { PatientSummaryPanel } from "@/components/PatientSummaryPanel";
import { UnifiedProtocolSelector } from "@/components/UnifiedProtocolSelector";
import { CompactClinicalTreatmentSheet } from "@/components/CompactClinicalTreatmentSheet";
import { AntiemeticAgent } from "@/types/emetogenicRisk";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface PatientData {
  weight: string;
  height: string;
  age: string;
  sex: string;
  creatinine: string;
  weightUnit: string;
  heightUnit: string;
  creatinineUnit: string;
  bsa: number;
  creatinineClearance: number;
}

const IndexContent = () => {
  const { t } = useTranslation();
  const { autoJumpEnabled } = useSmartNav();
  const { goTo } = useWizard();

  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedRegimen, setSelectedRegimen] = useState<Regimen | null>(null);
  const [treatmentData, setTreatmentData] = useState<any | null>(null);

  // Supportive care state (Tab 3)
  const [emetogenicRiskLevel, setEmetogenicRiskLevel] = useState<"high" | "moderate" | "low" | "minimal">("minimal");
  const [selectedPremedications, setSelectedPremedications] = useState<Premedication[]>([]);
  const [selectedAntiemetics, setSelectedAntiemetics] = useState<AntiemeticAgent[]>([]);
  const [reviewOrientation, setReviewOrientation] = useState<'portrait' | 'landscape'>(
    () => (localStorage.getItem('pdfOrientation') as 'portrait' | 'landscape') || 'portrait'
  );
  useEffect(() => {
    try { localStorage.setItem('pdfOrientation', reviewOrientation); } catch {}
  }, [reviewOrientation]);

  const handlePatientDataChange = (data: PatientData) => {
    setPatientData(data);
  };

  const handleRegimenSelect = (regimen: Regimen) => {
    if (!patientData) {
      toast({
        title: t("index.toasts.patientDataRequired.title"),
        description: t("index.toasts.patientDataRequired.description"),
        variant: "destructive",
      });
      return;
    }
    setSelectedRegimen(regimen);
    toast({
      title: t("index.toasts.regimenSelected.title"),
      description: t("index.toasts.regimenSelected.description", { name: regimen.name }),
    });
    if (autoJumpEnabled) {
      goTo("support");
    }
  };

  const handleExport = (calculations: any[]) => {
    const exportData = {
      patient: patientData,
      regimen: selectedRegimen,
      calculations,
      timestamp: new Date().toISOString(),
    };
    console.log("Export data:", exportData);
    toast({
      title: t("index.toasts.exportSuccess.title"),
      description: t("index.toasts.exportSuccess.description"),
    });
  };

  const weightKg = patientData
    ? (patientData.weightUnit === 'lbs'
        ? parseFloat(patientData.weight) * 0.453592
        : parseFloat(patientData.weight))
    : 0;

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <ProgressBar />
      <PatientSummaryPanel patientData={patientData} selectedRegimen={selectedRegimen} className="hidden lg:block" />

      <WizardStep id="patient" title={t('wizard.steps.patient', { defaultValue: 'Patient data' })}>
        <SafeComponentWrapper componentName="Patient Form" fallbackMessage={t('errors.patientFormFailed')}>
          <PatientForm onPatientDataChange={handlePatientDataChange} />
        </SafeComponentWrapper>
      </WizardStep>

      <WizardStep id="regimen" title={t('wizard.steps.regimen', { defaultValue: 'Regimen selection' })}>
        <SafeComponentWrapper componentName="Cancer Type Selector" fallbackMessage={t('errors.cancerSelectorFailed')}>
          <CancerTypeSelector onRegimenSelect={handleRegimenSelect} />
        </SafeComponentWrapper>
      </WizardStep>

      <WizardStep id="support" title={t('wizard.steps.support', { defaultValue: 'Supportive care' })}>
        <SafeComponentWrapper componentName="Emetogenic Risk" fallbackMessage={t('errors.emetogenicRiskFailed')}>
          {selectedRegimen ? (
            <div className="space-y-6">
              <EmetogenicRiskClassifier drugs={selectedRegimen.drugs} onRiskLevelChange={setEmetogenicRiskLevel} />
              <UnifiedProtocolSelector
                drugNames={selectedRegimen.drugs.map(drug => drug.name)}
                drugs={selectedRegimen.drugs}
                emetogenicRiskLevel={emetogenicRiskLevel}
                selectedPremedications={selectedPremedications}
                selectedAntiemetics={selectedAntiemetics}
                onPremedSelectionsChange={setSelectedPremedications}
                onAntiemeticProtocolChange={setSelectedAntiemetics}
                weight={weightKg}
              />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t('doseCalculator.emptyState')}</div>
          )}
        </SafeComponentWrapper>
      </WizardStep>

      <WizardStep id="doses" title={t('wizard.steps.doses', { defaultValue: 'Dose calculation' })}>
        <SafeComponentWrapper componentName="Dose Calculator" fallbackMessage={t('errors.doseCalculatorFailed')}>
          <DoseCalculator
            regimen={selectedRegimen}
            bsa={patientData?.bsa || 0}
            weight={weightKg}
            height={parseFloat(patientData?.height || "0")}
            age={parseFloat(patientData?.age || "0")}
            sex={patientData?.sex || ""}
            creatinineClearance={patientData?.creatinineClearance || 0}
            onExport={handleExport}
            onFinalize={(data: any) => setTreatmentData(data)}
            onGoToReview={() => goTo('review')}
            supportiveCare={{
              emetogenicRiskLevel,
              selectedPremedications,
              selectedAntiemetics,
            }}
          />
        </SafeComponentWrapper>
      </WizardStep>

      <WizardStep id="review" title={t('wizard.steps.review', { defaultValue: 'Review & Print' })}>
        <SafeComponentWrapper componentName="Review & Print" fallbackMessage={t('errors.reviewFailed')}>
          {treatmentData ? (
            <div className="space-y-4">
              <div id="protocol-print">
                <CompactClinicalTreatmentSheet treatmentData={treatmentData} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Select value={reviewOrientation} onValueChange={(v) => setReviewOrientation(v as 'portrait' | 'landscape')}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t('doseCalculator.orientation')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">{t('doseCalculator.portrait')}</SelectItem>
                    <SelectItem value="landscape">{t('doseCalculator.landscape')}</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded border bg-background hover-scale"
                  onClick={async () => {
                    const { generateClinicalTreatmentPDF } = await import('@/utils/pdfExport');
                    await generateClinicalTreatmentPDF({
                      ...treatmentData,
                      elementId: 'protocol-print',
                      orientation: reviewOrientation,
                    });
                  }}
                >
                  {t('doseCalculator.exportPdf')}
                </button>
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded border bg-background hover-scale"
                  onClick={() => {
                    document.body.classList.add('printing-protocol');
                    window.print();
                    setTimeout(() => document.body.classList.remove('printing-protocol'), 100);
                  }}
                >
                  {t('doseCalculator.print')}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{t('doseCalculator.emptyState')}</div>
          )}
        </SafeComponentWrapper>
      </WizardStep>

      <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-muted">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-warning/20 rounded">
            <Info className="h-4 w-4 text-warning-foreground" />
          </div>
          <div className="text-sm">
            <h4 className="font-medium text-foreground mb-1">{t('index.disclaimer.title')}</h4>
            <p className="text-muted-foreground">{t('index.disclaimer.body')}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

const Index = () => {
  const { t } = useTranslation();
  const steps = [
    { id: 'patient', title: t('wizard.steps.patient', { defaultValue: 'Patient data' }) },
    { id: 'regimen', title: t('wizard.steps.regimen', { defaultValue: 'Regimen selection' }) },
    { id: 'support', title: t('wizard.steps.support', { defaultValue: 'Supportive care' }) },
    { id: 'doses', title: t('wizard.steps.doses', { defaultValue: 'Dose calculation' }) },
    { id: 'review', title: t('wizard.steps.review', { defaultValue: 'Review & Print' }) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SafeComponentWrapper componentName="App Header" fallbackMessage={t('errors.headerFailed')}>
        <AppHeader />
      </SafeComponentWrapper>

      <WizardProvider steps={steps} initialStepId="patient">
        <IndexContent />
      </WizardProvider>
    </div>
  );
};

export default Index;
