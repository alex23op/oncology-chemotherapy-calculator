import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface SafeComponentWrapperProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  componentName?: string;
}

export const SafeComponentWrapper = ({ 
  children, 
  fallbackMessage = "This component failed to load",
  componentName = "Component"
}: SafeComponentWrapperProps) => {
  const fallback = (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">{componentName} Error</p>
            <p className="text-sm text-muted-foreground">{fallbackMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};