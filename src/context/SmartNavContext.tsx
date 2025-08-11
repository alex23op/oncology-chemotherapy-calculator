import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface SmartNavSettingsState {
  autoCollapseEnabled: boolean;
  autoJumpEnabled: boolean;
  calendarFirst: boolean;
  setAutoCollapseEnabled: (v: boolean) => void;
  setAutoJumpEnabled: (v: boolean) => void;
  setCalendarFirst: (v: boolean) => void;
}

const STORAGE_KEY = "smartNavSettings";

const defaultState: SmartNavSettingsState = {
  autoCollapseEnabled: true,
  autoJumpEnabled: true,
  calendarFirst: false,
  setAutoCollapseEnabled: () => {},
  setAutoJumpEnabled: () => {},
  setCalendarFirst: () => {},
};

const SmartNavContext = createContext<SmartNavSettingsState>(defaultState);

export const SmartNavProvider = ({ children }: { children: React.ReactNode }) => {
  const [autoCollapseEnabled, setAutoCollapseEnabled] = useState(true);
  const [autoJumpEnabled, setAutoJumpEnabled] = useState(true);
  const [calendarFirst, setCalendarFirst] = useState(false);

  // load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.autoCollapseEnabled === 'boolean') setAutoCollapseEnabled(parsed.autoCollapseEnabled);
        if (typeof parsed.autoJumpEnabled === 'boolean') setAutoJumpEnabled(parsed.autoJumpEnabled);
        if (typeof parsed.calendarFirst === 'boolean') setCalendarFirst(parsed.calendarFirst);
      }
    } catch {}
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ autoCollapseEnabled, autoJumpEnabled, calendarFirst })
      );
    } catch {}
  }, [autoCollapseEnabled, autoJumpEnabled, calendarFirst]);

  const value = useMemo(
    () => ({
      autoCollapseEnabled,
      autoJumpEnabled,
      calendarFirst,
      setAutoCollapseEnabled,
      setAutoJumpEnabled,
      setCalendarFirst,
    }),
    [autoCollapseEnabled, autoJumpEnabled, calendarFirst]
  );

  return <SmartNavContext.Provider value={value}>{children}</SmartNavContext.Provider>;
};

export const useSmartNav = () => useContext(SmartNavContext);
