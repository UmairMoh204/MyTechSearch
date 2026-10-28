import { CheckCircle2, CircleAlert, X } from 'lucide-react';

type ToastProps = {
  kind: 'success' | 'error';
  message: string;
  onDismiss: () => void;
};

export function Toast({ kind, message, onDismiss }: ToastProps) {
  const isError = kind === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`mb-4 flex items-start justify-between gap-3 rounded-ds border border-ds-border border-l-4 bg-white px-3 py-2.5 text-sm ${
        isError ? 'border-l-ds-danger' : 'border-l-ds-success'
      }`}
    >
      <div className="flex items-start gap-2 text-ds-text">
        {isError ? <CircleAlert className="mt-0.5 h-4 w-4 text-ds-danger" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 text-ds-success" />}
        <p>{message}</p>
      </div>
      <button type="button" onClick={onDismiss} className="btn btn-subtle h-7 w-7 px-0" aria-label="Dismiss notification">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
