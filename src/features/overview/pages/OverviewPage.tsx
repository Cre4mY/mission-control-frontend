export function OverviewPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card lg:col-span-2">
        <p className="text-sm uppercase tracking-[0.28em] text-sky-300/70">
          Overview
        </p>
        <h3 className="mt-3 text-3xl font-semibold">Mission Control dashboard</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          This foundation ships the app shell and routing surface for activity
          and department views. Data hooks can be layered on top of the shared
          API client and TanStack Query provider.
        </p>
      </div>

      <div className="card">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
          Stack
        </p>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>Vite + React + TypeScript</li>
          <li>Tailwind CSS</li>
          <li>TanStack Query</li>
          <li>React Router v6</li>
        </ul>
      </div>
    </div>
  );
}

