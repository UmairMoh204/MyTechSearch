import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { daysAgo } from '../lib/format';
import { CompanyLogo } from './CompanyLogo';
import { STATUSES, type JobApplication, type Status } from '../types';

type PipelineBoardProps = {
  items: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
  onStatusChange: (application: JobApplication, status: Status) => void;
};

export function PipelineBoard({ items, onEdit, onDelete, onStatusChange }: PipelineBoardProps) {
  const [over, setOver] = useState<Status | null>(null);

  return (
    <div className="grid h-full min-h-[24rem] w-full min-w-0 grid-cols-[repeat(5,minmax(13rem,1fr))] gap-3 overflow-auto">
      {STATUSES.map((status) => {
        const column = items.filter((item) => item.status === status);
        return (
          <section
            key={status}
            onDragOver={(event) => {
              event.preventDefault();
              setOver(status);
            }}
            onDragLeave={() => setOver((current) => (current === status ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              setOver(null);
              const id = Number(event.dataTransfer.getData('text/plain'));
              const application = items.find((item) => item.id === id);
              if (application && application.status !== status) {
                onStatusChange(application, status);
              }
            }}
            className={`flex min-h-0 min-w-0 flex-col rounded-lg border p-2 ${
              over === status ? 'border-[#0C66E4] bg-[#E9F2FF]' : 'border-[rgba(9,30,66,0.14)] bg-[#F1F2F4]'
            }`}
          >
            <header className="mb-2 flex items-center justify-between px-1 py-1">
              <h2 className="text-xs font-bold uppercase tracking-wide text-[#44546F]">{status}</h2>
              <span className="rounded-[3px] bg-white px-1.5 text-xs font-semibold text-[#44546F]">{column.length}</span>
            </header>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
              {column.map((application) => (
                <article
                  key={application.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', String(application.id));
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  className="cursor-grab rounded-[3px] border border-[rgba(9,30,66,0.14)] bg-white p-3 active:cursor-grabbing"
                >
                  <div className="flex items-start gap-2">
                    <CompanyLogo company={application.company} size={28} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#172B4D]">{application.position}</p>
                      <p className="truncate text-xs text-[#44546F]">{application.company}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#626F86]">{daysAgo(application.appliedDate)}</p>
                  {application.notes && (
                    <p className="mt-1 line-clamp-2 text-xs text-[#44546F]" title={application.notes}>
                      {application.notes}
                    </p>
                  )}
                  <div className="mt-2 flex justify-end gap-1">
                    <button type="button" className="btn btn-subtle h-7 px-2" onClick={() => onEdit(application)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn h-7 px-2 text-[#C9372C] hover:bg-[#FFECEB]"
                      onClick={() => onDelete(application)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              ))}
              {column.length === 0 && (
                <p className="px-2 py-6 text-center text-xs text-[#626F86]">Drop a role here</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
