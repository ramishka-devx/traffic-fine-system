export function FineDetailsCard({ fineDetails }) {
  if (!fineDetails) return null;

  const isPaid = fineDetails.status === "PAID";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateString;
    }
  };

  const formattedAmount = parseFloat(fineDetails.amountLkr || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-panel transition-all hover:shadow-lg animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-display text-xl text-brand-900">Fine Details</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${
            isPaid
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {fineDetails.status || "UNKNOWN"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-700">
        <div className="col-span-2 sm:col-span-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Reference</span>
          <span className="font-semibold text-brand-900">{fineDetails.referenceNumber}</span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</span>
          <span className="font-semibold text-brand-900">{fineDetails.categoryId}</span>
        </div>

        <div className="col-span-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Violation</span>
          <span className="font-semibold text-slate-900">{fineDetails.violation}</span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Police Officer</span>
          <span className="font-medium text-slate-900">{fineDetails.officerName}</span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Station</span>
          <span className="font-medium text-slate-900">{fineDetails.stationName}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 border-t border-dashed border-slate-100 pt-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Issued Date</span>
          <span className="text-xs text-slate-800">{formatDate(fineDetails.issuedAt)}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 border-t border-dashed border-slate-100 pt-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</span>
          <span className="text-xs text-rose-600 font-medium">{formatDate(fineDetails.dueDate)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-brand-50 p-4 border border-brand-100/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-brand-800/70">Amount to Pay</span>
          <span className="text-2xl font-bold text-brand-900">LKR {formattedAmount}</span>
        </div>
        {!isPaid && (
          <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-100/50 px-2.5 py-1 rounded-md">
            Settle Payment Below
          </span>
        )}
      </div>
    </div>
  );
}

