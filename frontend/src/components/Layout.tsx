import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Briefcase, LayoutDashboard, Menu, Settings, X } from 'lucide-react';
import { Toast } from './Toast';
import { useApplications } from '../context/ApplicationsContext';
import { useSettings } from '../context/SettingsContext';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/applications', label: 'Board', icon: Briefcase, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export function Layout() {
  const { items, toast, setToast } = useApplications();
  const { preferences } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title =
    location.pathname.startsWith('/applications')
      ? 'Board'
      : location.pathname.startsWith('/settings')
        ? 'Settings'
        : 'Dashboard';

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F7F8F9]">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`flex h-full w-[240px] shrink-0 flex-col bg-[#1D2125] text-white max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:transition-transform ${
          mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-7 w-7" />
            <div>
              <p className="text-sm font-semibold leading-tight">MyTechSearch</p>
              <p className="text-[11px] leading-tight text-white/60">Job search pipeline</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-[3px] p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex h-8 items-center gap-2 rounded-[3px] px-2 text-sm ${
                  isActive ? 'bg-white/15 font-medium text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.to === '/applications' && (
                <span className="ml-auto rounded-[3px] bg-white/10 px-1.5 text-[11px] text-white/80">{items.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 px-4 py-3">
          <p className="text-sm font-medium">{preferences.workspaceName}</p>
          <p className="text-xs text-white/50">Local workspace</p>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-[rgba(9,30,66,0.14)] bg-white px-4">
          <div className="flex items-center gap-2 text-sm text-[#44546F]">
            <button
              type="button"
              className="rounded-[3px] p-1.5 text-[#172B4D] hover:bg-[#F1F2F4] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden sm:inline">MyTechSearch</span>
            <span className="hidden text-[#DFE1E6] sm:inline">/</span>
            <span className="font-medium text-[#172B4D]">{title}</span>
          </div>
          <span className="text-xs text-[#626F86]">Local · no account</span>
        </header>

        <main className="min-h-0 flex-1 overflow-auto p-4">
          {toast && <Toast kind={toast.kind} message={toast.message} onDismiss={() => setToast(null)} />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
