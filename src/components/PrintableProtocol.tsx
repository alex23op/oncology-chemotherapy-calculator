import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PrintableProtocolProps {
  selectedAgents: any[];
  regimenName?: string;
  patientWeight?: number;
  emetogenicRisk?: string;
  className?: string;
}

export const PrintableProtocol = React.forwardRef<HTMLDivElement, PrintableProtocolProps>(
  ({ selectedAgents, regimenName, patientWeight, emetogenicRisk, className }, ref) => {
    if (selectedAgents.length === 0) {
      return (
        <div ref={ref} className={className}>
          <p className="text-muted-foreground text-center py-8">
            No agents selected for protocol
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
            Chemotherapy Premedication Protocol
          </h1>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground print:text-black">
            {regimenName && (
              <span><strong>Regimen:</strong> {regimenName}</span>
            )}
            {emetogenicRisk && (
              <span><strong>Emetogenic Risk:</strong> {emetogenicRisk}</span>
            )}
            {patientWeight && (
              <span><strong>Patient Weight:</strong> {patientWeight} kg</span>
            )}
          </div>
        </div>

        {/* Protocol Content */}
        <div className="space-y-6 print:space-y-4">
          {Object.entries(agentsByCategory).map(([category, agents]) => (
            <Card key={category} className="print:border print:border-gray-300 print:shadow-none">
              <CardHeader className="pb-3 print:pb-2">
                <CardTitle className="text-lg print:text-base">{category}</CardTitle>
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
                          <span className="font-medium">Dosage:</span> {agent.dosage}
                        </div>
                      )}
                      {agent.route && (
                        <div>
                          <span className="font-medium">Route:</span> {agent.route}
                        </div>
                      )}
                      {agent.timing && (
                        <div>
                          <span className="font-medium">Timing:</span> {agent.timing}
                        </div>
                      )}
                      {agent.duration && (
                        <div>
                          <span className="font-medium">Duration:</span> {agent.duration}
                        </div>
                      )}
                    </div>
                    
                    {agent.rationale && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm print:bg-gray-100 print:text-xs">
                        <span className="font-medium">Clinical Rationale:</span> {agent.rationale}
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
              <strong>Generated:</strong> {new Date().toLocaleString()}
            </div>
            <div className="text-right print:text-left">
              <strong>Total Agents:</strong> {selectedAgents.length}
            </div>
          </div>
          <div className="mt-2 text-center">
            <em>This protocol is computer-generated and should be reviewed by a qualified healthcare professional before use.</em>
          </div>
        </div>
      </div>
    );
  }
);

PrintableProtocol.displayName = 'PrintableProtocol';