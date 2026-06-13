export function PaymentReceipt({ receipt, onReset }) {
  if (!receipt) return null;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-panel">
      <h3 className="font-display text-xl text-emerald-900">Payment Successful</h3>
      <p className="mt-2 text-sm text-emerald-800">Payment ID: {receipt.paymentId}</p>
      <p className="mt-1 text-sm text-emerald-800">Paid At: {new Date(receipt.paidAt).toLocaleString()}</p>
      <p className="mt-3 text-sm text-emerald-900">
        Confirmation SMS to the assigned officer will be triggered by backend once the integration endpoint is ready.
      </p>
      <button
        type="button"
        className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-900"
        onClick={onReset}
      >
        Pay Another Fine
      </button>
    </div>
  );
}
