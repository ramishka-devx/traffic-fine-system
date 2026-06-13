import { useState } from "react";

export function PaymentForm({ fineDetails, submitting, onSubmit }) {
  const [form, setForm] = useState({
    payerName: "",
    payerPhone: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      amountLkr: fineDetails.amountLkr,
      referenceNumber: fineDetails.referenceNumber,
      categoryId: fineDetails.categoryId
    });
  }

  return (
    <form className="space-y-4 rounded-2xl bg-white/95 p-6 shadow-panel" onSubmit={handleSubmit}>
      <h3 className="font-display text-xl text-brand-900">Payment Information</h3>

      <input
        name="payerName"
        value={form.payerName}
        onChange={handleChange}
        required
        className="w-full rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500"
        placeholder="Full Name"
      />
      <input
        name="payerPhone"
        value={form.payerPhone}
        onChange={handleChange}
        required
        className="w-full rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500"
        placeholder="Phone Number"
      />
      <input
        name="cardNumber"
        value={form.cardNumber}
        onChange={handleChange}
        required
        className="w-full rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500"
        placeholder="Card Number"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          required
          className="rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500"
          placeholder="MM/YY"
        />
        <input
          name="cvv"
          value={form.cvv}
          onChange={handleChange}
          required
          className="rounded-xl border border-sky-100 px-4 py-3 text-sm outline-none focus:border-brand-500"
          placeholder="CVV"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {submitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
