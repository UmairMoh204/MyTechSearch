import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';
import { ApplicationTable } from '../components/ApplicationTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useApplications } from '../context/ApplicationsContext';
import { useSettings } from '../context/SettingsContext';
import { STATUSES, type JobApplication } from '../types';

export function Dashboard() {
  const { items, loading, save, remove } = useApplications();
  const { preferences } = useSettings();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);
  const [saving, setSaving] = useState(false);

  const counts = useMemo(() => {
    const byStatus = Object.fromEntries(STATUSES.map((status) => [status, items.filter((item) => item.status === status).length])) as Record<
      (typeof STATUSES)[number],
      number
    >;
    const submitted = items.filter((item) => item.status !== 'Saved').length;
    const interviews = byStatus.Interview + byStatus.Offer;
    return {
      ...byStatus,
      total: items.length,
      submitted,
      interviewRate: percent(interviews, submitted),
      offerRate: percent(byStatus.Offer, submitted),
    };
  }, [items]);

  const recent = items.slice(0, 6);

  async function handleSave(input: Parameters<typeof save>[0]) {
    setSaving(true);
    try {
      await save(input, editing?.id);
      setShowForm(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  function requestDelete(application: JobApplication) {
    if (preferences.confirmDelete) {
      setPendingDelete(application);
      return;
    }
    void remove(application);
  }

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ds-text">Dashboard</h1>
          <p className="mt-1 text-sm text-ds-subtle">Your job search as a pipeline — the same structure Huntr, Teal, and Jira use for work in motion.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary self-start"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add application
        </button>
      </div>

      <ol className="mb-5 grid gap-2 sm:grid-cols-5">
        {STATUSES.map((status, index) => (
          <li key={status} className="surface relative px-3 py-3">
            {index < STATUSES.length - 1 && (
              <span className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-ds-border bg-white sm:block" />
            )}
            <p className="text-[11px] font-bold uppercase tracking-wide text-ds-subtlest">{status}</p>
            <p className="mt-1 text-2xl font-bold text-ds-text">{counts[status]}</p>
          </li>
        ))}
      </ol>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <article className="surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ds-subtlest">Tracked</p>
          <p className="mt-1 text-2xl font-bold">{counts.total}</p>
          <p className="text-xs text-ds-subtle">Roles on the board</p>
        </article>
        <article className="surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ds-subtlest">Interview conversion</p>
          <p className="mt-1 text-2xl font-bold">{counts.interviewRate}</p>
          <p className="text-xs text-ds-subtle">Interviews + offers / submitted</p>
        </article>
        <article className="surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ds-subtlest">Offer conversion</p>
          <p className="mt-1 text-2xl font-bold">{counts.offerRate}</p>
          <p className="text-xs text-ds-subtle">Offers / submitted applications</p>
        </article>
      </div>

      <section className="surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-ds-border px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-ds-text">Recently updated</h2>
            <p className="text-xs text-ds-subtle">Newest roles first. Open the board to move cards through stages.</p>
          </div>
          <Link to="/applications" className="text-sm font-medium text-ds-brand hover:underline">
            Open board
          </Link>
        </div>
        {loading ? (
          <p className="px-4 py-12 text-center text-sm text-ds-subtle">Loading applications…</p>
        ) : (
          <ApplicationTable
            items={recent}
            emptyTitle="No roles on the board yet"
            emptyDescription="Save a job you want to apply to, then drag it from Saved to Applied when you submit."
            emptyAction={{
              label: 'Add application',
              onClick: () => {
                setEditing(null);
                setShowForm(true);
              },
            }}
            onEdit={(application) => {
              setEditing(application);
              setShowForm(true);
            }}
            onDelete={requestDelete}
          />
        )}
      </section>

      {showForm && (
        <ApplicationModal
          application={editing}
          defaultStatus={preferences.defaultStatus}
          saving={saving}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Delete application"
          description={`Delete the application for ${pendingDelete.company}? This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            void remove(pendingDelete);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}

function percent(part: number, whole: number) {
  if (whole === 0) {
    return '—';
  }
  return `${Math.round((part / whole) * 100)}%`;
}
