import { Stethoscope, Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AppHeader = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ChemoCalc Pro</h1>
              <p className="text-sm text-muted-foreground">Oncology Dose Calculator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              Clinical Use Only
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};