export function RecentActivityTable({ rows = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/95 shadow-panel">
      <div className="border-b border-amber-100 px-5 py-4">
        <h3 className="font-display text-xl text-brass-900">Recent Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-amber-50 text-left text-brass-700">
            <tr>
              <th className="px-5 py-3 font-semibold">Vehicle</th>
              <th className="px-5 py-3 font-semibold">Violation</th>
              <th className="px-5 py-3 font-semibold">Officer</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-amber-100">
                <td className="px-5 py-3 font-semibold text-brass-900">{row.vehicle_number}</td>
                <td className="px-5 py-3 text-slate-700">{row.violation}</td>
                <td className="px-5 py-3 text-slate-700">{row.officer_name}</td>
                <td className="px-5 py-3 text-slate-700">{row.status}</td>
                <td className="px-5 py-3 text-slate-700">LKR {Number(row.base_amount).toLocaleString()}</td>
                <td className="px-5 py-3 text-slate-700">{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}