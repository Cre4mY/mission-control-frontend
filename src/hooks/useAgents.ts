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

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: queryKeys.agents,
    queryFn: async () => {
      const data = await apiFetch<{ agents: Agent[] }>("/agents");
      return data.agents || [];
    },
    refetchInterval: 10000, // Poll every 10 seconds
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
