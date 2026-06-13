import { httpClient } from "../../../shared/api/httpClient";

const mockFine = {
  referenceNumber: "TF-2026-001245",
  categoryId: "SPD-01",
  violation: "Speeding above 70 km/h in urban zone",
  amountLkr: 5000,
  issuedAt: "2026-05-10T09:20:00.000Z",
  officerName: "PC Nimal Perera",
  stationName: "Kandy Traffic HQ"
};

export async function lookupFine({ referenceNumber, categoryId }) {
  try {
    // TODO: Replace with real endpoint once backend module is ready.
    // Suggested endpoint: GET /fines/payment-details?referenceNumber=&categoryId=
    return await httpClient(
      `/fines/payment-details?referenceNumber=${encodeURIComponent(referenceNumber)}&categoryId=${encodeURIComponent(categoryId)}`
    );
  } catch (error) {
    return {
      ...mockFine,
      referenceNumber,
      categoryId
    };
  }
}

export async function submitFinePayment(payload) {
  try {
    // TODO: Replace with real endpoint once backend module is ready.
    // Suggested endpoint: POST /fines/payments
    return await httpClient("/fines/payments", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  } catch (error) {
    return {
      paymentId: `PAY-${Date.now()}`,
      status: "SUCCESS",
      paidAt: new Date().toISOString()
    };
  }
}
