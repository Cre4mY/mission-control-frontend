import { useParams } from "react-router-dom";
import { useDepartment, useDepartmentAgents, useDepartmentActivity, useDepartmentCards, Agent, KanbanCard } from "../../../hooks/useAgents";

function StatusBadge({ status }: { status: Agent["status"] }) {
  const colors = {
    online: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    offline: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    busy: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-100">{agent.name}</h3>
          <p className="text-sm text-slate-400">{agent.role}</p>
        </div>
        <StatusBadge status={agent.status} />
      </div>
      <div className="mt-3 space-y-1">
        {agent.model && (
          <p className="text-xs text-slate-500">
            <span className="text-slate-600">Model:</span>{" "}
            <span className="text-slate-300">{agent.model}</span>
          </p>
        )}
        {agent.xp > 0 && (
          <p className="text-xs text-slate-500">
            <span className="text-slate-600">XP:</span>{" "}
            <span className="text-slate-300">{agent.xp}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: { title: string; detail: string; timestamp: string } }) {
  const date = new Date(activity.timestamp);
  const timeAgo = Math.floor((Date.now() - date.getTime()) / 60000);
  const timeLabel = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`;

  return (
    <div className="border-l-2 border-white/10 pl-4 py-2">
      <p className="text-sm font-medium text-slate-200">{activity.title}</p>
      <p className="text-xs text-slate-400 mt-1">{activity.detail}</p>
      <p className="text-xs text-slate-500 mt-2">{timeLabel}</p>
    </div>
  );
}

function KanbanCardItem({ card }: { card: KanbanCard }) {
  const columnColors: Record<string, string> = {
    backlog: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    "in-progress": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    done: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    blocked: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  const priorityColors: Record<string, string> = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-slate-400",
  };

  return (
    <div className="rounded border border-white/10 bg-white/5 p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-200">{card.title}</h4>
        <span className={`rounded px-2 py-0.5 text-xs border ${columnColors[card.column] || columnColors.backlog}`}>
          {card.column}
        </span>
      </div>
      {card.description && (
        <p className="mt-2 text-xs text-slate-400 line-clamp-2">{card.description}</p>
      )}
      <div className="mt-2 flex items-center gap-3 text-xs">
        <span className={priorityColors[card.priority] || priorityColors.low}>
          {card.priority}
        </span>
        <span className="text-slate-500">
          {new Date(card.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded bg-slate-700" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded bg-slate-700" />
        <div className="h-64 animate-pulse rounded bg-slate-700" />
      </div>
    </div>
  );
}

export function DepartmentPage() {
  const { deptId } = useParams<{ deptId: string }>();
  const { data: department, isLoading: deptLoading } = useDepartment(deptId!);
  const { data: agents = [], isLoading: agentsLoading } = useDepartmentAgents(deptId!);
  const { data: activity = [] } = useDepartmentActivity(deptId!, 5);
  const { data: cards = [] } = useDepartmentCards(deptId!, 5);

  const onlineCount = agents.filter((a) => a.status === "online").length;

  if (deptLoading || agentsLoading) {
    return <LoadingState />;
  }

  if (!department) {
    return (
      <div className="card border-red-500/30 bg-red-500/10">
        <h2 className="text-lg font-semibold text-red-300">Department not found</h2>
        <p className="mt-2 text-sm text-red-400">The department "{deptId}" does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="card">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{department.icon}</span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">{department.name}</h1>
            <p className="text-sm text-slate-400">
              {onlineCount} / {agents.length} agents online
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Agents Section */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Agents</h2>
          {agents.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No agents assigned to this department</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Recent Activity</h2>
          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((act) => (
                <ActivityItem key={act.id} activity={act} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No recent activity</p>
          )}
        </div>
      </div>

      {/* Kanban Cards */}
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Recent Kanban Cards</h2>
        {cards.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <KanbanCardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No kanban cards for this department</p>
        )}
      </div>
    </div>
  );
}
