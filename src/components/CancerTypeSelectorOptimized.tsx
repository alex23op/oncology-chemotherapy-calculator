import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Stethoscope, Filter, Star, StarOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cancerTypes } from "@/data/cancerTypes";
import { Regimen } from "@/types/regimens";
import { useTranslation } from 'react-i18next';
import { validateCancerType } from "@/types/schemas";
import { logger } from '@/utils/logger';

interface CancerTypeSelectorProps {
  onRegimenSelect: (regimen: Regimen) => void;
}

// Memoized regimen card component
const RegimenCard = React.memo<{
  regimen: Regimen;
  onSelect: (regimen: Regimen) => void;
  isFavorite: boolean;
  onToggleFavorite: (regimenId: string) => void;
  t: any;
}>(({ regimen, onSelect, isFavorite, onToggleFavorite, t }) => {
  const handleSelect = useCallback(() => {
    onSelect(regimen);
  }, [onSelect, regimen]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(regimen.id);
  }, [onToggleFavorite, regimen.id]);

  return (
    <div 
      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      aria-label={`Select ${regimen.name} regimen`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{regimen.name}</h4>
            {isFavorite && (
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {regimen.description}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>{regimen.description}</p>
                {regimen.biomarkerRequirements && (
                  <div className="mt-2">
                    <p className="font-semibold text-xs">Biomarkers required:</p>
                    {regimen.biomarkerRequirements.map((biomarker, idx) => (
                      <p key={idx} className="text-xs">
                        {biomarker.name}: {biomarker.status}
                      </p>
                    ))}
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center gap-1 mt-2">
            <Badge variant="outline" className="text-xs">
              {regimen.category}
            </Badge>
            {regimen.lineOfTherapy && (
              <Badge variant="secondary" className="text-xs">
                {regimen.lineOfTherapy}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className="p-1 h-auto"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            ) : (
              <StarOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleSelect}
            className="ml-2"
            aria-label={`Calculate doses for ${regimen.name}`}
          >
            {t('cancerSelector.meta.calculateDoses')}
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {t('cancerSelector.meta.drugs')}:
        </p>
        <div className="flex flex-wrap gap-1">
          {regimen.drugs.slice(0, 3).map((drug, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {drug.name} {drug.dosage} {drug.unit}
              {drug.day && ` (${drug.day})`}
            </Badge>
          ))}
          {regimen.drugs.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{regimen.drugs.length - 3} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
});

RegimenCard.displayName = 'RegimenCard';

export const CancerTypeSelector = ({ onRegimenSelect }: CancerTypeSelectorProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCancer, setSelectedCancer] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("all");
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('chemo-app-favorite-regimens');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      logger.error('Failed to load favorites:', error);
      return new Set();
    }
  });

  // Validate cancer types data on mount
  React.useEffect(() => {
    cancerTypes.forEach(cancerType => {
      if (!validateCancerType(cancerType)) {
        logger.error(`Invalid cancer type data:`, cancerType);
      }
    });
  }, []);

  // Memoized filtered cancers to prevent unnecessary recalculations
  const filteredCancers = useMemo(() => {
    return cancerTypes.filter(cancer =>
      cancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancer.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Memoized regimen filtering function
  const getRegimensByCategory = useCallback((cancer: any, category: string, subtype: string = "all") => {
    let regimens = cancer.regimens;
    
    // Filter by category
    if (category !== "all") {
      regimens = regimens.filter((regimen: Regimen) => regimen.category === category);
    }
    
    // Filter by subtype (for gynecological, lung, genitourinary, and gastrointestinal cancers)
    if ((cancer.id === "gyn-all" || cancer.id === "lung-all" || cancer.id === "gu-all" || cancer.id === "gi-all") && subtype !== "all") {
      regimens = regimens.filter((regimen: Regimen) => regimen.subtype === subtype);
    }
    
    return regimens;
  }, []);

  // Memoized available subtypes
  const getAvailableSubtypes = useCallback((cancer: any) => {
    const subtypes = [...new Set(cancer.regimens.map((regimen: Regimen) => regimen.subtype))];
    return subtypes.filter(Boolean);
  }, []);

  // Handle favorite toggle with localStorage persistence
  const handleToggleFavorite = useCallback((regimenId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(regimenId)) {
        newFavorites.delete(regimenId);
      } else {
        newFavorites.add(regimenId);
      }
      
      try {
        localStorage.setItem('chemo-app-favorite-regimens', JSON.stringify([...newFavorites]));
      } catch (error) {
        logger.error('Failed to save favorites:', error);
      }
      
      return newFavorites;
    });
  }, []);

  // Memoized regimen selection handler
  const handleRegimenSelect = useCallback((regimen: Regimen) => {
    logger.info('Regimen selected:', { regimenId: regimen.id, name: regimen.name });
    onRegimenSelect(regimen);
  }, [onRegimenSelect]);

  // Memoized cancer selection handler
  const handleCancerSelect = useCallback((cancerId: string) => {
    setSelectedCancer(selectedCancer === cancerId ? null : cancerId);
    setSelectedSubtype("all"); // Reset subtype when selecting different cancer
  }, [selectedCancer]);

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
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Search for cancer types and treatment regimens
            </div>
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
                  onClick={() => handleCancerSelect(cancer.id)}
                  aria-expanded={selectedCancer === cancer.id}
                  aria-controls={`cancer-${cancer.id}-content`}
                >
                  {selectedCancer === cancer.id ? t('cancerSelector.selected') : t('cancerSelector.select')}
                </Button>
              </div>

              {selectedCancer === cancer.id && (
                <div 
                  id={`cancer-${cancer.id}-content`}
                  className="mt-4 space-y-3"
                  role="region"
                  aria-label={`${cancer.name} regimens`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('cancerSelector.filter')}:</span>
                  </div>

                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">{t('cancerSelector.categories.all')}</TabsTrigger>
                      <TabsTrigger value="neoadjuvant">{t('cancerSelector.categories.neoadjuvant')}</TabsTrigger>
                      <TabsTrigger value="adjuvant">{t('cancerSelector.categories.adjuvant')}</TabsTrigger>
                      <TabsTrigger value="metastatic">{t('cancerSelector.categories.metastatic')}</TabsTrigger>
                    </TabsList>

                    {/* Subtype selector for multi-subtype cancers */}
                    {(cancer.id === "gyn-all" || cancer.id === "gi-all" || cancer.id === "gu-all") && (
                      <div className="mt-3">
                        <Label htmlFor={`subtype-${cancer.id}`} className="text-sm font-medium">
                          {t('cancerSelector.subtype')}:
                        </Label>
                        <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
                          <SelectTrigger id={`subtype-${cancer.id}`} className="mt-1">
                            <SelectValue placeholder={t('cancerSelector.selectSubtype')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t('cancerSelector.categories.all')}</SelectItem>
                        {getAvailableSubtypes(cancer).map((subtype: string) => (
                          <SelectItem key={subtype} value={subtype}>
                            {subtype}
                          </SelectItem>
                        ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <TabsContent value={selectedCategory} className="mt-4">
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {getRegimensByCategory(cancer, selectedCategory, selectedSubtype).map((regimen) => (
                          <RegimenCard
                            key={regimen.id}
                            regimen={regimen}
                            onSelect={handleRegimenSelect}
                            isFavorite={favorites.has(regimen.id)}
                            onToggleFavorite={handleToggleFavorite}
                            t={t}
                          />
                        ))}
                        
                        {getRegimensByCategory(cancer, selectedCategory, selectedSubtype).length === 0 && (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            {t('cancerSelector.meta.noRegimensForFilter', { filter: selectedCategory })}
                          </div>
                        )}
                      </div>
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