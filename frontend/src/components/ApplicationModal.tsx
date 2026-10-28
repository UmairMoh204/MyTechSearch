import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { todayIso } from '../lib/format';
import { STATUSES, type JobApplication, type JobApplicationInput, type Status } from '../types';

type ApplicationModalProps = {
  application?: JobApplication | null;
  defaultStatus: Status;
  saving: boolean;
  onClose: () => void;
  onSave: (input: JobApplicationInput) => Promise<void>;
};

export function ApplicationModal({ application, defaultStatus, saving, onClose, onSave }: ApplicationModalProps) {
  const titleId = useId();
  const companyRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<JobApplicationInput>({
    company: application?.company ?? '',
    position: application?.position ?? '',
    status: application?.status ?? defaultStatus,
    appliedDate: application?.appliedDate ?? todayIso(),
    notes: application?.notes ?? '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    companyRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await onSave({
        ...form,
        company: form.company.trim(),
        position: form.position.trim(),
        notes: form.notes.trim(),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save application');
    }
  }

  const editing = Boolean(application);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-start sm:pt-16">
      <button type="button" className="absolute inset-0 bg-[#091E427A]" aria-label="Close form" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-xl rounded-t-ds-lg border border-ds-border bg-white shadow-overlay sm:rounded-ds-lg"
      >
        <div className="flex items-start justify-between border-b border-ds-border px-5 py-3">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-ds-text">
              {editing ? 'Edit application' : 'Add application'}
            </h2>
            <p className="mt-0.5 text-xs text-ds-subtle">Company, role, pipeline stage, date, and notes.</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-subtle h-8 w-8 px-0" aria-label="Close form">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4">
          {error && (
            <p role="alert" className="mb-3 rounded-ds border-l-4 border-ds-danger bg-ds-danger-bolder px-3 py-2 text-sm text-ds-danger">
              {error}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-ds-subtle">
              Company name
              <input
                ref={companyRef}
                required
                maxLength={120}
                value={form.company}
                placeholder="Microsoft"
                onChange={(event) => setForm({ ...form, company: event.target.value })}
                className="field"
              />
            </label>
            <label className="text-xs font-semibold text-ds-subtle">
              Position
              <input
                required
                maxLength={160}
                value={form.position}
                placeholder="Software Engineer"
                onChange={(event) => setForm({ ...form, position: event.target.value })}
                className="field"
              />
            </label>
            <label className="text-xs font-semibold text-ds-subtle">
              Stage
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as Status })}
                className="field"
              >
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-ds-subtle">
              Date
              <input
                type="date"
                required
                value={form.appliedDate}
                onChange={(event) => setForm({ ...form, appliedDate: event.target.value })}
                className="field"
              />
            </label>
            <label className="text-xs font-semibold text-ds-subtle sm:col-span-2">
              Notes
              <textarea
                rows={4}
                maxLength={2000}
                value={form.notes}
                placeholder="Recruiter, next step, interview notes..."
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                className="field h-auto py-2"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-default">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Save application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
