import { useEffect, useState } from "react";
import { getDashboardOverview } from "../api/dashboardApi";

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboardOverview();
      setDashboard({
        totals: {
          totalCollectionsLkr: data.summary.revenue_collected || 0,
          totalPaidFines: data.summary.total_paid || 0,
          pendingFines: data.summary.total_unpaid || 0,
          totalIssued: data.summary.total_issued || 0
        },
        districtCollections: data.district_breakdown.map(d => ({
          district: d.district,
          paidFines: d.fines,
          collectionLkr: d.revenue
        })),
        recentActivity: data.recent_activity || []
      });
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query) {
    setSearchQuery(query);
    if (!query) {
      setSearchResults(null);
      return;
    }
    
    setSearching(true);
    setError("");
    
    try {
      const { searchFines } = await import("../api/dashboardApi");
      const results = await searchFines(query);
      setSearchResults(results.data || []);
    } catch (err) {
      setError(err.message || "Search failed.");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setSearchResults(null);
    setError("");
  }

  useEffect(() => {
    load();
  }, []);

  return {
    loading,
    error,
    dashboard,
    reload: load,
    searchQuery,
    searchResults,
    searching,
    handleSearch,
    clearSearch
  };
}
