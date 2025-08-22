import React from 'react';
import { useTSafe } from '@/i18n/tSafe';
import { cn } from '@/lib/utils';

interface TranslatedTextProps {
  k: string;
  fallback?: string;
  className?: string;
  children?: never; // Prevent accidental children
  options?: Record<string, any>; // For interpolation
}

/**
 * UI guard component for translated text that ensures no raw i18n keys are displayed
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
  k,
  fallback,
  className,
  options
}) => {
  const tSafe = useTSafe();
  
  const text = tSafe(k, fallback, options);
  
  return (
    <span className={cn(className)}>
      {text}
    </span>
  );
};

export default TranslatedText;