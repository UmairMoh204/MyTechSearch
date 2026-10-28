import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createApplication, deleteApplication, listApplications, updateApplication } from '../api';
import type { JobApplication, JobApplicationInput, Status } from '../types';

type Toast = { kind: 'success' | 'error'; message: string };

type ApplicationsContextValue = {
  items: JobApplication[];
  loading: boolean;
  toast: Toast | null;
  setToast: (toast: Toast | null) => void;
  reload: () => Promise<void>;
  save: (input: JobApplicationInput, id?: number) => Promise<void>;
  remove: (application: JobApplication) => Promise<void>;
  changeStatus: (application: JobApplication, status: Status) => Promise<void>;
};

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  const reload = useCallback(async () => {
    try {
      setItems(await listApplications());
    } catch (error) {
      setToast({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Could not load applications',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo<ApplicationsContextValue>(
    () => ({
      items,
      loading,
      toast,
      setToast,
      reload,
      async save(input, id) {
        if (id == null) {
          await createApplication(input);
          setToast({ kind: 'success', message: 'Application added.' });
        } else {
          await updateApplication(id, input);
          setToast({ kind: 'success', message: 'Application updated.' });
        }
        await reload();
      },
      async remove(application) {
        try {
          await deleteApplication(application.id);
          setToast({ kind: 'success', message: `Deleted ${application.company}.` });
          await reload();
        } catch (error) {
          setToast({
            kind: 'error',
            message: error instanceof Error ? error.message : 'Could not delete application',
          });
        }
      },
      async changeStatus(application, status) {
        try {
          await updateApplication(application.id, {
            company: application.company,
            position: application.position,
            status,
            appliedDate: application.appliedDate,
            notes: application.notes,
          });
          setToast({ kind: 'success', message: 'Status updated.' });
          await reload();
        } catch (error) {
          setToast({
            kind: 'error',
            message: error instanceof Error ? error.message : 'Could not update status',
          });
        }
      },
    }),
    [items, loading, reload, toast],
  );

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationsProvider');
  }
  return context;
}
