import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ActivityPage } from "./features/activity/pages/ActivityPage";
import { DepartmentPage } from "./features/departments/pages/DepartmentPage";
import { OverviewPage } from "./features/overview/pages/OverviewPage";
import { AgentsPage } from "./features/agents/pages/AgentsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/departments/:deptId" element={<DepartmentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

