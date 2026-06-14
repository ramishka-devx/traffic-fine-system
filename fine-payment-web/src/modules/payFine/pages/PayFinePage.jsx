import { FineLookupForm } from "../components/FineLookupForm";
import { FineDetailsCard } from "../components/FineDetailsCard";
import { PaymentForm } from "../components/PaymentForm";
import { PaymentReceipt } from "../components/PaymentReceipt";
import { usePayFine } from "../hooks/usePayFine";

export function PayFinePage() {
  const {
    loadingFine,
    submittingPayment,
    fineDetails,
    paymentReceipt,
    error,
    searchFine,
    payFine,
    reset
  } = usePayFine();

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl bg-brand-900 p-8 text-white shadow-panel">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Sri Lanka Police</p>
          <h1 className="font-display text-3xl md:text-4xl">Online Traffic Fine Payment Portal</h1>
          <p className="mt-2 text-sm text-sky-100">
            Quick, secure and official channel to settle traffic fines using your fine sheet details.
          </p>
        </header>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <FineLookupForm key={fineDetails ? fineDetails.referenceNumber : "empty"} onSubmit={searchFine} loading={loadingFine} />
          <FineDetailsCard fineDetails={fineDetails} />
        </div>

        {fineDetails && fineDetails.status === 'PAID' ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center text-emerald-800 shadow-panel">
            <h3 className="font-display text-2xl font-bold">Your Fine is Already Paid</h3>
            <p className="mt-2">Thank you. This fine reference number has already been settled.</p>
          </div>
        ) : fineDetails && !paymentReceipt ? (
          <PaymentForm fineDetails={fineDetails} submitting={submittingPayment} onSubmit={payFine} />
        ) : null}

        <PaymentReceipt receipt={paymentReceipt} onReset={reset} />
      </div>
    </main>
  );
}
