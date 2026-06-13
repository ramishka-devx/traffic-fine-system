import { useState } from "react";
import { lookupFine } from "../api/payFineApi";

export function usePayFine() {
  const [loadingFine, setLoadingFine] = useState(false);
  const [fineDetails, setFineDetails] = useState(null);
  const [error, setError] = useState("");

  async function searchFine(form) {
    setLoadingFine(true);
    setError("");

    try {
      const data = await lookupFine(form.referenceNumber);
      setFineDetails(data);
    } catch (err) {
      setFineDetails(null);
      setError(err.message || "Unable to fetch fine details.");
    } finally {
      setLoadingFine(false);
    }
  }

  function reset() {
    setFineDetails(null);
    setError("");
  }

  return {
    loadingFine,
    fineDetails,
    error,
    searchFine,
    reset
  };
}
