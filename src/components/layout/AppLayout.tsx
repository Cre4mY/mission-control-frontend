import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/", label: "Overview" },
  { to: "/activity", label: "Activity" },
  { to: "/departments/engineering", label: "Departments" },
];

const externalLinks = [
  {
    href: "http://localhost:3000/kanban",
    label: "Engineering Kanban",
  },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950/90 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
        <aside className="card flex w-full max-w-xs flex-col justify-between self-stretch">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">
                Mission Control
              </p>
              <h1 className="mt-2 text-2xl font-semibold">Frontend</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Phase 1 foundation with routing, layout, query provider, and a
                reusable API client.
              </p>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                  }
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-slate-400">/</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              External
            </p>
            {externalLinks.map((item) => (
              <a
                key={item.href}
                className="sidebar-link"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{item.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col">
          <header className="card mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Workspace</p>
              <h2 className="text-lg font-medium">Mission Control</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
              API ready
            </div>
          </header>

          <section className="flex-1">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}

