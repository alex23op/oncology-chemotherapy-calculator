import { Stethoscope, Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "./LanguageToggle";
import { SmartNavSettings } from "@/components/SmartNavSettings";
export const AppHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('header.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {t('header.hipaa')}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              {t('header.clinicalUseOnly')}
            </Badge>
            <LanguageToggle />
            <SmartNavSettings />
          </div>
        </div>
      </div>
    </header>
  );
};