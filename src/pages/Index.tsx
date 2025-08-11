import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { PatientForm } from "@/components/PatientForm";
import { CancerTypeSelector } from "@/components/CancerTypeSelector";
import { DoseCalculator } from "@/components/DoseCalculator";
import { SafeComponentWrapper } from "@/components/SafeComponentWrapper";
import { toast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Regimen } from "@/types/regimens";
import { useTranslation } from "react-i18next";
import { WizardProvider, useWizard } from "@/components/wizard/WizardProvider";
import { WizardStep } from "@/components/wizard/WizardStep";
import { ProgressBar } from "@/components/wizard/ProgressBar";
import { useSmartNav } from "@/context/SmartNavContext";

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

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <ProgressBar />

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
            <>
              {/* Simple preview of emetogenic risk based on regimen drugs */}
              {/* Avoid duplicating state with DoseCalculator; this step is informative */}
              {React.createElement(require('@/components/EmetogenicRiskClassifier').EmetogenicRiskClassifier, { drugs: selectedRegimen.drugs })}
            </>
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
            weight={parseFloat(patientData?.weight || "0")}
            height={parseFloat(patientData?.height || "0")}
            age={parseFloat(patientData?.age || "0")}
            sex={patientData?.sex || ""}
            creatinineClearance={patientData?.creatinineClearance || 0}
            onExport={handleExport}
            onFinalize={(data: any) => setTreatmentData(data)}
            onGoToReview={() => goTo('review')}
          />
        </SafeComponentWrapper>
      </WizardStep>

      <WizardStep id="review" title={t('wizard.steps.review', { defaultValue: 'Review & Print' })}>
        <SafeComponentWrapper componentName="Review & Print" fallbackMessage={t('errors.reviewFailed')}>
          {treatmentData ? (
            <div className="space-y-4">
              {React.createElement(require('@/components/CompactClinicalTreatmentSheet').CompactClinicalTreatmentSheet, { treatmentData, className: 'compact-treatment-sheet' })}
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded border bg-background hover-scale"
                  onClick={async () => {
                    const { generateClinicalTreatmentPDF } = await import('@/utils/pdfExport');
                    await generateClinicalTreatmentPDF({ ...treatmentData, elementId: 'clinical-treatment-sheet', orientation: 'portrait' });
                  }}
                >
                  {t('doseCalculator.exportPdf')}
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded border bg-background hover-scale" onClick={() => window.print()}>
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
