export function RecentActivity({ rows, title = "Recent Activity" }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
        <h3 className="font-display text-lg text-brass-900">{title}</h3>
        <p className="mt-4 text-sm text-slate-500">No recent fines found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
      <h3 className="mb-4 font-display text-lg text-brass-900">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Amount (LKR)</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-brass-900">{row.reference_number}</td>
                <td className="px-4 py-3">{row.violation}</td>
                <td className="px-4 py-3 text-right">{parseFloat(row.base_amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${row.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
