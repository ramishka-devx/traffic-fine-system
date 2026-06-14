import { useEffect, useState } from "react";
import { getOfficers } from "../api/officerApi";
import { OfficerFormModal } from "../components/OfficerFormModal";

export function OfficerListPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadOfficers() {
    setLoading(true);
    try {
      const data = await getOfficers();
      setOfficers(data);
    } catch (err) {
      setError(err.message || "Failed to load officers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOfficers();
  }, []);

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-brass-900">Police Officers</h1>
            <p className="mt-1 text-sm text-slate-500">Manage all registered traffic police officers.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-brass-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-brass-900 transition"
          >
            + Add Officer
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-panel border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Badge Number</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Station</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading officers...</td>
                  </tr>
                ) : officers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No officers found.</td>
                  </tr>
                ) : (
                  officers.map((officer) => (
                    <tr key={officer.id} className="transition hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-brass-900">{officer.badge_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{officer.full_name}</div>
                        <div className="text-xs text-slate-500">{officer.phone_number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{officer.role}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{officer.station_code}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${officer.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {officer.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <OfficerFormModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            loadOfficers();
          }}
        />
      )}
    </main>
  );
}
