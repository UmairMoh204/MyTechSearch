import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-[#091E427A]" aria-label="Close dialog" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="relative w-full max-w-md rounded-ds-lg border border-ds-border bg-white p-5 shadow-overlay"
      >
        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-ds bg-ds-danger-bolder text-ds-danger">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <h2 id="confirm-title" className="text-base font-semibold text-ds-text">
          {title}
        </h2>
        <p id="confirm-description" className="mt-1 text-sm text-ds-subtle">
          {description}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn btn-default">
            Cancel
          </button>
          <button ref={confirmRef} type="button" onClick={onConfirm} className="btn btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
