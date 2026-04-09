import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../services/apiClient";
import { queryKeys } from "../../../lib/queryKeys";

interface Activity {
  id: number;
  title: string;
  detail: string;
  timestamp: string;
  source: string;
  departmentId?: string;
}

interface ActivityFilters {
  search: string;
  source: string;
  department: string;
  dateFrom: string;
  dateTo: string;
}

const DEFAULT_FILTERS: ActivityFilters = {
  search: "",
  source: "all",
  department: "all",
  dateFrom: "",
  dateTo: "",
};

export function ActivityPage() {
  const [filters, setFilters] = useState<ActivityFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: queryKeys.activityFeed(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.source !== "all") params.set("source", filters.source);
      if (filters.department !== "all") params.set("department", filters.department);
      if (filters.dateFrom) params.set("from", filters.dateFrom);
      if (filters.dateTo) params.set("to", filters.dateTo);
      params.set("limit", limit.toString());
      params.set("offset", ((page - 1) * limit).toString());

      const data = await apiFetch<{ activities: Activity[] }>(`/activity?${params}`);
      return data.activities || [];
    },
    refetchInterval: 30000,
  });

  const { data: sources } = useQuery<string[]>({
    queryKey: ["activity-sources"],
    queryFn: async () => {
      const data = await apiFetch<{ sources: string[] }>("/activity/sources");
      return data.sources || [];
    },
  });

  const { data: departments } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["activity-departments"],
    queryFn: async () => {
      const data = await apiFetch<{ departments: { id: string; name: string }[] }>("/departments");
      return data.departments || [];
    },
  });

  const filteredCount = activities.length;

  const handleFilterChange = (key: keyof ActivityFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const timeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Activity Feed</h1>
        <p className="text-sm text-slate-400">Real-time activity across all departments</p>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search activities..."
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Source</label>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange("source", e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All Sources</option>
              {sources?.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="card">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-slate-700" />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border-l-2 border-white/10 pl-4 py-3 hover:border-sky-500/50 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-200">{activity.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{activity.detail}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="rounded bg-white/5 px-2 py-0.5">{activity.source}</span>
                      <span>{timeAgo(activity.timestamp)}</span>
                      {activity.departmentId && (
                        <span className="rounded bg-sky-500/10 px-2 py-0.5 text-sky-300">
                          {departments?.find((d) => d.id === activity.departmentId)?.name || activity.departmentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            No activities found matching your filters
          </div>
        )}

        {/* Pagination */}
        {activities.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <p className="text-sm text-slate-400">
              Showing {filteredCount} activities
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={activities.length < limit}
                className="rounded border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
