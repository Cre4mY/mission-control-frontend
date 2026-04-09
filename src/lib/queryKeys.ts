export const queryKeys = {
  activities: ["activities"] as const,
  agents: ["agents"] as const,
  departments: ["departments"] as const,
  department: (deptId: string) => ["department", deptId] as const,
  departmentAgents: (deptId: string) => ["department-agents", deptId] as const,
  departmentActivity: (deptId: string, limit: number) => ["department-activity", deptId, limit] as const,
  departmentCards: (deptId: string, limit: number) => ["department-cards", deptId, limit] as const,
  departmentSummary: ["department-summary"] as const,
  departmentStats: (deptId: string) => ["department-stats", deptId] as const,
};

