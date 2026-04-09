import { useAgents, useDepartments, Agent, Department } from "../../../hooks/useAgents";

const OLLAMA_SLOTS = [
  { slot: "Slot 1", model: "qwen3.5:397b-cloud", color: "bg-blue-500/20 border-blue-500/30" },
  { slot: "Slot 2", model: "glm-5.1:cloud", color: "bg-purple-500/20 border-purple-500/30" },
  { slot: "Slot 3", model: "gemma4:31b-cloud", color: "bg-orange-500/20 border-orange-500/30" },
];

const CODEX_MODEL = "Codex 5.4";

function getModelSlot(model?: string): string | undefined {
  if (!model) return undefined;
  if (model.includes("qwen3.5")) return "Slot 1";
  if (model.includes("glm-5") || model.includes("glm5")) return "Slot 2";
  if (model.includes("gemma4") || model.includes("gemma-4")) return "Slot 3";
  if (model.includes("codex") || model.includes("Codex")) return undefined; // Codex is separate
  return undefined;
}

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
  const slot = getModelSlot(agent.model);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
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
        {slot && (
          <p className="text-xs text-slate-500">
            <span className="text-slate-600">Slot:</span>{" "}
            <span className="text-slate-300">{slot}</span>
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

function DepartmentSection({ 
  dept, 
  agents 
}: { 
  dept: Department; 
  agents: Agent[];
}) {
  const deptAgents = agents.filter((a) => a.departmentId === dept.id);
  const onlineCount = deptAgents.filter((a) => a.status === "online").length;

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{dept.icon}</span>
        <div>
          <h2 className="text-xl font-semibold text-slate-100">{dept.name}</h2>
          <p className="text-sm text-slate-400">
            {onlineCount} / {deptAgents.length} online
          </p>
        </div>
      </div>
      {deptAgents.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {deptAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic">No agents assigned to this department</p>
      )}
    </div>
  );
}

function OllamaSlotsOverview({ agents }: { agents: Agent[] }) {
  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Ollama Cloud Slots</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {OLLAMA_SLOTS.map((slot) => {
          const slotAgents = agents.filter((a) => getModelSlot(a.model) === slot.slot);
          return (
            <div key={slot.slot} className={`rounded-lg border p-4 ${slot.color}`}>
              <h3 className="font-semibold text-slate-100">{slot.slot}</h3>
              <p className="mb-3 text-sm text-slate-400">{slot.model}</p>
              <div className="flex flex-wrap gap-1">
                {slotAgents.map((agent) => (
                  <span
                    key={agent.id}
                    className="rounded bg-black/20 px-2 py-0.5 text-xs text-slate-300"
                  >
                    {agent.name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {slotAgents.length} agents
              </p>
            </div>
          );
        })}
        {/* Codex 5.4 slot */}
        <div className="rounded-lg border border-slate-500/30 bg-slate-500/20 p-4">
          <h3 className="font-semibold text-slate-100">Codex 5.4</h3>
          <p className="mb-3 text-sm text-slate-400">OpenAI</p>
          <div className="flex flex-wrap gap-1">
            {agents.filter((a) => a.model?.includes("Codex") || a.model?.includes("codex")).map((agent) => (
              <span
                key={agent.id}
                className="rounded bg-black/20 px-2 py-0.5 text-xs text-slate-300"
              >
                {agent.name}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {agents.filter((a) => a.model?.includes("Codex") || a.model?.includes("codex")).length} agents
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-700" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-700" />
      </div>
      <div className="card">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-700" />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="card border-red-500/30 bg-red-500/10">
      <h2 className="text-lg font-semibold text-red-300">Failed to load agents</h2>
      <p className="mt-2 text-sm text-red-400">{error.message}</p>
      <p className="mt-4 text-xs text-slate-500">
        Make sure the Mission Control API is running on port 3000
      </p>
    </div>
  );
}

export function AgentsPage() {
  const { data: agents = [], isLoading: agentsLoading, error: agentsError } = useAgents();
  const { data: departments = [], isLoading: deptsLoading } = useDepartments();

  const onlineCount = agents.filter((a) => a.status === "online").length;

  if (agentsLoading || deptsLoading) {
    return <LoadingState />;
  }

  if (agentsError) {
    return <ErrorState error={agentsError as Error} />;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-semibold text-slate-100">Agent Roster</h1>
        <p className="mt-2 text-slate-400">
          {onlineCount} / {agents.length} agents online across {departments.length} departments
        </p>
      </div>

      <OllamaSlotsOverview agents={agents} />

      <div className="space-y-6">
        {departments.map((dept) => (
          <DepartmentSection key={dept.id} dept={dept} agents={agents} />
        ))}
      </div>
    </div>
  );
}
