import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSmartNav } from "@/context/SmartNavContext";
import { useWizard } from "./WizardProvider";

export const WizardStep = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
  const { activeStepId } = useWizard();
  const open = activeStepId === id;
  return (
    <Accordion type="single" collapsible value={open ? id : ""} className="w-full">
      <AccordionItem value={id}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <div className="animate-fade-in">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
