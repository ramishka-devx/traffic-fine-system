export function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/95 p-5 shadow-panel">
      <p className="text-xs uppercase tracking-widest text-brass-700">{label}</p>
      <p className="mt-3 font-display text-2xl text-brass-900">{value}</p>
    </div>
  );
}
