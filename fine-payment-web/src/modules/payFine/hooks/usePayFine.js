import { useState } from "react";
import { lookupFine, submitFinePayment } from "../api/payFineApi";

export function usePayFine() {
  const [loadingFine, setLoadingFine] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [fineDetails, setFineDetails] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [error, setError] = useState("");

  async function searchFine(form) {
    setLoadingFine(true);
    setError("");
    setPaymentReceipt(null);

    try {
      const data = await lookupFine(form);
      setFineDetails(data);
    } catch (err) {
      setError(err.message || "Unable to fetch fine details.");
    } finally {
      setLoadingFine(false);
    }
  }

  async function payFine(paymentData) {
    setSubmittingPayment(true);
    setError("");

    try {
      const receipt = await submitFinePayment(paymentData);
      setPaymentReceipt(receipt);
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setSubmittingPayment(false);
    }
  }

  function reset() {
    setFineDetails(null);
    setPaymentReceipt(null);
    setError("");
  }

  return {
    loadingFine,
    submittingPayment,
    fineDetails,
    paymentReceipt,
    error,
    searchFine,
    payFine,
    reset
  };
}
