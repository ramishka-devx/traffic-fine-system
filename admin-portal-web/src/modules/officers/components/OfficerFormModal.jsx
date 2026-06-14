import { useState } from "react";
import { createOfficer } from "../api/officerApi";

export function OfficerFormModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    badgeNumber: "",
    name: "",
    mobileNumber: "",
    password: "",
    role: "OFFICER",
    stationCode: "",
    rank: "CONSTABLE"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createOfficer(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to create officer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-brass-900">Add New Officer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Badge Number</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500"
                value={formData.badgeNumber}
                onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                placeholder="e.g. POL-12345"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500 bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="OFFICER">Officer</option>
                <option value="SENIOR_OFFICER">Senior Officer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mobile Number</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="+94..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Station Code</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500"
                value={formData.stationCode}
                onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                placeholder="e.g. CMB-01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Rank</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Temporary Password</label>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brass-500 focus:ring-1 focus:ring-brass-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brass-700 px-4 py-2 text-sm font-bold text-white hover:bg-brass-900 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Officer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
