import { useSettings } from '../context/SettingsContext';
import { STATUSES, type BoardView, type Status } from '../types';

export function Settings() {
  const { preferences, updatePreferences } = useSettings();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-ds-text">Settings</h1>
      <p className="mt-1 text-sm text-ds-subtle">
        Browser preferences only. Job records stay in the local SQLite database. No features here pretend to sync, score resumes, or clip jobs from LinkedIn.
      </p>

      <section className="surface mt-5 p-5">
        <h2 className="text-sm font-semibold text-ds-text">Workspace</h2>
        <p className="mb-4 text-xs text-ds-subtle">Stored in this browser with localStorage.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs font-semibold text-ds-subtle">
            Workspace name
            <input
              value={preferences.workspaceName}
              maxLength={40}
              onChange={(event) => updatePreferences({ workspaceName: event.target.value })}
              className="field"
            />
          </label>
          <label className="text-xs font-semibold text-ds-subtle">
            Default stage for new roles
            <select
              value={preferences.defaultStatus}
              onChange={(event) => updatePreferences({ defaultStatus: event.target.value as Status })}
              className="field"
            >
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-ds-subtle">
            Default board view
            <select
              value={preferences.defaultView}
              onChange={(event) => updatePreferences({ defaultView: event.target.value as BoardView })}
              className="field"
            >
              <option value="board">Board (kanban)</option>
              <option value="list">List (spreadsheet)</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-ds-subtle">
            Rows per list page
            <select
              value={preferences.pageSize}
              onChange={(event) => updatePreferences({ pageSize: Number(event.target.value) })}
              className="field"
            >
              {[5, 8, 10, 15].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-2 text-sm text-ds-text md:col-span-2">
            <input
              type="checkbox"
              checked={preferences.confirmDelete}
              onChange={(event) => updatePreferences({ confirmDelete: event.target.checked })}
              className="mt-0.5 h-3.5 w-3.5 rounded-ds border-ds-border"
            />
            <span>
              Confirm before deleting
              <span className="mt-0.5 block text-xs text-ds-subtle">Ask before a card is removed from the pipeline.</span>
            </span>
          </label>
        </div>
      </section>

      <section className="surface mt-4 p-5">
        <h2 className="text-sm font-semibold text-ds-text">Where data lives</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-ds-subtle">
          <li>
            Applications persist in <code className="rounded-ds bg-ds-input px-1 text-xs">backend/applications.db</code>.
          </li>
          <li>Workspace name, default stage, view, page size, and delete confirmation stay in this browser.</li>
          <li>
            Company logos come from{' '}
            <a href="https://loadlogo.com" className="text-ds-brand hover:underline" target="_blank" rel="noreferrer">
              LoadLogo
            </a>{' '}
            by company name. Unknown companies keep a letter mark.
          </li>
          <li>There is no account system, cloud sync, Chrome clipper, or resume scorer.</li>
        </ul>
      </section>
    </div>
  );
}
