import { useEffect, useState } from "react";
import { getDashboardOverview } from "../api/dashboardApi";

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboardOverview();
      setDashboard(data);
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    loading,
    error,
    dashboard,
    reload: load
  };
}
