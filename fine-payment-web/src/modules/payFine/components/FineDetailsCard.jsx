export function FineDetailsCard({ fineDetails }) {
  if (!fineDetails) return null;

  const statusClass =
    fineDetails.status === "PAID"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-panel">
      <h3 className="font-display text-xl text-brand-900">Fine Details</h3>
      <div className="mt-4 grid gap-3 text-sm text-slate-700">
        <p>
          <span className="font-bold text-brand-900">Reference:</span> {fineDetails.reference_number}
        </p>
        <p>
          <span className="font-bold text-brand-900">Category:</span> {fineDetails.category_name}
        </p>
        <p>
          <span className="font-bold text-brand-900">Status:</span>{" "}
          <span className={`rounded-full px-3 py-1 font-bold ${statusClass}`}>{fineDetails.status}</span>
        </p>
        <p className="rounded-lg bg-brand-50 p-3 font-bold text-brand-900">
          Amount to Pay: LKR {Number(fineDetails.amount).toLocaleString()}
        </p>
        <p>
          <span className="font-bold text-brand-900">Due Date:</span> {new Date(fineDetails.due_date).toLocaleDateString()}
        </p>
      </div>
      
      {fineDetails.status !== 'PAID' && (
        <button
          className="mt-6 w-full rounded-lg bg-brand-900 px-4 py-3 font-bold text-white transition-all hover:bg-brand-800"
        >
          Pay Now via PayHere
        </button>
      )}
      
      {fineDetails.status === 'PAID' && (
        <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
          ✓ This fine has been paid
        </div>
      )}
    </div>
  );
}
