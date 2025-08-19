import React from 'react';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';

interface GenerateTreatmentSheetButtonProps {
  onGenerate: () => void;
  disabled?: boolean;
  className?: string;
}

export const GenerateTreatmentSheetButton: React.FC<GenerateTreatmentSheetButtonProps> = ({
  onGenerate,
  disabled = false,
  className = ""
}) => {
  return (
    <Button
      onClick={onGenerate}
      disabled={disabled}
      variant="default"
      size="lg"
      className={`w-full ${className}`}
    >
      <FileText className="h-5 w-5 mr-2" />
      Generează fișa tratament
    </Button>
  );
};