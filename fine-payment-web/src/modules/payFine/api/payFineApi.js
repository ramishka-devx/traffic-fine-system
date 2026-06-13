import { httpClient } from "../../../shared/api/httpClient";

export async function lookupFine({ referenceNumber }) {
  const result = await httpClient(
    `/payments/fine/${encodeURIComponent(referenceNumber)}`
  );
  return result.data;
}

export async function submitFinePayment(payload) {
  const result = await httpClient("/payments/initiate", {
    method: "POST",
    body: JSON.stringify({
      reference_number: payload.referenceNumber,
      payerName: payload.payerName,
      payerPhone: payload.payerPhone,
      payerEmail: payload.payerEmail
    })
  });
  return result.data;
}

