import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';

interface AdditionalObservationsSectionProps {
  observations?: string;
}

export const AdditionalObservationsSection: React.FC<AdditionalObservationsSectionProps> = ({ 
  observations 
}) => {
  return (
    <div>
      <h4 className="text-xs font-bold bg-gray-50 p-1 border-l-2 border-primary mb-1">OBSERVAȚII SUPLIMENTARE</h4>
      <Table className="w-full border-collapse border border-gray-300">
        <TableBody>
          <TableRow>
            <TableCell className="border border-gray-300 p-2 text-xs min-h-[2rem]">
              {observations || (
                <div className="text-gray-400 italic">
                  Spațiu pentru observații suplimentare ale medicului...
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};