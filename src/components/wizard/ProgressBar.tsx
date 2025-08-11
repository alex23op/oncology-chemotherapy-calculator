import { useWizard } from "./WizardProvider";

export const ProgressBar = () => {
  const { steps, activeStepId, goTo } = useWizard();
  return (
    <nav aria-label="progress" className="mb-4">
      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {steps.map((s, i) => {
          const state = activeStepId === s.id ? "active" : (steps.findIndex(x => x.id === activeStepId) > i ? "done" : "pending");
          return (
            <li key={s.id}>
              <button
                onClick={() => goTo(s.id)}
                className={`w-full text-left px-3 py-2 rounded border transition ${state === 'active' ? 'bg-primary text-primary-foreground border-primary' : state === 'done' ? 'bg-muted/50 border-muted' : 'bg-background border-muted'} hover-scale`}
              >
                <span className="text-sm font-medium">{i + 1}. {s.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
