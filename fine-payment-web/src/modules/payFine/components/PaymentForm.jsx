import { useState } from "react";

export function PaymentForm({ fineDetails, submitting, onSubmit }) {
  const [form, setForm] = useState({
    payerName: "",
    payerPhone: "",
    payerEmail: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      payerName: form.payerName,
      payerPhone: form.payerPhone,
      payerEmail: form.payerEmail,
      amountLkr: fineDetails.amountLkr,
      referenceNumber: fineDetails.referenceNumber,
      categoryId: fineDetails.categoryId
    });
  }

  const isPaid = fineDetails.status === "PAID";

  return (
    <form className="space-y-4 rounded-2xl bg-white/95 p-6 shadow-panel" onSubmit={handleSubmit}>
      <h3 className="font-display text-xl text-brand-900">Payer Information</h3>
      <p className="text-xs text-slate-500">
        Provide contact details for receipt and payment confirmation. You will be redirected to secure PayHere checkout to complete the payment.
      </p>

      <div>
        <label className="mb-1 block text-xs font-bold text-brand-900" htmlFor="payerName">
          Full Name
        </label>
        <input
          id="payerName"
          name="payerName"
          value={form.payerName}
          onChange={handleChange}
          required
          disabled={isPaid}
          className="w-full rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500 disabled:bg-slate-100"
          placeholder="e.g. Saman Perera"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-brand-900" htmlFor="payerPhone">
          Phone Number
        </label>
        <input
          id="payerPhone"
          name="payerPhone"
          value={form.payerPhone}
          onChange={handleChange}
          required
          disabled={isPaid}
          className="w-full rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500 disabled:bg-slate-100"
          placeholder="e.g. 0771234567"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-brand-900" htmlFor="payerEmail">
          Email Address
        </label>
        <input
          id="payerEmail"
          type="email"
          name="payerEmail"
          value={form.payerEmail}
          onChange={handleChange}
          required
          disabled={isPaid}
          className="w-full rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500 disabled:bg-slate-100"
          placeholder="e.g. saman@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || isPaid}
        className="w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isPaid ? "Already Paid" : submitting ? "Initiating Payment..." : "Proceed to Pay LKR " + fineDetails.amountLkr?.toLocaleString()}
      </button>
    </form>
  );
}