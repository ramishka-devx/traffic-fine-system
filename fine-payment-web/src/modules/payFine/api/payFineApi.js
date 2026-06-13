import { httpClient } from "../../../shared/api/httpClient";
export async function lookupFine(referenceNumber) {
  const response = await httpClient(`/payments/fine/${encodeURIComponent(referenceNumber)}`);
  return response.data;
}
