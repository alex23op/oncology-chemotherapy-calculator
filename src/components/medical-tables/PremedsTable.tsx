import React from 'react';
import { TreatmentData } from '@/types/clinicalTreatment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface PremedsTableProps {
  premedications: TreatmentData['premedications'];
  solventGroups?: TreatmentData['solventGroups'];
}

export const PremedsTable: React.FC<PremedsTableProps> = ({ premedications, solventGroups }) => {
  // Collect all premedication agents
  const allPremeds = [
    ...premedications.antiemetics,
    ...premedications.infusionReactionProphylaxis,
    ...premedications.gastroprotection,
    ...premedications.organProtection,
    ...premedications.other
  ];

  const getCategoryName = (agent: any) => {
    if (premedications.antiemetics.includes(agent)) return 'Antiemetic';
    if (premedications.infusionReactionProphylaxis.includes(agent)) return 'Profilaxie reacții infuzionale';
    if (premedications.gastroprotection.includes(agent)) return 'Gastroprotecție';
    if (premedications.organProtection.includes(agent)) return 'Protecție organică';
    return 'Altele';
  };

  return (
    <div>
      {solventGroups && solventGroups.groups.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-accent">GRUPE PEV (Premedicație, Emesis, Volumetrie)</h4>
          {solventGroups.groups.map((group, groupIndex) => (
            <div key={group.id} className="mb-4">
              <div className="bg-accent/10 p-2 rounded mb-2">
                <span className="font-medium">Grupa {groupIndex + 1}: {group.solvent}</span>
              </div>
              <Table className="border-2 border-foreground mb-3">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="border-r border-foreground font-semibold">MEDICAMENT</TableHead>
                    <TableHead className="border-r border-foreground font-semibold">DOZĂ</TableHead>
                    <TableHead className="border-r border-foreground font-semibold">CALE ADMIN.</TableHead>
                    <TableHead className="border-r border-foreground font-semibold">TIMING</TableHead>
                    <TableHead className="border-r border-foreground font-semibold">OBSERVAȚII</TableHead>
                    <TableHead className="border-r border-foreground font-semibold">✓</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.medications.map((med, medIndex) => (
                    <TableRow key={medIndex} className="border-b border-foreground">
                      <TableCell className="border-r border-foreground font-medium bg-muted/20">
                        <div className="font-semibold">{med.name}</div>
                        <div className="text-sm text-muted-foreground">{med.class}</div>
                      </TableCell>
                      <TableCell className="border-r border-foreground">
                        {med.dosage} {med.unit}
                      </TableCell>
                      <TableCell className="border-r border-foreground">
                        {med.route}
                      </TableCell>
                      <TableCell className="border-r border-foreground">
                        {med.timing}
                      </TableCell>
                      <TableCell className="border-r border-foreground">
                        <div className="text-sm">{med.rationale}</div>
                        {med.notes && <div className="text-xs mt-1">{med.notes}</div>}
                      </TableCell>
                      <TableCell className="border-r border-foreground text-center">
                        <div className="w-6 h-6 border-2 border-foreground rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}

      <h4 className="font-semibold mb-2">PREMEDICAȚIE INDIVIDUALĂ</h4>
      <Table className="border-2 border-foreground">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="border-r border-foreground font-semibold">CATEGORIE</TableHead>
            <TableHead className="border-r border-foreground font-semibold">MEDICAMENT</TableHead>
            <TableHead className="border-r border-foreground font-semibold">DOZĂ</TableHead>
            <TableHead className="border-r border-foreground font-semibold">CALE ADMIN.</TableHead>
            <TableHead className="border-r border-foreground font-semibold">TIMING</TableHead>
            <TableHead className="border-r border-foreground font-semibold">OBSERVAȚII</TableHead>
            <TableHead className="border-r border-foreground font-semibold">✓</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allPremeds.map((premed, index) => (
            <TableRow key={index} className="border-b border-foreground">
              <TableCell className="border-r border-foreground font-medium bg-muted/20">
                {getCategoryName(premed)}
              </TableCell>
              <TableCell className="border-r border-foreground">
                <div className="font-semibold">{premed.name}</div>
                <div className="text-sm text-muted-foreground">{premed.class}</div>
              </TableCell>
              <TableCell className="border-r border-foreground">
                {premed.dosage} {premed.unit}
              </TableCell>
              <TableCell className="border-r border-foreground">
                {premed.route}
              </TableCell>
              <TableCell className="border-r border-foreground">
                {premed.timing}
              </TableCell>
              <TableCell className="border-r border-foreground">
                <div className="text-sm">{premed.rationale}</div>
                {premed.notes && <div className="text-xs mt-1">{premed.notes}</div>}
                {premed.indication && (
                  <div className="text-xs text-info mt-1">Indicație: {premed.indication}</div>
                )}
              </TableCell>
              <TableCell className="border-r border-foreground text-center">
                <div className="w-6 h-6 border-2 border-foreground rounded"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};