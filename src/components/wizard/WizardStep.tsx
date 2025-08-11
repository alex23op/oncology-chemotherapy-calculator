import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSmartNav } from "@/context/SmartNavContext";
import { useWizard } from "./WizardProvider";
import { useEffect, useRef } from "react";

export const WizardStep = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
  const { activeStepId } = useWizard();
  const { autoCollapseEnabled, autoJumpEnabled } = useSmartNav();
  const open = autoCollapseEnabled ? activeStepId === id : true;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Smooth scroll to the step and focus first focusable element
      contentRef.current?.parentElement?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (autoJumpEnabled) {
        const timer = setTimeout(() => {
          const focusable = contentRef.current?.querySelector<HTMLElement>(
            'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
          );
          focusable?.focus();
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [open, autoJumpEnabled]);

  return (
    <Accordion type="single" collapsible value={open ? id : ""} className="w-full">
      <AccordionItem value={id}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <span className="sr-only" aria-live="polite">{open ? `${title} expanded` : `${title} collapsed`}</span>
          <div ref={contentRef} className="animate-fade-in">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
