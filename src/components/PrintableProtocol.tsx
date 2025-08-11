import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface PrintableProtocolProps {
  selectedAgents: any[];
  regimenName?: string;
  patientWeight?: number;
  emetogenicRisk?: string;
  className?: string;
}

export const PrintableProtocol = React.forwardRef<HTMLDivElement, PrintableProtocolProps>(
  ({ selectedAgents, regimenName, patientWeight, emetogenicRisk, className }, ref) => {
    const { t, i18n } = useTranslation();
    if (selectedAgents.length === 0) {
      return (
        <div ref={ref} className={className}>
          <p className="text-muted-foreground text-center py-8">
            {t('printableProtocol.noAgents')}
          </p>
        </div>
      );
    }

    // Group agents by category
    const agentsByCategory = selectedAgents.reduce((acc, agent) => {
      const category = agent.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(agent);
      return acc;
    }, {} as Record<string, any[]>);

    return (
      <div ref={ref} className={`${className} print:bg-white print:text-black`}>
        {/* Header */}
        <div className="mb-6 print:mb-4">
          <h1 className="text-2xl font-bold text-center mb-2 print:text-xl">
            {t('printableProtocol.headerTitle')}
          </h1>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground print:text-black">
            {regimenName && (
              <span><strong>{t('printableProtocol.regimen')}:</strong> {regimenName}</span>
            )}
            {emetogenicRisk && (
              <span><strong>{t('printableProtocol.emetogenicRisk')}:</strong> {emetogenicRisk}</span>
            )}
            {patientWeight && (
              <span><strong>{t('printableProtocol.patientWeight')}:</strong> {patientWeight} kg</span>
            )}
          </div>
        </div>

        {/* Protocol Content */}
        <div className="space-y-6 print:space-y-4">
          {Object.entries(agentsByCategory).map(([category, agents]) => (
            <Card key={category} className="print:border print:border-gray-300 print:shadow-none">
              <CardHeader className="pb-3 print:pb-2">
                <CardTitle className="text-lg print:text-base">{category === 'Other' ? t('printableProtocol.otherCategory') : category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 print:space-y-2">
                {(agents as any[]).map((agent, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 print:border-l-2 print:border-gray-400">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h4 className="font-semibold text-base print:text-sm">{agent.name}</h4>
                      {agent.indication && (
                        <Badge variant="outline" className="text-xs print:border-gray-400 print:text-black">
                          {agent.indication}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm print:text-xs">
                      {agent.dosage && (
                        <div>
                          <span className="font-medium">{t('printableProtocol.dosage')}:</span> {agent.dosage}
                        </div>
                      )}
                      {agent.route && (
                        <div>
                          <span className="font-medium">{t('printableProtocol.route')}:</span> {agent.route}
                        </div>
                      )}
                      {agent.timing && (
                        <div>
                          <span className="font-medium">{t('printableProtocol.timing')}:</span> {agent.timing}
                        </div>
                      )}
                      {agent.duration && (
                        <div>
                          <span className="font-medium">{t('printableProtocol.duration')}:</span> {agent.duration}
                        </div>
                      )}
                    </div>
                    
                    {agent.rationale && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm print:bg-gray-100 print:text-xs">
                        <span className="font-medium">{t('printableProtocol.clinicalRationale')}:</span> {agent.rationale}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-xs text-muted-foreground print:text-black print:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <strong>{t('printableProtocol.generated')}:</strong> {new Date().toLocaleString(i18n.language)}
            </div>
            <div className="text-right print:text-left">
              <strong>{t('printableProtocol.totalAgents')}:</strong> {selectedAgents.length}
            </div>
          </div>
          <div className="mt-2 text-center">
            <em>{t('printableProtocol.footerNote')}</em>
          </div>
        </div>
      </div>
    );
  }
);

PrintableProtocol.displayName = 'PrintableProtocol';