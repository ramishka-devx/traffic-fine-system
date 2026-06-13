import { useEffect, useState } from "react";
import { getDashboardOverview } from "../api/dashboardApi";

export function useDashboard(token) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  async function load(currentToken = token) {
    if (!currentToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getDashboardOverview(currentToken);
      setDashboard(data);
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(token);
  }, [token]);

  return {
    loading,
    error,
    dashboard,
    reload: load
  };
}
