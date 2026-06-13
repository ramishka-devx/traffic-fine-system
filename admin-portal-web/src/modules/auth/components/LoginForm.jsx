import { useState } from "react";

export function LoginForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    badge_number: "",
    password: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        <section className="rounded-3xl bg-brass-900 p-8 text-amber-50 shadow-panel">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-200">Sri Lanka Police</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">Traffic Fine Collection Dashboard</h1>
          <p className="mt-4 max-w-xl text-sm text-amber-100">
            Log in with your officer badge number to review nationwide collections, district breakdowns, and
            recent fine activity.
          </p>
        </section>

        <form className="rounded-3xl bg-white/95 p-8 shadow-panel" onSubmit={handleSubmit}>
          <h2 className="font-display text-2xl text-brass-900">Officer Login</h2>
          <p className="mt-2 text-sm text-slate-600">Use the credentials issued by the backend user management flow.</p>

          {error ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-brass-900" htmlFor="badge_number">
                Badge Number
              </label>
              <input
                id="badge_number"
                name="badge_number"
                value={form.badge_number}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-amber-100 px-4 py-3 text-sm outline-none transition focus:border-brass-500"
                placeholder="OFF-0001"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-brass-900" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-amber-100 px-4 py-3 text-sm outline-none transition focus:border-brass-500"
                placeholder="Your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-brass-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-brass-900 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}