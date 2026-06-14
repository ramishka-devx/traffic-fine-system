import { httpClient } from "../../../shared/api/httpClient";

export async function getDashboardOverview() {
  const res = await httpClient("/admin/dashboard");
  return res.data;
}

export async function searchFines(query) {
  if (!query) return [];
  const isReference = query.toUpperCase().startsWith("TF-");
  const params = new URLSearchParams();
  
  if (isReference) {
    params.append("referenceNumber", query.toUpperCase());
  } else {
    params.append("vehicleNumber", query.toUpperCase());
  }

  const res = await httpClient(`/fines/status/verify?${params.toString()}`);
  
  // API returns an array, map it to match RecentActivity format
  const fines = Array.isArray(res.data) ? res.data : [res.data];
  
  return {
    ...res,
    data: fines.map(fine => ({
      id: fine.reference_number,
      reference_number: fine.reference_number,
      violation: fine.category_name,
      base_amount: fine.amount,
      status: fine.status
    }))
  };
}
