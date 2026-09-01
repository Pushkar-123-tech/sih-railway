import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Maintenance from "./pages/maintenance/Maintenance";
import Defects from "./pages/maintenance/Defects";
import Corridors from "./pages/corridor/Corridors";
import BlockAvailability from "./pages/corridor/BlockAvailability";
import TrainSchedule from "./pages/trains/TrainSchedule";
import GoodsForecast from "./pages/trains/GoodsForecast";
import CreatePlan from "./pages/planning/CreatePlan";
import Optimization from "./pages/planning/Optimization";
import WeeklyPlans from "./pages/plans/WeeklyPlans";
import MonthlyPlans from "./pages/plans/MonthlyPlans";
import PlanDetails from "./pages/plans/PlanDetails";
import Integrations from "./pages/integrations/Integrations";
import SafetyValidation from "./pages/safety/SafetyValidation";
import Assets from "./pages/assets/Assets";
import Analytics from "./pages/analytics/Analytics";
import Users from "./pages/settings/Users";
import Settings from "./pages/settings/Settings";
import Unauthorized from "./pages/auth/Unauthorized";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/maintenance/defects" element={<Defects />} />
            <Route path="/corridors" element={<Corridors />} />
            <Route path="/corridors/availability" element={<BlockAvailability />} />
            <Route path="/trains" element={<TrainSchedule />} />
            <Route path="/trains/goods" element={<GoodsForecast />} />
            <Route path="/planning/create" element={<CreatePlan />} />
            <Route path="/planning/optimization" element={<Optimization />} />
            <Route path="/plans/weekly" element={<WeeklyPlans />} />
            <Route path="/plans/monthly" element={<MonthlyPlans />} />
            <Route path="/plans/:id" element={<PlanDetails />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/safety" element={<SafetyValidation />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}