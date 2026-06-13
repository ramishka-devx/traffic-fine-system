import { httpClient } from "../../../shared/api/httpClient";

const mockDashboard = {
  totals: {
    totalCollectionsLkr: 12750000,
    totalPaidFines: 3450,
    paidToday: 126,
    pendingFines: 540
  },
  districtCollections: [
    { district: "Colombo", collectionLkr: 3800000, paidFines: 920 },
    { district: "Gampaha", collectionLkr: 2150000, paidFines: 612 },
    { district: "Kandy", collectionLkr: 1850000, paidFines: 501 },
    { district: "Galle", collectionLkr: 1200000, paidFines: 380 },
    { district: "Kurunegala", collectionLkr: 950000, paidFines: 312 }
  ],
  categoryBreakdown: [
    { categoryId: "SPD-01", categoryName: "Speeding", collectionLkr: 4200000 },
    { categoryId: "PKG-02", categoryName: "Illegal Parking", collectionLkr: 2650000 },
    { categoryId: "DOC-03", categoryName: "Document Offense", collectionLkr: 1800000 },
    { categoryId: "SIG-04", categoryName: "Signal Violation", collectionLkr: 1600000 }
  ]
};

export async function getDashboardOverview() {
  try {
    // TODO: Replace with real endpoint once backend admin module is ready.
    // Suggested endpoint: GET /admin/dashboard/overview
    return await httpClient("/admin/dashboard/overview");
  } catch (error) {
    return mockDashboard;
  }
}
