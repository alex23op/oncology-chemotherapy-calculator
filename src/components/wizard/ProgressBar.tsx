import { useWizard } from "./WizardProvider";

export const ProgressBar = () => {
  const { steps, activeStepId, goTo } = useWizard();
  return (
    <nav aria-label="progress" className="mb-4">
      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {steps.map((s, i) => {
          const currentIndex = steps.findIndex(x => x.id === activeStepId);
          const state = activeStepId === s.id ? "active" : (currentIndex > i ? "done" : "pending");
          return (
            <li key={s.id}>
              <button
                onClick={() => goTo(s.id)}
                aria-current={state === 'active' ? 'step' : undefined}
                className={`w-full text-left px-3 py-2 rounded border transition ${state === 'active' ? 'bg-primary text-primary-foreground border-primary' : state === 'done' ? 'bg-muted/50 border-muted' : 'bg-background border-muted'} hover-scale`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full border ${state === 'active' ? 'bg-primary-foreground text-primary' : state === 'done' ? 'bg-success/10 text-success border-success/30' : 'bg-muted text-muted-foreground border-muted'}`} aria-hidden>
                    {state === 'done' ? '✓' : i + 1}
                  </span>
                  <span>{i + 1}. {s.title}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
