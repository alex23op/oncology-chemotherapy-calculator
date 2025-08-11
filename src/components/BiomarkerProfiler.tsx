import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getBiomarkerPanel } from '@/data/biomarkerTesting';
import { Biomarker } from '@/types/regimens';

interface BiomarkerProfilerProps {
  cancerType: string;
  stage: string;
  onBiomarkerStatusChange: (biomarkers: { [key: string]: string }) => void;
}

export const BiomarkerProfiler: React.FC<BiomarkerProfilerProps> = ({
  cancerType,
  stage,
  onBiomarkerStatusChange
}) => {
  const { t } = useTranslation();
  const [biomarkerStatuses, setBiomarkerStatuses] = useState<{ [key: string]: string }>({});
  const [testingComplete, setTestingComplete] = useState(false);

  const biomarkerPanel = getBiomarkerPanel(cancerType, stage);

  if (!biomarkerPanel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('biomarker.title')}</CardTitle>
          <CardDescription>{t('biomarker.noPanel')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleBiomarkerChange = (biomarkerName: string, status: string) => {
    const updatedStatuses = { ...biomarkerStatuses, [biomarkerName]: status };
    setBiomarkerStatuses(updatedStatuses);
    onBiomarkerStatusChange(updatedStatuses);
  };

  const allRequiredTested = biomarkerPanel.requiredBiomarkers.every(
    biomarker => biomarkerStatuses[biomarker.name] && biomarkerStatuses[biomarker.name] !== 'unknown'
  );

  const getStatusIcon = (biomarker: Biomarker) => {
    const status = biomarkerStatuses[biomarker.name];
    if (!status || status === 'unknown') {
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'positive':
      case 'mutated':
      case 'amplified':
      case 'high':
        return 'destructive';
      case 'negative':
      case 'wild-type':
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Biomarker Testing Panel
          </CardTitle>
          <CardDescription>
            {biomarkerPanel.testingGuidelines}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Turnaround Time:</strong> {biomarkerPanel.turnaroundTime}
            </div>
            <div>
              <strong>Tissue Requirements:</strong> {biomarkerPanel.tissueRequirements}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('biomarker.requiredTitle')}</CardTitle>
          <CardDescription>
            {t('biomarker.requiredDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {biomarkerPanel.requiredBiomarkers.map((biomarker) => (
            <div key={biomarker.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(biomarker)}
                <div>
                  <div className="font-medium">{biomarker.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {biomarker.testingMethod} • {biomarker.turnaroundTime}
                    {biomarker.threshold && ` • ${biomarker.threshold}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {biomarkerStatuses[biomarker.name] && biomarkerStatuses[biomarker.name] !== 'unknown' && (
                  <Badge variant={getStatusBadgeVariant(biomarkerStatuses[biomarker.name])}>
                    {biomarkerStatuses[biomarker.name]}
                  </Badge>
                )}
                <Select
                  value={biomarkerStatuses[biomarker.name] || 'unknown'}
                  onValueChange={(value) => handleBiomarkerChange(biomarker.name, value)}
                >
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('biomarker.status.unknown')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">{t('biomarker.status.unknown')}</SelectItem>
                <SelectItem value="positive">{t('biomarker.status.positive')}</SelectItem>
                <SelectItem value="negative">{t('biomarker.status.negative')}</SelectItem>
                <SelectItem value="wild-type">{t('biomarker.status.wildType')}</SelectItem>
                <SelectItem value="mutated">{t('biomarker.status.mutated')}</SelectItem>
                <SelectItem value="amplified">{t('biomarker.status.amplified')}</SelectItem>
                <SelectItem value="high">{t('biomarker.status.high')}</SelectItem>
                <SelectItem value="low">{t('biomarker.status.low')}</SelectItem>
              </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {biomarkerPanel.recommendedBiomarkers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('biomarker.recommendedTitle')}</CardTitle>
            <CardDescription>
              {t('biomarker.recommendedDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {biomarkerPanel.recommendedBiomarkers.map((biomarker) => (
              <div key={biomarker.name} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(biomarker)}
                  <div>
                    <div className="font-medium">{biomarker.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {biomarker.testingMethod} • {biomarker.turnaroundTime}
                      {biomarker.threshold && ` • ${biomarker.threshold}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {biomarkerStatuses[biomarker.name] && biomarkerStatuses[biomarker.name] !== 'unknown' && (
                    <Badge variant={getStatusBadgeVariant(biomarkerStatuses[biomarker.name])}>
                      {biomarkerStatuses[biomarker.name]}
                    </Badge>
                  )}
                  <Select
                    value={biomarkerStatuses[biomarker.name] || 'unknown'}
                    onValueChange={(value) => handleBiomarkerChange(biomarker.name, value)}
                  >
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('biomarker.status.unknown')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">{t('biomarker.status.unknown')}</SelectItem>
                <SelectItem value="positive">{t('biomarker.status.positive')}</SelectItem>
                <SelectItem value="negative">{t('biomarker.status.negative')}</SelectItem>
                <SelectItem value="wild-type">{t('biomarker.status.wildType')}</SelectItem>
                <SelectItem value="mutated">{t('biomarker.status.mutated')}</SelectItem>
                <SelectItem value="amplified">{t('biomarker.status.amplified')}</SelectItem>
                <SelectItem value="high">{t('biomarker.status.high')}</SelectItem>
                <SelectItem value="low">{t('biomarker.status.low')}</SelectItem>
              </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {allRequiredTested
            ? t('biomarker.allRequiredTested')
            : t('biomarker.requiredTestedCount', { done: biomarkerPanel.requiredBiomarkers.filter(b => biomarkerStatuses[b.name] && biomarkerStatuses[b.name] !== 'unknown').length, total: biomarkerPanel.requiredBiomarkers.length })
          }
        </div>
        <Button
          onClick={() => setTestingComplete(true)}
          disabled={!allRequiredTested}
          variant={allRequiredTested ? "default" : "outline"}
        >
          {allRequiredTested ? t('biomarker.completeProfile') : t('biomarker.completeRequired')}
        </Button>
      </div>
    </div>
  );
};