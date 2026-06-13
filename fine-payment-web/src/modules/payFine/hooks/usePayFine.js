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
      const payhereParams = await submitFinePayment(paymentData);
      
      if (!window.payhere) {
        throw new Error("PayHere payment gateway is not loaded. Please try again.");
      }

      // Configure PayHere JS SDK callbacks
      window.payhere.onCompleted = async function onCompleted(orderId) {
        console.log("PayHere payment completed:", orderId);
        try {
          // Re-fetch the fine from backend to verify status update
          const verifiedFine = await lookupFine({
            referenceNumber: orderId
          });
          setFineDetails(verifiedFine);
          setPaymentReceipt({
            paymentId: `PAY-${Date.now()}`,
            status: verifiedFine.status,
            paidAt: new Date().toISOString()
          });
        } catch (verifyErr) {
          // Fallback if verification fetch fails
          setPaymentReceipt({
            paymentId: `PAY-${Date.now()}`,
            status: "PAID",
            paidAt: new Date().toISOString()
          });
        } finally {
          setSubmittingPayment(false);
        }
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("PayHere payment modal dismissed");
        setError("Payment process was cancelled by the user.");
        setSubmittingPayment(false);
      };

      window.payhere.onError = function onError(err) {
        console.error("PayHere error:", err);
        setError(err || "PayHere payment gateway error.");
        setSubmittingPayment(false);
      };

      // Launch the payment popup
      window.payhere.startPayment(payhereParams);

    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
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
