import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

export class ClinicalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log clinical errors with context
    const context = this.props.context || 'Unknown Component';
    console.error(`🏥 Clinical Error in ${context}:`, error, errorInfo);
    
    // Notify clinical team of critical errors
    if (this.isCriticalError(error)) {
      toast({
        variant: "destructive",
        title: "Critical Clinical Error",
        description: `A critical error occurred in ${context}. Please reload and report this issue.`
      });
    }
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  isCriticalError = (error: Error): boolean => {
    const criticalKeywords = [
      'dose', 'calculation', 'drug', 'regimen', 'patient', 
      'safety', 'protocol', 'treatment', 'biomarker'
    ];
    
    const errorMessage = error.message.toLowerCase();
    return criticalKeywords.some(keyword => errorMessage.includes(keyword));
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const context = this.props.context || 'Clinical Component';
      const isCritical = this.state.error ? this.isCriticalError(this.state.error) : false;
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className={`border-2 ${isCritical ? 'border-destructive' : 'border-warning'}`}>
          <CardHeader>
            <Alert className={isCritical ? 'border-destructive bg-destructive/10' : 'border-warning bg-warning/10'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {isCritical ? '🚨 Critical Clinical Error' : '⚠️ Component Error'}
                <span className="text-sm font-normal">in {context}</span>
              </AlertTitle>
              <AlertDescription className="mt-2">
                {isCritical ? (
                  <div>
                    <p className="font-medium text-destructive">
                      A critical error occurred that could affect clinical calculations or safety.
                    </p>
                    <p className="mt-1">
                      Please reload the application and report this issue immediately.
                    </p>
                  </div>
                ) : (
                  <p>This component encountered an error and couldn't load properly.</p>
                )}
              </AlertDescription>
            </Alert>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again ({this.state.retryCount}/3)
              </Button>
              
              {isCritical && (
                <Button 
                  onClick={this.handleReload}
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload App
                </Button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Developer Information
                </summary>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 overflow-auto text-destructive">
                        {this.state.error?.message}
                      </pre>
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 overflow-auto text-muted-foreground">
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 overflow-auto text-muted-foreground">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with clinical error boundary
export const withClinicalErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  context?: string
) => {
  const WrappedComponent = (props: P) => (
    <ClinicalErrorBoundary context={context}>
      <Component {...props} />
    </ClinicalErrorBoundary>
  );
  
  WrappedComponent.displayName = `withClinicalErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};