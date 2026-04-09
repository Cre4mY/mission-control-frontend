export const queryKeys = {
  activities: ["activities"] as const,
  agents: ["agents"] as const,
  departments: ["departments"] as const,
  department: (deptId: string) => ["department", deptId] as const,
  departmentSummary: ["department-summary"] as const,
  departmentStats: (deptId: string) => ["department-stats", deptId] as const,
};

