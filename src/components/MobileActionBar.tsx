import { Button } from "@/components/ui/button";
import { FileCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface MobileActionBarProps {
  onGenerate: () => void;
  onExport: () => void;
  disableGenerate?: boolean;
  disableExport?: boolean;
  className?: string;
}

export const MobileActionBar = ({ onGenerate, onExport, disableGenerate, disableExport, className }: MobileActionBarProps) => {
  const { t } = useTranslation();
  return (
    <div className={cn("sm:hidden fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} style={{ paddingBottom: `max(env(safe-area-inset-bottom), 0.5rem)` }}>
      <div className="container mx-auto px-4 py-3 flex gap-2">
        <Button className="flex-1" size="sm" variant="secondary" onClick={onGenerate} disabled={disableGenerate}>
          <FileCheck className="h-4 w-4" /> {t('mobileActions.generate', { defaultValue: 'Generate' })}
        </Button>
        <Button className="flex-1" size="sm" variant="outline" onClick={onExport} disabled={disableExport}>
          <FileText className="h-4 w-4" /> {t('mobileActions.export', { defaultValue: 'Export' })}
        </Button>
      </div>
    </div>
  );
};
