import { useParams } from "react-router-dom";

export function DepartmentPage() {
  const { deptId = "engineering" } = useParams();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="card">
        <p className="text-sm uppercase tracking-[0.28em] text-violet-300/70">
          Department
        </p>
        <h3 className="mt-3 text-2xl font-semibold capitalize">{deptId}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Dynamic department route placeholder. This will later render summary
          metrics and filtered activity for the selected department.
        </p>
      </div>

      <div className="card">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
          Route
        </p>
        <p className="mt-4 text-sm text-slate-300">/departments/{deptId}</p>
      </div>
    </div>
  );
}

