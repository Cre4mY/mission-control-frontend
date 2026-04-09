import { useEffect, useState } from "react";

interface Agent {
  name: string;
  role: string;
  department: string;
  model: string;
  slot?: string;
  status: "online" | "offline" | "busy";
}

interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  agents: Agent[];
}

const DEPARTMENTS: Department[] = [
  {
    id: "dept-engineering",
    name: "Engineering",
    icon: "🛠️",
    color: "#3b82f6",
    agents: [
      { name: "Kevin", role: "Implementation", department: "Engineering", model: "Codex 5.4", status: "online" },
      { name: "Lasse", role: "Architecture", department: "Engineering", model: "qwen3.5:397b-cloud", slot: "Slot 1", status: "online" },
      { name: "Michael", role: "Research", department: "Engineering", model: "glm-5.1:cloud", slot: "Slot 2", status: "online" },
      { name: "Miles", role: "Review", department: "Engineering", model: "gemma4:31b-cloud", slot: "Slot 3", status: "offline" },
      { name: "Felix", role: "Debugging", department: "Engineering", model: "qwen3.5:397b-cloud", slot: "Slot 1", status: "offline" },
      { name: "Tessa", role: "Testing", department: "Engineering", model: "Codex 5.4", status: "offline" },
      { name: "Duncan", role: "Docs", department: "Engineering", model: "gemma4:31b-cloud", slot: "Slot 3", status: "offline" },
      { name: "Penny", role: "Planning", department: "Engineering", model: "glm-5.1:cloud", slot: "Slot 2", status: "offline" },
    ],
  },
  {
    id: "dept-intelligence",
    name: "Intelligence",
    icon: "📡",
    color: "#8b5cf6",
    agents: [
      { name: "Nora", role: "AI News", department: "Intelligence", model: "glm-5.1:cloud", slot: "Slot 2", status: "offline" },
      { name: "Harriet", role: "Hermes", department: "Intelligence", model: "glm-5.1:cloud", slot: "Slot 2", status: "online" },
      { name: "Morgan", role: "Models", department: "Intelligence", model: "glm-5.1:cloud", slot: "Slot 2", status: "offline" },
      { name: "Sage", role: "Security", department: "Intelligence", model: "gemma4:31b-cloud", slot: "Slot 3", status: "offline" },
    ],
  },
  {
    id: "dept-operations",
    name: "Operations",
    icon: "⚙️",
    color: "#f97316",
    agents: [
      { name: "Stella", role: "Scheduling", department: "Operations", model: "gemma4:31b-cloud", slot: "Slot 3", status: "offline" },
      { name: "Rachel", role: "Research", department: "Operations", model: "glm-5.1:cloud", slot: "Slot 2", status: "offline" },
      { name: "Wren", role: "Writing", department: "Operations", model: "qwen3.5:397b-cloud", slot: "Slot 1", status: "offline" },
      { name: "Sam", role: "Summary", department: "Operations", model: "gemma4:31b-cloud", slot: "Slot 3", status: "offline" },
      { name: "Travis", role: "Travel", department: "Operations", model: "glm-5.1:cloud", slot: "Slot 2", status: "offline" },
    ],
  },
  {
    id: "dept-analytics",
    name: "Analytics",
    icon: "📊",
    color: "#10b981",
    agents: [
      { name: "Ana", role: "Analysis", department: "Analytics", model: "qwen3.5:397b-cloud", slot: "Slot 1", status: "offline" },
      { name: "Riley", role: "Reporting", department: "Analytics", model: "gemma4:31b-cloud", slot: "Slot 3", status: "offline" },
      { name: "Forrest", role: "Forecasting", department: "Analytics", model: "qwen3.5:397b-cloud", slot: "Slot 1", status: "offline" },
    ],
  },
  {
    id: "dept-research",
    name: "Research",
    icon: "🔬",
    color: "#ec4899",
    agents: [
      { name: "Echo", role: "Experiments", department: "Research", model: "glm-5.1:cloud", slot: "Slot 2", status: "offline" },
      { name: "Evan", role: "Evaluation", department: "Research", model: "qwen3.5:397b-cloud", slot: "Slot 1", status: "offline" },
    ],
  },
];

const OLLAMA_SLOTS = [
  { slot: "Slot 1", model: "qwen3.5:397b-cloud", agents: ["Lasse", "Felix", "Wren", "Ana", "Forrest", "Evan"], color: "bg-blue-500/20 border-blue-500/30" },
  { slot: "Slot 2", model: "glm-5.1:cloud", agents: ["Michael", "Penny", "Nora", "Harriet", "Morgan", "Rachel", "Travis", "Echo"], color: "bg-purple-500/20 border-purple-500/30" },
  { slot: "Slot 3", model: "gemma4:31b-cloud", agents: ["Miles", "Duncan", "Sage", "Stella", "Sam", "Riley"], color: "bg-orange-500/20 border-orange-500/30" },
];

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
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-100">{agent.name}</h3>
          <p className="text-sm text-slate-400">{agent.role}</p>
        </div>
        <StatusBadge status={agent.status} />
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-slate-500">
          <span className="text-slate-600">Model:</span>{" "}
          <span className="text-slate-300">{agent.model}</span>
        </p>
        {agent.slot && (
          <p className="text-xs text-slate-500">
            <span className="text-slate-600">Slot:</span>{" "}
            <span className="text-slate-300">{agent.slot}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function DepartmentSection({ dept }: { dept: Department }) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{dept.icon}</span>
        <div>
          <h2 className="text-xl font-semibold text-slate-100">{dept.name}</h2>
          <p className="text-sm text-slate-400">
            {dept.agents.filter((a) => a.status === "online").length} / {dept.agents.length} online
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dept.agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
}

function OllamaSlotsOverview() {
  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Ollama Cloud Slots</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {OLLAMA_SLOTS.map((slot) => (
          <div key={slot.slot} className={`rounded-lg border p-4 ${slot.color}`}>
            <h3 className="font-semibold text-slate-100">{slot.slot}</h3>
            <p className="mb-3 text-sm text-slate-400">{slot.model}</p>
            <div className="flex flex-wrap gap-1">
              {slot.agents.map((name) => (
                <span
                  key={name}
                  className="rounded bg-black/20 px-2 py-0.5 text-xs text-slate-300"
                >
                  {name}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {slot.agents.length} agents
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgentsPage() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const total = DEPARTMENTS.reduce(
      (sum, dept) => sum + dept.agents.filter((a) => a.status === "online").length,
      0
    );
    setOnlineCount(total);
  }, []);

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-semibold text-slate-100">Agent Roster</h1>
        <p className="mt-2 text-slate-400">
          {onlineCount} / 26 agents online across 5 departments
        </p>
      </div>

      <OllamaSlotsOverview />

      <div className="space-y-6">
        {DEPARTMENTS.map((dept) => (
          <DepartmentSection key={dept.id} dept={dept} />
        ))}
      </div>
    </div>
  );
}
