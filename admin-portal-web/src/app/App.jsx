import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../shared/context/AuthContext";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { Layout } from "./Layout";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { DashboardPage } from "../modules/dashboard/pages/DashboardPage";
import { OfficerListPage } from "../modules/officers/pages/OfficerListPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/officers" element={<OfficerListPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
