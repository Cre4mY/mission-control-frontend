export const queryKeys = {
  activities: ["activities"] as const,
  departmentSummary: ["department-summary"] as const,
  departmentStats: (deptId: string) => ["department-stats", deptId] as const,
};

