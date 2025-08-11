import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export interface WizardStepInfo {
  id: string;
  title: string;
}

interface WizardContextValue {
  steps: WizardStepInfo[];
  activeStepId: string;
  goTo: (id: string) => void;
  next: () => void;
  prev: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export const useWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
};

export const WizardProvider = ({
  steps,
  initialStepId,
  children,
}: {
  steps: WizardStepInfo[];
  initialStepId: string;
  children: React.ReactNode;
}) => {
  const [activeStepId, setActiveStepId] = useState<string>(initialStepId);
  const orderRef = useRef(steps.map(s => s.id));

  const goTo = useCallback((id: string) => setActiveStepId(id), []);
  const next = useCallback(() => {
    const order = orderRef.current;
    const idx = order.indexOf(activeStepId);
    if (idx >= 0 && idx < order.length - 1) setActiveStepId(order[idx + 1]);
  }, [activeStepId]);
  const prev = useCallback(() => {
    const order = orderRef.current;
    const idx = order.indexOf(activeStepId);
    if (idx > 0) setActiveStepId(order[idx - 1]);
  }, [activeStepId]);

  const value = useMemo(() => ({ steps, activeStepId, goTo, next, prev }), [steps, activeStepId, goTo, next, prev]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};
