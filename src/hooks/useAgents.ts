import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../services/apiClient";
import { queryKeys } from "../lib/queryKeys";

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "online" | "offline" | "busy";
  departmentId: string;
  model?: string;
  xp: number;
  reportsTo?: string;
  children?: number;
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  agentCount?: number;
}

export interface Activity {
  id: number;
  title: string;
  detail: string;
  timestamp: string;
  source: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  column: string;
  priority: string;
  departmentId?: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: queryKeys.agents,
    queryFn: async () => {
      const data = await apiFetch<{ agents: Agent[] }>("/agents");
      return data.agents || [];
    },
    refetchInterval: 10000,
  });
}

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: queryKeys.departments,
    queryFn: async () => {
      const data = await apiFetch<{ departments: Department[] }>("/departments");
      return data.departments || [];
    },
  });
}

export function useDepartment(deptId: string) {
  return useQuery<Department>({
    queryKey: queryKeys.department(deptId),
    queryFn: async () => {
      const data = await apiFetch<Department>(`/departments/${deptId}`);
      return data;
    },
    enabled: !!deptId,
  });
}

export function useDepartmentAgents(deptId: string) {
  return useQuery<Agent[]>({
    queryKey: queryKeys.departmentAgents(deptId),
    queryFn: async () => {
      const allAgents = await apiFetch<{ agents: Agent[] }>("/agents");
      return (allAgents.agents || []).filter((a) => a.departmentId === deptId);
    },
    enabled: !!deptId,
  });
}

export function useDepartmentActivity(deptId: string, limit = 10) {
  return useQuery<Activity[]>({
    queryKey: queryKeys.departmentActivity(deptId, limit),
    queryFn: async () => {
      const data = await apiFetch<{ activities: Activity[] }>(`/activity?department=${deptId}&limit=${limit}`);
      return data.activities || [];
    },
    enabled: !!deptId,
    refetchInterval: 30000,
  });
}

export function useDepartmentCards(deptId: string, limit = 10) {
  return useQuery<KanbanCard[]>({
    queryKey: queryKeys.departmentCards(deptId, limit),
    queryFn: async () => {
      const data = await apiFetch<{ cards: KanbanCard[] }>(`/kanban?department=${deptId}&limit=${limit}`);
      return data.cards || [];
    },
    enabled: !!deptId,
  });
}
