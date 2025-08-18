import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, X, Check } from 'lucide-react';
import { SafetyAlert } from '@/utils/clinicalSafetyEngine';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SafetyAlertsPanelProps {
  alerts: SafetyAlert[];
  onAlertDismiss?: (alertId: string, justification?: string) => void;
  onAlertAcknowledge?: (alertId: string) => void;
  className?: string;
}

interface AlertOverride {
  alertId: string;
  justification: string;
  acknowledgedBy: string;
  timestamp: Date;
}

export const SafetyAlertsPanel: React.FC<SafetyAlertsPanelProps> = ({
  alerts,
  onAlertDismiss,
  onAlertAcknowledge,
  className
}) => {
  const { t } = useTranslation();
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [justification, setJustification] = useState('');
  const [overriddenAlerts, setOverriddenAlerts] = useState<Set<string>>(new Set());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const getSeverityIcon = (severity: SafetyAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: SafetyAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      case 'info':
        return 'default' as const;
    }
  };

  const getSeverityBadgeVariant = (severity: SafetyAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
    }
  };

  const handleOverrideAlert = () => {
    if (!selectedAlert || !justification.trim()) return;

    setOverriddenAlerts(prev => new Set(prev).add(selectedAlert.id));
    onAlertDismiss?.(selectedAlert.id, justification);
    
    setShowOverrideDialog(false);
    setSelectedAlert(null);
    setJustification('');
  };

  const handleAcknowledgeAlert = (alert: SafetyAlert) => {
    setAcknowledgedAlerts(prev => new Set(prev).add(alert.id));
    onAlertAcknowledge?.(alert.id);
  };

  const openOverrideDialog = (alert: SafetyAlert) => {
    setSelectedAlert(alert);
    setShowOverrideDialog(true);
  };

  // Filter out overridden and acknowledged alerts
  const visibleAlerts = alerts.filter(alert => 
    !overriddenAlerts.has(alert.id) && !acknowledgedAlerts.has(alert.id)
  );

  const criticalAlerts = visibleAlerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = visibleAlerts.filter(alert => alert.severity === 'warning');
  const infoAlerts = visibleAlerts.filter(alert => alert.severity === 'info');

  if (visibleAlerts.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
<div className="flex items-center gap-2 text-success">
  <Check className="h-4 w-4" />
  <span className="text-sm font-medium">{t('safetyAlerts.allClear')}</span>
</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
<h3 className="text-lg font-semibold text-foreground">{t('safetyAlerts.title')}</h3>
<div className="flex gap-2">
  {criticalAlerts.length > 0 && (
    <Badge variant="destructive" className="flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      {t('safetyAlerts.counts.critical', { count: criticalAlerts.length })}
    </Badge>
  )}
  {warningAlerts.length > 0 && (
    <Badge variant="secondary" className="flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {t('safetyAlerts.counts.warning', { count: warningAlerts.length })}
    </Badge>
  )}
  {infoAlerts.length > 0 && (
    <Badge variant="outline" className="flex items-center gap-1">
      <Info className="h-3 w-3" />
      {t('safetyAlerts.counts.info', { count: infoAlerts.length })}
    </Badge>
  )}
</div>
      </div>

      <div className="space-y-3">
        {visibleAlerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={getSeverityColor(alert.severity)}
            className="relative"
          >
            <div className="flex items-start gap-3">
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <AlertTitle className="text-sm font-medium">
                    {alert.title}
                  </AlertTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">
                      {alert.type}
                    </Badge>
                    <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
                
                <AlertDescription className="text-sm">
                  <div className="space-y-1">
                    <p>{alert.message}</p>
<p className="font-medium text-foreground">
  <strong>{t('safetyAlerts.recommendation')}:</strong> {alert.recommendation}
</p>
{alert.references && alert.references.length > 0 && (
  <p className="text-xs text-muted-foreground">
    <strong>{t('safetyAlerts.references')}:</strong> {alert.references.join(', ')}
  </p>
)}
                  </div>
                </AlertDescription>
                
                <div className="flex gap-2 pt-2">
                  {alert.severity !== 'critical' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledgeAlert(alert)}
                      className="text-xs"
                    >
<Check className="h-3 w-3 mr-1" />
{t('safetyAlerts.actions.acknowledge')}
</Button>
)}

{alert.canOverride && (
  <Button
    size="sm"
    variant="outline"
    onClick={() => openOverrideDialog(alert)}
    className="text-xs"
  >
    <X className="h-3 w-3 mr-1" />
    {t('safetyAlerts.actions.override')}
  </Button>
)}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>

      {/* Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
<DialogTitle>{t('safetyAlerts.dialog.overrideTitle')}</DialogTitle>
<DialogDescription>
  {t('safetyAlerts.dialog.overrideDesc', { severity: selectedAlert?.severity, requiresJustification: selectedAlert?.requiresJustification ? t('safetyAlerts.dialog.requiresJustification') : '' })}
</DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4">
              <Alert variant={getSeverityColor(selectedAlert.severity)}>
                {getSeverityIcon(selectedAlert.severity)}
                <AlertTitle>{selectedAlert.title}</AlertTitle>
                <AlertDescription>{selectedAlert.message}</AlertDescription>
              </Alert>
              
              {selectedAlert.requiresJustification && (
                <div className="space-y-2">
<Label htmlFor="justification">{t('safetyAlerts.dialog.clinicalJustification')}</Label>
<Textarea
  id="justification"
  value={justification}
  onChange={(e) => setJustification(e.target.value)}
  placeholder={t('safetyAlerts.dialog.placeholder')}
  className="min-h-20"
/>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
<Button
  variant="outline"
  onClick={() => {
    setShowOverrideDialog(false);
    setSelectedAlert(null);
    setJustification('');
  }}
>
  {t('safetyAlerts.dialog.cancel')}
</Button>
<Button
  variant="destructive"
  onClick={handleOverrideAlert}
  disabled={selectedAlert?.requiresJustification && !justification.trim()}
>
  {t('safetyAlerts.dialog.overrideAlert')}
</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add default export
export default SafetyAlertsPanel;