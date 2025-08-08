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

const Index = () => {
  const { t } = useTranslation();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedRegimen, setSelectedRegimen] = useState<Regimen | null>(null);

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
  };

  const handleExport = (calculations: any[]) => {
    const exportData = {
      patient: patientData,
      regimen: selectedRegimen,
      calculations,
      timestamp: new Date().toISOString(),
    };
    
    // In a real app, this would generate a PDF or send to printer
    console.log("Export data:", exportData);
    toast({
      title: t("index.toasts.exportSuccess.title"),
      description: t("index.toasts.exportSuccess.description"),
    });
  };

  
  return (
    <div className="min-h-screen bg-background">
      <SafeComponentWrapper componentName="App Header" fallbackMessage="Header failed to load">
        <AppHeader />
      </SafeComponentWrapper>
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SafeComponentWrapper componentName="Patient Form" fallbackMessage="Patient form failed to load">
              <PatientForm onPatientDataChange={handlePatientDataChange} />
            </SafeComponentWrapper>
            <SafeComponentWrapper componentName="Cancer Type Selector" fallbackMessage="Cancer type selector failed to load">
              <CancerTypeSelector onRegimenSelect={handleRegimenSelect} />
            </SafeComponentWrapper>
          </div>
          
          <div>
            <SafeComponentWrapper componentName="Dose Calculator" fallbackMessage="Dose calculator failed to load">
              <DoseCalculator
                regimen={selectedRegimen}
                bsa={patientData?.bsa || 0}
                weight={parseFloat(patientData?.weight || "0")}
                height={parseFloat(patientData?.height || "0")}
                age={parseFloat(patientData?.age || "0")}
                sex={patientData?.sex || ""}
                creatinineClearance={patientData?.creatinineClearance || 0}
                onExport={handleExport}
              />
            </SafeComponentWrapper>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-warning/20 rounded">
              <Info className="h-4 w-4 text-warning-foreground" />
            </div>
            <div className="text-sm">
              <h4 className="font-medium text-foreground mb-1">{t('index.disclaimer.title')}</h4>
              <p className="text-muted-foreground">
                {t('index.disclaimer.body')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
