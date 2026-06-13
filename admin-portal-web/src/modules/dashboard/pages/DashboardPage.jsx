import { RecentActivityTable } from "../components/RecentActivityTable";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { DistrictTable } from "../components/DistrictTable";
import { StatCard } from "../components/StatCard";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardPage({ session, onLogout }) {
  const { loading, error, dashboard, reload } = useDashboard(session?.accessToken);

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-brass-900 p-8 text-amber-50 shadow-panel">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-200">Sri Lanka Police</p>
          <h1 className="font-display text-3xl md:text-4xl">Traffic Fine Collection Dashboard</h1>
          <p className="mt-2 text-sm text-amber-100">
            Central overview for district-wise revenue and category-level monitoring.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-amber-100">
            <span className="rounded-full border border-amber-300/30 px-3 py-1">
              Signed in as {session?.user?.name || "Officer"} ({session?.user?.role || "UNKNOWN"})
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-amber-200 px-3 py-1 font-semibold text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <button
          type="button"
          onClick={reload}
          className="rounded-xl border border-brass-700 px-4 py-2 text-sm font-bold text-brass-900 transition hover:bg-brass-50"
        >
          Refresh Data
        </button>

        {loading ? (
          <div className="rounded-2xl bg-white/95 p-8 text-center text-sm text-slate-600 shadow-panel">Loading dashboard...</div>
        ) : null}

        {!loading && dashboard ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Issued"
                value={dashboard.summary.total_issued.toLocaleString()}
              />
              <StatCard label="Total Unpaid" value={dashboard.summary.total_unpaid.toLocaleString()} />
              <StatCard label="Total Paid" value={dashboard.summary.total_paid.toLocaleString()} />
              <StatCard label="Revenue Collected" value={`LKR ${Number(dashboard.summary.revenue_collected).toLocaleString()}`} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <DistrictTable rows={dashboard.district_breakdown} />
              <RecentActivityTable rows={dashboard.recent_activity} />
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
