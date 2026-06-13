export function CategoryBreakdown({ rows = [] }) {
  const total = rows.reduce((sum, row) => sum + row.collectionLkr, 0);

  return (
    <div className="rounded-2xl bg-white/95 p-5 shadow-panel">
      <h3 className="font-display text-xl text-brass-900">Fine Category Breakdown</h3>
      <div className="mt-4 space-y-3">
        {rows.map((row) => {
          const widthPercent = total ? Math.round((row.collectionLkr / total) * 100) : 0;

          return (
            <div key={row.categoryId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-semibold text-brass-900">
                  {row.categoryName} ({row.categoryId})
                </span>
                <span className="text-slate-700">LKR {row.collectionLkr.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-amber-100">
                <div className="h-full rounded-full bg-brass-500" style={{ width: `${widthPercent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
