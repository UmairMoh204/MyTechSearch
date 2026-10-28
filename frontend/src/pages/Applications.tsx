import { useMemo, useState } from 'react';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';
import { ApplicationTable } from '../components/ApplicationTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PipelineBoard } from '../components/PipelineBoard';
import { useApplications } from '../context/ApplicationsContext';
import { useSettings } from '../context/SettingsContext';
import { STATUSES, type BoardView, type JobApplication, type Status } from '../types';

export function Applications() {
  const { items, loading, save, remove, changeStatus } = useApplications();
  const { preferences, updatePreferences } = useSettings();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);
  const [saving, setSaving] = useState(false);
  const view = preferences.defaultView;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const haystack = `${item.company} ${item.position} ${item.notes}`.toLowerCase();
      return matchesStatus && haystack.includes(query);
    });
  }, [items, search, statusFilter]);

  const pageSize = preferences.pageSize;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  function setView(next: BoardView) {
    updatePreferences({ defaultView: next });
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ds-text">Board</h1>
          <p className="mt-1 text-sm text-ds-subtle">
            Drag cards across Saved → Applied → Interview → Offer. Use list view when you need a spreadsheet scan.
          </p>
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

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search applications</span>
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-ds-subtlest" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search company, position, or notes"
            className="field pl-8"
          />
        </label>
        {view === 'list' && (
          <label className="sm:w-40">
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as 'All' | Status);
                setPage(1);
              }}
              className="field"
            >
              <option value="All">All stages</option>
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        )}
        <div className="flex rounded-ds border border-ds-border bg-white p-0.5">
          <button
            type="button"
            onClick={() => setView('board')}
            className={`btn h-7 ${view === 'board' ? 'bg-ds-input' : 'btn-subtle'}`}
            aria-pressed={view === 'board'}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Board
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`btn h-7 ${view === 'list' ? 'bg-ds-input' : 'btn-subtle'}`}
            aria-pressed={view === 'list'}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-ds-subtle">Loading applications…</p>
      ) : view === 'board' ? (
        filtered.length === 0 && items.length === 0 ? (
          <div className="surface px-6 py-16 text-center">
            <h3 className="text-sm font-semibold text-ds-text">Start with a saved job</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-ds-subtle">
              Bookmark a role in Saved, then drag it to Applied after you submit. That is the Huntr/Teal pipeline, kept local.
            </p>
            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              Add application
            </button>
          </div>
        ) : (
          <div className="min-h-0 min-w-0 w-full flex-1">
            <PipelineBoard
              items={filtered}
              onEdit={(application) => {
                setEditing(application);
                setShowForm(true);
              }}
              onDelete={requestDelete}
              onStatusChange={(application, status) => void changeStatus(application, status)}
            />
          </div>
        )
      ) : (
        <section className="surface overflow-hidden">
          <ApplicationTable
            items={visible}
            emptyTitle={items.length === 0 ? 'No applications yet' : 'No matching applications'}
            emptyDescription={
              items.length === 0
                ? 'Add a company, position, stage, and date to start your tracker.'
                : 'Try a different search or stage filter.'
            }
            emptyAction={
              items.length === 0
                ? {
                    label: 'Add application',
                    onClick: () => {
                      setEditing(null);
                      setShowForm(true);
                    },
                  }
                : undefined
            }
            onEdit={(application) => {
              setEditing(application);
              setShowForm(true);
            }}
            onDelete={requestDelete}
            onStatusChange={(application, status) => void changeStatus(application, status)}
          />
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-ds-border px-4 py-3 text-sm text-ds-subtle">
              <p>
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn btn-default" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}>
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}

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
