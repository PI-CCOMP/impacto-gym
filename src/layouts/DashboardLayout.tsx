import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="dashboard">
      <Outlet />
    </div>
  );
}
