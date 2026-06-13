import { LoginForm } from "../modules/auth/components/LoginForm";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { DashboardPage } from "../modules/dashboard/pages/DashboardPage";

export default function App() {
  const { hydrated, session, loading, error, login, logout } = useAuth();

  if (!hydrated) {
    return (
      <main className="min-h-screen px-4 py-10 md:px-8">
        <div className="mx-auto grid min-h-[60vh] max-w-5xl place-items-center rounded-3xl bg-white/70 shadow-panel">
          <p className="text-sm text-slate-600">Loading session...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return <LoginForm onSubmit={login} loading={loading} error={error} />;
  }

  return <DashboardPage session={session} onLogout={logout} />;
}
