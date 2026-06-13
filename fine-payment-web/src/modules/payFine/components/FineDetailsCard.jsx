export function FineDetailsCard({ fineDetails }) {
  if (!fineDetails) return null;

  return (
    <div className="rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-panel">
      <h3 className="font-display text-xl text-brand-900">Fine Details</h3>
      <div className="mt-4 grid gap-3 text-sm text-slate-700">
        <p>
          <span className="font-bold text-brand-900">Reference:</span> {fineDetails.referenceNumber}
        </p>
        <p>
          <span className="font-bold text-brand-900">Category:</span> {fineDetails.categoryId}
        </p>
        <p>
          <span className="font-bold text-brand-900">Violation:</span> {fineDetails.violation}
        </p>
        <p>
          <span className="font-bold text-brand-900">Police Officer:</span> {fineDetails.officerName}
        </p>
        <p>
          <span className="font-bold text-brand-900">Station:</span> {fineDetails.stationName}
        </p>
        <p className="rounded-lg bg-brand-50 p-3 font-bold text-brand-900">
          Amount to Pay: LKR {fineDetails.amountLkr?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
