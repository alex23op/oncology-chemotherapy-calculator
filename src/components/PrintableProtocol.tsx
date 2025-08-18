import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { GroupedPremedications, PremedAgent } from '@/types/clinicalTreatment';

interface PrintableProtocolProps {
  selectedAgents: any[];
  regimenName?: string;
  patientWeight?: number;
  emetogenicRisk?: string;
  className?: string;
  solventGroups?: GroupedPremedications;
}

export const PrintableProtocol = React.forwardRef<HTMLDivElement, PrintableProtocolProps>(
  ({ selectedAgents, regimenName, patientWeight, emetogenicRisk, className, solventGroups }, ref) => {
    const { t, i18n } = useTranslation();
    
    // Check if we have PEV groups or fall back to individual agents
    const hasPevGroups = solventGroups && ((solventGroups.groups.length > 0) || (solventGroups.individual.length > 0));
    const hasAnyMedications = hasPevGroups || selectedAgents.length > 0;
    
    if (!hasAnyMedications) {
      return (
        <div ref={ref} className={className}>
          <p className="text-muted-foreground text-center py-8">
            {t('printableProtocol.noAgents')}
          </p>
        </div>
      );
    }

    // Group agents by category (fallback for non-PEV display)
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
          {/* PEV Groups Display */}
          {hasPevGroups && (
            <Card className="print:border print:border-gray-300 print:shadow-none">
              <CardHeader className="pb-3 print:pb-2">
                <CardTitle className="text-lg print:text-base">{t('printableProtocol.premedSupport')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 print:space-y-2">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 print:text-xs">
                    <thead>
                      <tr className="bg-gray-50 print:bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.pevNumber')}</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.medications')}</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.solvent')}</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold print:px-1 print:py-0.5">{t('compactSheet.given')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render PEV Groups */}
                      {solventGroups!.groups.map((group, index) => (
                        <tr key={`group-${group.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                          <td className="border border-gray-300 px-3 py-2 font-medium print:px-1 print:py-0.5">
                            {index + 1} PEV
                          </td>
                          <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">
                            {group.medications.map((med, medIndex) => (
                              <span key={medIndex}>
                                {medIndex > 0 && ' + '}
                                <span className="font-medium">{med.name}</span>
                                <span className="text-muted-foreground ml-1">({med.dosage})</span>
                              </span>
                            ))}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">{group.solvent}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center print:px-1 print:py-0.5">☐</td>
                        </tr>
                      ))}
                      {/* Render Individual Medications as separate PEVs */}
                      {solventGroups!.individual.map((med, index) => {
                        const pevNumber = solventGroups!.groups.length + index + 1;
                        const rowIndex = solventGroups!.groups.length + index;
                        return (
                          <tr key={`individual-${index}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25 print:bg-gray-50'}>
                            <td className="border border-gray-300 px-3 py-2 font-medium print:px-1 print:py-0.5">
                              {pevNumber} PEV
                            </td>
                            <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">
                              <span className="font-medium">{med.name}</span>
                              <span className="text-muted-foreground ml-1">({med.dosage})</span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 print:px-1 print:py-0.5">{med.solvent || t('compactSheet.na')}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center print:px-1 print:py-0.5">☐</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Fallback: Individual Agent Categories (only if no PEV groups) */}
          {!hasPevGroups && Object.entries(agentsByCategory).map(([category, agents]) => (
            <Card key={category} className="print:border print:border-gray-300 print:shadow-none">
              <CardHeader className="pb-3 print:pb-2">
                <CardTitle className="text-lg print:text-base">{category === 'Other' ? t('printableProtocol.otherCategory') : category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 print:space-y-2">
                {(agents as PremedAgent[]).map((agent, index) => (
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