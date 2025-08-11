import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Regimen } from "@/types/regimens";

export interface PatientSummaryPanelProps {
  patientData: {
    weight: string;
    height: string;
    age: string;
    sex: string;
    creatinine: string;
    bsa: number;
    creatinineClearance: number;
  } | null;
  selectedRegimen: Regimen | null;
  className?: string;
}

export const PatientSummaryPanel = ({ patientData, selectedRegimen, className }: PatientSummaryPanelProps) => {
  const { t } = useTranslation();

  return (
    <aside className={`w-full lg:sticky lg:top-4 ${className || ""}`} aria-label={t('summary.title', { defaultValue: 'Patient & Regimen Summary' })}>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t('summary.title', { defaultValue: 'Patient & Regimen Summary' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('summary.patient', { defaultValue: 'Patient' })}</span>
              <Badge variant="outline">{patientData ? (patientData.sex || t('summary.unknown', { defaultValue: 'Unknown' })) : t('summary.unknown', { defaultValue: 'Unknown' })}</Badge>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex justify-between"><span className="text-muted-foreground">{t('summary.weight', { defaultValue: 'Weight' })}</span><span className="font-medium">{patientData?.weight || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('summary.height', { defaultValue: 'Height' })}</span><span className="font-medium">{patientData?.height || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('summary.bsa', { defaultValue: 'BSA' })}</span><span className="font-medium">{patientData?.bsa ? `${patientData.bsa} m²` : '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('summary.crcl', { defaultValue: 'CrCl' })}</span><span className="font-medium">{patientData?.creatinineClearance ? `${patientData.creatinineClearance} mL/min` : '-'}</span></div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('summary.regimen', { defaultValue: 'Regimen' })}</span>
              <Badge variant="secondary">{selectedRegimen ? t('summary.selected', { defaultValue: 'Selected' }) : t('summary.notSelected', { defaultValue: 'Not selected' })}</Badge>
            </div>
            <div className="mt-2">
              <p className="font-medium text-foreground line-clamp-2" title={selectedRegimen?.name}>{selectedRegimen?.name || '-'}</p>
              {selectedRegimen?.schedule && (
                <p className="text-xs text-muted-foreground mt-1">{selectedRegimen.schedule}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};
