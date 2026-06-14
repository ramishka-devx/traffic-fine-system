import { useState } from "react";
import { RecentActivity } from "../components/RecentActivity";
import { DistrictTable } from "../components/DistrictTable";
import { StatCard } from "../components/StatCard";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardPage() {
  const { 
    loading, error, dashboard, reload,
    searchQuery, searchResults, searching, handleSearch, clearSearch
  } = useDashboard();
  const [searchInput, setSearchInput] = useState("");

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      handleSearch(searchInput.trim());
    }
  };

  const onClearSearch = () => {
    setSearchInput("");
    clearSearch();
  };

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={reload}
            className="rounded-xl border border-brass-700 px-4 py-2 text-sm font-bold text-brass-900 transition hover:bg-brass-50"
          >
            Refresh Data
          </button>

          <form onSubmit={onSearchSubmit} className="flex flex-1 sm:max-w-md items-center gap-2">
            <input
              type="text"
              placeholder="Search by Reference (TF-...) or Vehicle No..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brass-500 focus:outline-none focus:ring-1 focus:ring-brass-500"
            />
            <button
              type="submit"
              disabled={searching || !searchInput.trim()}
              className="rounded-xl bg-brass-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brass-800 disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
            {searchResults && (
              <button
                type="button"
                onClick={onClearSearch}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {loading && !searchResults && !searching ? (
          <div className="rounded-2xl bg-white/95 p-8 text-center text-sm text-slate-600 shadow-panel">Loading dashboard...</div>
        ) : null}

        {!loading && dashboard ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Collection"
                value={`LKR ${dashboard.totals.totalCollectionsLkr.toLocaleString()}`}
              />
              <StatCard label="Total Paid Fines" value={dashboard.totals.totalPaidFines.toLocaleString()} />
              <StatCard label="Total Issued" value={dashboard.totals.totalIssued.toLocaleString()} />
              <StatCard label="Pending Fines" value={dashboard.totals.pendingFines.toLocaleString()} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr,1.5fr]">
              <DistrictTable rows={dashboard.districtCollections} />
              <RecentActivity 
                rows={searchResults || dashboard.recentActivity} 
                title={searchResults ? `Search Results for "${searchQuery}"` : "Recent Activity"}
              />
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
