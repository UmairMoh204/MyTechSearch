import { Briefcase, Pencil, Trash2 } from 'lucide-react';
import { daysAgo, formatDate } from '../lib/format';
import { CompanyLogo } from './CompanyLogo';
import { LOZENGE, StatusBadge } from './StatusBadge';
import { STATUSES, type JobApplication, type Status } from '../types';

type ApplicationTableProps = {
  items: JobApplication[];
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: { label: string; onClick: () => void };
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
  onStatusChange?: (application: JobApplication, status: Status) => void;
};

export function ApplicationTable({
  items,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationTableProps) {
  if (items.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-ds bg-ds-input text-ds-subtle">
          <Briefcase className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-ds-text">{emptyTitle}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-ds-subtle">{emptyDescription}</p>
        {emptyAction && (
          <button type="button" onClick={emptyAction.onClick} className="btn btn-primary mt-4">
            {emptyAction.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="border-b border-ds-border bg-ds-canvas text-[11px] font-bold uppercase tracking-wide text-ds-subtlest">
          <tr>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Stage</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Notes</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((application) => (
            <tr key={application.id} className="border-b border-ds-border last:border-0 hover:bg-ds-canvas">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <CompanyLogo company={application.company} size={28} />
                  <div>
                    <p className="text-sm font-semibold text-ds-text">{application.position}</p>
                    <p className="text-xs text-ds-subtle">{application.company}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {onStatusChange ? (
                  <select
                    aria-label={`Status for ${application.company}`}
                    value={application.status}
                    onChange={(event) => onStatusChange(application, event.target.value as Status)}
                    className={`h-6 rounded-ds border-0 px-1.5 text-[11px] font-bold uppercase ${LOZENGE[application.status]}`}
                  >
                    {STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={application.status} />
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-ds-subtle" title={formatDate(application.appliedDate)}>
                {daysAgo(application.appliedDate)}
              </td>
              <td className="max-w-[220px] truncate px-4 py-3 text-sm text-ds-subtle" title={application.notes}>
                {application.notes || '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => onEdit(application)} className="btn btn-subtle h-7 px-2 text-ds-brand">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(application)} className="btn h-7 px-2 text-ds-danger hover:bg-ds-danger-bolder">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
