import { useOverviewMetrics, useDepartmentSummaries } from "../../../hooks/useOverview";
import { useAgents } from "../../../hooks/useAgents";
import { useWebSocket } from "../../../hooks/useWebSocket";

function MetricCard({ label, value, subtext, color = "text-sky-300" }: { label: string; value: string | number; subtext?: string; color?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
      {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
    </div>
  );
}

function DepartmentSummaryCard({ dept }: { dept: { id: string; name: string; icon: string; color: string; agentCount: number; onlineCount: number; activeCards: number; completedToday: number } }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{dept.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100">{dept.name}</h3>
          <p className="text-xs text-slate-400">
            {dept.onlineCount} / {dept.agentCount} agents online
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-slate-500">Active Cards</p>
          <p className="text-slate-200">{dept.activeCards}</p>
        </div>
        <div>
          <p className="text-slate-500">Completed Today</p>
          <p className="text-slate-200">{dept.completedToday}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-700" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-700" />
        ))}
      </div>
    </div>
  );
}

export function OverviewPage() {
  const { data: metrics, isLoading: metricsLoading } = useOverviewMetrics();
  const { data: departments = [], isLoading: deptsLoading } = useDepartmentSummaries();
  const { data: agents = [] } = useAgents();
  const { connected, lastMessage } = useWebSocket({
    onMessage: (msg) => {
      console.log("[Overview] Real-time update:", msg);
      // Could trigger query invalidation here for instant updates
    },
  });

  const isLoading = metricsLoading || deptsLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Mission Control Dashboard</h1>
          <p className="text-sm text-slate-400">Real-time overview of all departments and agents</p>
        </div>
        <div className={`rounded-full border px-3 py-1 text-sm ${connected ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-amber-400/20 bg-amber-400/10 text-amber-200"}`}>
          {connected ? "● Live" : "○ Polling"}
        </div>
      </div>

      {/* Real-time notification */}
      {lastMessage && (
        <div className="rounded border border-sky-500/30 bg-sky-500/10 p-3 text-sm text-sky-200">
          <span className="font-medium">Live Update:</span> {lastMessage.type} - {new Date(lastMessage.timestamp).toLocaleTimeString()}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Agents"
          value={metrics?.totalAgents || 0}
          subtext={`${metrics?.onlineAgents || 0} online, ${metrics?.offlineAgents || 0} offline`}
          color="text-sky-300"
        />
        <MetricCard
          label="Completion Rate"
          value={`${(metrics?.completionRate || 0).toFixed(1)}%`}
          subtext={`${metrics?.completedCardsToday || 0} completed today`}
          color="text-emerald-300"
        />
        <MetricCard
          label="Tasks / Day"
          value={(metrics?.tasksPerDay || 0).toFixed(1)}
          subtext="7-day average"
          color="text-purple-300"
        />
        <MetricCard
          label="Total Cost"
          value={`$${(metrics?.totalCost || 0).toFixed(2)}`}
          subtext={`${(metrics?.totalTokens || 0).toLocaleString()} tokens`}
          color="text-amber-300"
        />
      </div>

      {/* Department Summaries */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Departments</h2>
        {departments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <DepartmentSummaryCard key={dept.id} dept={dept} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-slate-400">
            No department data available
          </div>
        )}
      </div>
    </div>
  );
}
