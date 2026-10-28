import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { STATUSES, type Preferences, type Status } from '../types';

const STORAGE_KEY = 'mytechsearch.preferences';

const DEFAULT_PREFERENCES: Preferences = {
  workspaceName: 'Personal workspace',
  defaultStatus: 'Saved',
  pageSize: 10,
  confirmDelete: true,
  defaultView: 'board',
};

function readPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    const pageSize = Number(parsed.pageSize);
    return {
      workspaceName: parsed.workspaceName?.trim() || DEFAULT_PREFERENCES.workspaceName,
      defaultStatus: isStatus(parsed.defaultStatus) ? parsed.defaultStatus : DEFAULT_PREFERENCES.defaultStatus,
      pageSize: [5, 8, 10, 15].includes(pageSize) ? pageSize : DEFAULT_PREFERENCES.pageSize,
      confirmDelete: typeof parsed.confirmDelete === 'boolean' ? parsed.confirmDelete : true,
      defaultView: parsed.defaultView === 'list' ? 'list' : 'board',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function isStatus(value: unknown): value is Status {
  return STATUSES.includes(value as Status);
}

type SettingsContextValue = {
  preferences: Preferences;
  updatePreferences: (next: Partial<Preferences>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(readPreferences);

  const value = useMemo<SettingsContextValue>(
    () => ({
      preferences,
      updatePreferences(next) {
        setPreferences((current) => {
          const merged: Preferences = {
            ...current,
            ...next,
            workspaceName: (next.workspaceName ?? current.workspaceName).trim() || DEFAULT_PREFERENCES.workspaceName,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      },
    }),
    [preferences],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

