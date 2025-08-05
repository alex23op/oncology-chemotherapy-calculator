import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Stethoscope } from "lucide-react";

export interface CancerType {
  id: string;
  name: string;
  category: string;
  regimens: Regimen[];
}

export interface Regimen {
  id: string;
  name: string;
  description: string;
  drugs: Drug[];
  schedule: string;
  cycles: number;
}

export interface Drug {
  name: string;
  dosage: string;
  unit: string;
  route: string;
  notes?: string;
}

interface CancerTypeSelectorProps {
  onRegimenSelect: (regimen: Regimen) => void;
}

// Sample cancer types and regimens
const cancerTypes: CancerType[] = [
  {
    id: "breast",
    name: "Breast Cancer",
    category: "Solid Tumor",
    regimens: [
      {
        id: "ac-t",
        name: "AC-T (Doxorubicin/Cyclophosphamide → Paclitaxel)",
        description: "Standard adjuvant therapy for breast cancer",
        drugs: [
          { name: "Doxorubicin", dosage: "60", unit: "mg/m²", route: "IV" },
          { name: "Cyclophosphamide", dosage: "600", unit: "mg/m²", route: "IV" },
          { name: "Paclitaxel", dosage: "175", unit: "mg/m²", route: "IV" }
        ],
        schedule: "Every 3 weeks",
        cycles: 8
      },
      {
        id: "tcap",
        name: "TCAP (Paclitaxel/Carboplatin)",
        description: "Weekly paclitaxel with carboplatin",
        drugs: [
          { name: "Paclitaxel", dosage: "80", unit: "mg/m²", route: "IV" },
          { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV" }
        ],
        schedule: "Weekly paclitaxel, carboplatin every 3 weeks",
        cycles: 4
      }
    ]
  },
  {
    id: "lung",
    name: "Lung Cancer (NSCLC)",
    category: "Solid Tumor",
    regimens: [
      {
        id: "carboplatin-paclitaxel",
        name: "Carboplatin/Paclitaxel",
        description: "First-line therapy for advanced NSCLC",
        drugs: [
          { name: "Carboplatin", dosage: "AUC 6", unit: "", route: "IV" },
          { name: "Paclitaxel", dosage: "200", unit: "mg/m²", route: "IV" }
        ],
        schedule: "Every 3 weeks",
        cycles: 4
      },
      {
        id: "cisplatin-pemetrexed",
        name: "Cisplatin/Pemetrexed",
        description: "For non-squamous NSCLC",
        drugs: [
          { name: "Cisplatin", dosage: "75", unit: "mg/m²", route: "IV" },
          { name: "Pemetrexed", dosage: "500", unit: "mg/m²", route: "IV" }
        ],
        schedule: "Every 3 weeks",
        cycles: 4
      }
    ]
  },
  {
    id: "colorectal",
    name: "Colorectal Cancer",
    category: "Solid Tumor",
    regimens: [
      {
        id: "folfox",
        name: "FOLFOX (5-FU/Leucovorin/Oxaliplatin)",
        description: "Standard adjuvant/metastatic therapy",
        drugs: [
          { name: "Oxaliplatin", dosage: "85", unit: "mg/m²", route: "IV" },
          { name: "Leucovorin", dosage: "400", unit: "mg/m²", route: "IV" },
          { name: "5-Fluorouracil", dosage: "400", unit: "mg/m²", route: "IV bolus" },
          { name: "5-Fluorouracil", dosage: "2400", unit: "mg/m²", route: "IV continuous" }
        ],
        schedule: "Every 2 weeks",
        cycles: 12
      }
    ]
  }
];

export const CancerTypeSelector = ({ onRegimenSelect }: CancerTypeSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCancer, setSelectedCancer] = useState<CancerType | null>(null);

  const filteredCancers = cancerTypes.filter(cancer =>
    cancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cancer.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Stethoscope className="h-5 w-5" />
          Cancer Type & Regimen Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Cancer Types</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by cancer type or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredCancers.map((cancer) => (
            <div key={cancer.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{cancer.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {cancer.category}
                  </Badge>
                </div>
                <Button
                  variant={selectedCancer?.id === cancer.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCancer(selectedCancer?.id === cancer.id ? null : cancer)}
                >
                  {selectedCancer?.id === cancer.id ? "Selected" : "Select"}
                </Button>
              </div>

              {selectedCancer?.id === cancer.id && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-sm text-foreground">Available Regimens:</h4>
                  {cancer.regimens.map((regimen) => (
                    <div key={regimen.id} className="bg-secondary/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-foreground">{regimen.name}</h5>
                          <p className="text-sm text-muted-foreground mt-1">{regimen.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Schedule: {regimen.schedule}</span>
                            <span>Cycles: {regimen.cycles}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onRegimenSelect(regimen)}
                          className="ml-2"
                        >
                          Calculate Doses
                        </Button>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Drugs:</p>
                        <div className="flex flex-wrap gap-1">
                          {regimen.drugs.map((drug, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {drug.name} {drug.dosage} {drug.unit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCancers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No cancer types found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};