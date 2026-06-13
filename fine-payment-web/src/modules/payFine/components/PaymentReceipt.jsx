export function PaymentReceipt({ fineDetails, onReset }) {
  if (!fineDetails) return null;

  return (
    <button
      type="button"
      className="rounded-xl bg-brand-900 px-4 py-2 text-sm font-bold text-white hover:bg-brand-800 mx-auto block"
      onClick={onReset}
    >
      Search Another Fine
    </button>
  );
}
