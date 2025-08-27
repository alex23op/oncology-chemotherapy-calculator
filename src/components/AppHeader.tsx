import { Stethoscope, Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTSafe } from '@/i18n/tSafe';
import { LanguageToggle } from "./LanguageToggle";
import { SmartNavSettings } from "@/components/SmartNavSettings";
export const AppHeader = () => {
  const tSafe = useTSafe();
  return (
    <header className="border-b bg-card" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg" aria-hidden="true">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" id="app-title">
                {tSafe('header.title', 'Onco-Cal')}
              </h1>
              <p className="text-sm text-muted-foreground" aria-describedby="app-title">
                {tSafe('header.subtitle', 'Oncology Dose Calculator')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3" role="group" aria-label="Application settings and status">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1"
              role="status"
              aria-label={tSafe('header.hipaa', 'HIPAA Compliant')}
            >
              <Shield className="h-3 w-3" aria-hidden="true" />
              {tSafe('header.hipaa', 'HIPAA Compliant')}
            </Badge>
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
              role="status"
              aria-label={tSafe('header.clinicalUseOnly', 'Clinical Use Only')}
            >
              <Info className="h-3 w-3" aria-hidden="true" />
              {tSafe('header.clinicalUseOnly', 'Clinical Use Only')}
            </Badge>
            <LanguageToggle />
            <SmartNavSettings />
          </div>
        </div>
      </div>
    </header>
  );
};