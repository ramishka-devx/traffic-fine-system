import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-brass-900 text-amber-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="font-display text-xl tracking-wider text-amber-200">SL POLICE</span>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-brass-700 hover:text-white">
                  Dashboard
                </Link>
                <Link to="/officers" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-brass-700 hover:text-white">
                  Officers
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-amber-100">{user?.badgeNumber}</span>
              <button
                onClick={logout}
                className="rounded-xl border border-brass-700 px-4 py-2 text-sm font-bold transition hover:bg-brass-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
