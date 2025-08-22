import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getBiomarkerPanel } from '@/data/biomarkerTesting';
import { Biomarker } from '@/types/regimens';
import { useTSafe } from '@/i18n/tSafe';
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
  const tSafe = useTSafe();
  const [biomarkerStatuses, setBiomarkerStatuses] = useState<{ [key: string]: string }>({});
  const [testingComplete, setTestingComplete] = useState(false);

  const biomarkerPanel = getBiomarkerPanel(cancerType, stage);

  if (!biomarkerPanel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{tSafe('biomarker.title', 'Biomarker Profiler')}</CardTitle>
          <CardDescription>{tSafe('biomarker.noPanel', 'No biomarker panel available for this cancer type and stage')}</CardDescription>
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
            {tSafe('biomarker.panelTitle', 'Biomarker Testing Panel')}
          </CardTitle>
          <CardDescription>
            {biomarkerPanel.testingGuidelines}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>{tSafe('biomarker.turnaround', 'Turnaround Time')}:</strong> {biomarkerPanel.turnaroundTime}
            </div>
            <div>
              <strong>{tSafe('biomarker.tissueReq', 'Tissue Requirements')}:</strong> {biomarkerPanel.tissueRequirements}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{tSafe('biomarker.requiredTitle', 'Required Biomarkers')}</CardTitle>
          <CardDescription>
            {tSafe('biomarker.requiredDesc', 'These biomarkers are required for treatment selection')}
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
                <SelectValue placeholder={tSafe('biomarker.status.unknown', 'Unknown')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">{tSafe('biomarker.status.unknown', 'Unknown')}</SelectItem>
                <SelectItem value="positive">{tSafe('biomarker.status.positive', 'Positive')}</SelectItem>
                <SelectItem value="negative">{tSafe('biomarker.status.negative', 'Negative')}</SelectItem>
                <SelectItem value="wild-type">{tSafe('biomarker.status.wildType', 'Wild-type')}</SelectItem>
                <SelectItem value="mutated">{tSafe('biomarker.status.mutated', 'Mutated')}</SelectItem>
                <SelectItem value="amplified">{tSafe('biomarker.status.amplified', 'Amplified')}</SelectItem>
                <SelectItem value="high">{tSafe('biomarker.status.high', 'High')}</SelectItem>
                <SelectItem value="low">{tSafe('biomarker.status.low', 'Low')}</SelectItem>
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
            <CardTitle>{tSafe('biomarker.recommendedTitle', 'Recommended Biomarkers')}</CardTitle>
            <CardDescription>
              {tSafe('biomarker.recommendedDesc', 'These biomarkers are recommended for optimal treatment selection')}
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
                <SelectValue placeholder={tSafe('biomarker.status.unknown', 'Unknown')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">{tSafe('biomarker.status.unknown', 'Unknown')}</SelectItem>
                <SelectItem value="positive">{tSafe('biomarker.status.positive', 'Positive')}</SelectItem>
                <SelectItem value="negative">{tSafe('biomarker.status.negative', 'Negative')}</SelectItem>
                <SelectItem value="wild-type">{tSafe('biomarker.status.wildType', 'Wild-type')}</SelectItem>
                <SelectItem value="mutated">{tSafe('biomarker.status.mutated', 'Mutated')}</SelectItem>
                <SelectItem value="amplified">{tSafe('biomarker.status.amplified', 'Amplified')}</SelectItem>
                <SelectItem value="high">{tSafe('biomarker.status.high', 'High')}</SelectItem>
                <SelectItem value="low">{tSafe('biomarker.status.low', 'Low')}</SelectItem>
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
            ? tSafe('biomarker.allRequiredTested', 'All required biomarkers have been tested')
            : tSafe('biomarker.requiredTestedCount', `${biomarkerPanel.requiredBiomarkers.filter(b => biomarkerStatuses[b.name] && biomarkerStatuses[b.name] !== 'unknown').length} of ${biomarkerPanel.requiredBiomarkers.length} required biomarkers tested`, { done: biomarkerPanel.requiredBiomarkers.filter(b => biomarkerStatuses[b.name] && biomarkerStatuses[b.name] !== 'unknown').length, total: biomarkerPanel.requiredBiomarkers.length })
          }
        </div>
        <Button
          onClick={() => setTestingComplete(true)}
          disabled={!allRequiredTested}
          variant={allRequiredTested ? "default" : "outline"}
        >
          {allRequiredTested ? tSafe('biomarker.completeProfile', 'Complete Profile') : tSafe('biomarker.completeRequired', 'Complete Required Tests')}
        </Button>
      </div>
    </div>
  );
};