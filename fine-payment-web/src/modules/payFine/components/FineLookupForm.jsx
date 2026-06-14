import { useState } from "react";

export function FineLookupForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    referenceNumber: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ referenceNumber: form.referenceNumber });
  }

  return (
    <form className="space-y-4 rounded-2xl bg-white/95 p-6 shadow-panel" onSubmit={handleSubmit}>
      <h2 className="font-display text-2xl text-brand-900">Find your traffic fine</h2>
      <p className="text-sm text-slate-600">
        Enter the fine reference number printed on your fine sheet.
      </p>

      <div>
        <label className="mb-1 block text-sm font-bold text-brand-900" htmlFor="referenceNumber">
          Fine Reference Number
        </label>
        <input
          id="referenceNumber"
          name="referenceNumber"
          value={form.referenceNumber}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
          placeholder="TF-2026-001245"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "Searching..." : "Search Fine"}
      </button>
    </form>
  );
}

