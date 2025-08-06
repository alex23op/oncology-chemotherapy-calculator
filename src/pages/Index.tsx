import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { PatientForm } from "@/components/PatientForm";
import { CancerTypeSelector } from "@/components/CancerTypeSelector";
import { DoseCalculator } from "@/components/DoseCalculator";
import { toast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Regimen } from "@/types/regimens";

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
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedRegimen, setSelectedRegimen] = useState<Regimen | null>(null);

  const handlePatientDataChange = (data: PatientData) => {
    setPatientData(data);
  };

  const handleRegimenSelect = (regimen: Regimen) => {
    if (!patientData) {
      toast({
        title: "Patient Data Required",
        description: "Please enter patient information first to calculate doses.",
        variant: "destructive",
      });
      return;
    }
    setSelectedRegimen(regimen);
    toast({
      title: "Regimen Selected",
      description: `${regimen.name} selected. Doses calculated based on patient data.`,
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
      title: "Export Successful",
      description: "Dose calculations have been prepared for export.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PatientForm onPatientDataChange={handlePatientDataChange} />
            <CancerTypeSelector onRegimenSelect={handleRegimenSelect} />
          </div>
          
          <div>
            <DoseCalculator
              regimen={selectedRegimen}
              bsa={patientData?.bsa || 0}
              weight={parseFloat(patientData?.weight || "0")}
              creatinineClearance={patientData?.creatinineClearance || 0}
              onExport={handleExport}
            />
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-warning/20 rounded">
              <Info className="h-4 w-4 text-warning-foreground" />
            </div>
            <div className="text-sm">
              <h4 className="font-medium text-foreground mb-1">Clinical Disclaimer</h4>
              <p className="text-muted-foreground">
                This application is designed as a clinical decision support tool. All calculations should be 
                verified independently and doses should be reviewed by qualified healthcare professionals 
                before administration. Always consider patient-specific factors, contraindications, and 
                institutional protocols when prescribing chemotherapy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
