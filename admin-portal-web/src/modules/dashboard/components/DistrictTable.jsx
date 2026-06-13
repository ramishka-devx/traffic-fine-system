export function DistrictTable({ rows = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/95 shadow-panel">
      <div className="border-b border-amber-100 px-5 py-4">
        <h3 className="font-display text-xl text-brass-900">District Wise Collections</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-amber-50 text-left text-brass-700">
            <tr>
              <th className="px-5 py-3 font-semibold">District</th>
              <th className="px-5 py-3 font-semibold">Paid Fines</th>
              <th className="px-5 py-3 font-semibold">Collection (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.district} className="border-t border-amber-100">
                <td className="px-5 py-3 font-semibold text-brass-900">{row.district}</td>
                <td className="px-5 py-3 text-slate-700">{row.paidFines}</td>
                <td className="px-5 py-3 text-slate-700">{row.collectionLkr.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
