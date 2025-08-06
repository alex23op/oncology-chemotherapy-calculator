import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, User } from "lucide-react";

interface PatientData {
  weight: string;
  height: string;
  age: string;
  sex: string;
  creatinine: string;
  weightUnit: string;
  heightUnit: string;
  creatinineUnit: string;
}

interface PatientFormProps {
  onPatientDataChange: (data: PatientData & { bsa: number; creatinineClearance: number }) => void;
}

export const PatientForm = ({ onPatientDataChange }: PatientFormProps) => {
  const [patientData, setPatientData] = useState<PatientData>({
    weight: "",
    height: "",
    age: "",
    sex: "",
    creatinine: "",
    weightUnit: "kg",
    heightUnit: "cm",
    creatinineUnit: "mg/dL"
  });

  const calculateBSA = (weight: number, height: number, weightUnit: string, heightUnit: string) => {
    // Convert to standard units (kg and cm)
    const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
    const heightCm = heightUnit === "inches" ? height * 2.54 : height;
    
    // DuBois formula: BSA = 0.007184 × (height^0.725) × (weight^0.425)
    const bsa = 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);
    return Math.round(bsa * 100) / 100; // Round to 2 decimal places
  };

  const calculateCreatinineClearance = (
    age: number, 
    weight: number, 
    creatinine: number, 
    sex: string,
    weightUnit: string,
    creatinineUnit: string
  ) => {
    // Convert to standard units
    const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
    const creatinineMgDl = creatinineUnit === "μmol/L" ? creatinine / 88.4 : creatinine;
    
    // Cockcroft-Gault formula
    const sexMultiplier = sex === "female" ? 0.85 : 1;
    const crCl = ((140 - age) * weightKg * sexMultiplier) / (72 * creatinineMgDl);
    return Math.round(crCl * 100) / 100;
  };

  const handleInputChange = (field: keyof PatientData, value: string) => {
    const newData = { ...patientData, [field]: value };
    setPatientData(newData);

    // Calculate BSA and creatinine clearance if we have required data
    if (newData.weight && newData.height) {
      const weight = parseFloat(newData.weight);
      const height = parseFloat(newData.height);
      const age = parseFloat(newData.age);
      const creatinine = parseFloat(newData.creatinine);
      
      if (!isNaN(weight) && !isNaN(height)) {
        const bsa = calculateBSA(weight, height, newData.weightUnit, newData.heightUnit);
        
        let creatinineClearance = 0;
        if (!isNaN(age) && !isNaN(creatinine) && newData.sex) {
          creatinineClearance = calculateCreatinineClearance(
            age, weight, creatinine, newData.sex, 
            newData.weightUnit, newData.creatinineUnit
          );
        }
        
        onPatientDataChange({ ...newData, bsa, creatinineClearance });
      }
    }
  };

  const isFormValid = patientData.weight && patientData.height && patientData.age && patientData.sex;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <User className="h-5 w-5" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={patientData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.weightUnit} onValueChange={(value) => handleInputChange("weightUnit", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={patientData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.heightUnit} onValueChange={(value) => handleInputChange("heightUnit", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="inches">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={patientData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={patientData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatinine">Serum Creatinine</Label>
            <div className="flex gap-2">
              <Input
                id="creatinine"
                type="number"
                step="0.1"
                placeholder="Enter creatinine"
                value={patientData.creatinine}
                onChange={(e) => handleInputChange("creatinine", e.target.value)}
                className="flex-1"
              />
              <Select value={patientData.creatinineUnit} onValueChange={(value) => handleInputChange("creatinineUnit", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg/dL">mg/dL</SelectItem>
                  <SelectItem value="μmol/L">μmol/L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {patientData.weight && patientData.height && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-accent" />
                <span className="font-medium text-accent">Calculated BSA</span>
              </div>
              <p className="text-2xl font-bold text-accent">
                {calculateBSA(
                  parseFloat(patientData.weight),
                  parseFloat(patientData.height),
                  patientData.weightUnit,
                  patientData.heightUnit
                )} m²
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Using DuBois formula
              </p>
            </div>
            
            {patientData.age && patientData.creatinine && patientData.sex && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-accent" />
                  <span className="font-medium text-accent">Creatinine Clearance</span>
                </div>
                <p className="text-2xl font-bold text-accent">
                  {calculateCreatinineClearance(
                    parseFloat(patientData.age),
                    parseFloat(patientData.weight),
                    parseFloat(patientData.creatinine),
                    patientData.sex,
                    patientData.weightUnit,
                    patientData.creatinineUnit
                  )} mL/min
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Using Cockcroft-Gault formula
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};