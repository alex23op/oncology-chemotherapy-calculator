import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Stethoscope, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cancerTypes } from "@/data/cancerTypes";
import { Regimen } from "@/types/regimens";
import { useTranslation } from 'react-i18next';

interface CancerTypeSelectorProps {
  onRegimenSelect: (regimen: Regimen) => void;
}

export const CancerTypeSelector = ({ onRegimenSelect }: CancerTypeSelectorProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCancer, setSelectedCancer] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("all");

  const filteredCancers = cancerTypes.filter(cancer =>
    cancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cancer.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRegimensByCategory = (cancer: any, category: string, subtype: string = "all") => {
    let regimens = cancer.regimens;
    
    // Filter by category
    if (category !== "all") {
      regimens = regimens.filter((regimen: Regimen) => regimen.category === category);
    }
    
    // Filter by subtype (for gynecological and lung cancers)
    if ((cancer.id === "gyn-all" || cancer.id === "lung-all") && subtype !== "all") {
      regimens = regimens.filter((regimen: Regimen) => regimen.subtype === subtype);
    }
    
    return regimens;
  };

  const getAvailableSubtypes = (cancer: any) => {
    if (cancer.id !== "gyn-all") return [];
    const subtypes = [...new Set(cancer.regimens.map((regimen: Regimen) => regimen.subtype))];
    return subtypes.filter(Boolean);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Stethoscope className="h-5 w-5" />
          {t('cancerSelector.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">{t('cancerSelector.searchLabel')}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder={t('cancerSelector.searchPlaceholder')}
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
                  variant={selectedCancer === cancer.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCancer(selectedCancer === cancer.id ? null : cancer.id);
                    setSelectedSubtype("all"); // Reset subtype when selecting different cancer
                  }}
                >
                  {selectedCancer === cancer.id ? t('cancerSelector.selected') : t('cancerSelector.select')}
                </Button>
              </div>

              {selectedCancer === cancer.id && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-foreground">{t('cancerSelector.filterLabel')}</h4>
                  </div>

                  {/* Subtype selector for gynecological and lung cancers */}
                  {(cancer.id === "gyn-all" || cancer.id === "lung-all") && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium text-foreground mb-2 block">
                        {cancer.id === "gyn-all" ? "Cancer Subtype" : "Lung Cancer Subtype"}
                      </Label>
                      <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${cancer.id === "gyn-all" ? "cancer" : "lung cancer"} subtype`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subtypes</SelectItem>
                          {cancer.id === "gyn-all" && getAvailableSubtypes(cancer).map((subtype: string) => (
                            <SelectItem key={subtype} value={subtype}>{subtype}</SelectItem>
                          ))}
                          {cancer.id === "lung-all" && (
                            <>
                              <SelectItem value="NSCLC">NSCLC</SelectItem>
                              <SelectItem value="SCLC">SCLC</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="all" className="text-xs">{t('cancerSelector.tabs.all')}</TabsTrigger>
                      <TabsTrigger value="neoadjuvant" className="text-xs">{t('cancerSelector.tabs.neoadjuvant')}</TabsTrigger>
                      <TabsTrigger value="adjuvant" className="text-xs">{t('cancerSelector.tabs.adjuvant')}</TabsTrigger>
                      <TabsTrigger value="advanced" className="text-xs">{t('cancerSelector.tabs.advanced')}</TabsTrigger>
                      <TabsTrigger value="metastatic" className="text-xs">{t('cancerSelector.tabs.metastatic')}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={selectedCategory} className="mt-4 space-y-3">
                      {getRegimensByCategory(cancer, selectedCategory, selectedSubtype).map((regimen: Regimen) => (
                        <div key={regimen.id} className="bg-secondary/50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-foreground">{regimen.name}</h5>
                                <Badge 
                                  variant={
                                    regimen.category === "neoadjuvant" ? "default" :
                                    regimen.category === "adjuvant" ? "secondary" :
                                    regimen.category === "advanced" ? "destructive" :
                                    "outline"
                                  }
                                  className="text-xs"
                                >
                                  {regimen.category.charAt(0).toUpperCase() + regimen.category.slice(1)}
                                </Badge>
                                {regimen.subtype && (
                                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                                    {regimen.subtype}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{regimen.description}</p>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{t('cancerSelector.meta.schedule')}: {regimen.schedule}</span>
                                <span>{t('cancerSelector.meta.cycles')}: {regimen.cycles}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onRegimenSelect(regimen)}
                              className="ml-2"
                            >
                              {t('cancerSelector.meta.calculateDoses')}
                            </Button>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">{t('cancerSelector.meta.drugs')}:</p>
                            <div className="flex flex-wrap gap-1">
                              {regimen.drugs.map((drug, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {drug.name} {drug.dosage} {drug.unit}
                                  {drug.day && ` (${drug.day})`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {getRegimensByCategory(cancer, selectedCategory, selectedSubtype).length === 0 && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          {t('cancerSelector.meta.noRegimensForFilter', { filter: selectedCategory })}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCancers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t('cancerSelector.meta.noResults')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};