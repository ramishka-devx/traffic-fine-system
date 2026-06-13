import { FineLookupForm } from "../components/FineLookupForm";
import { FineDetailsCard } from "../components/FineDetailsCard";
import { PaymentReceipt } from "../components/PaymentReceipt";
import { usePayFine } from "../hooks/usePayFine";

export function PayFinePage() {
  const {
    loadingFine,
    fineDetails,
    error,
    searchFine,
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
          <FineLookupForm onSubmit={searchFine} loading={loadingFine} />
          <FineDetailsCard fineDetails={fineDetails} />
        </div>

        <PaymentReceipt fineDetails={fineDetails} onReset={reset} />
      </div>
    </main>
  );
}
