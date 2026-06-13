import { httpClient } from "../../../shared/api/httpClient";
export async function getDashboardOverview(token) {
  const response = await httpClient("/admin/dashboard", {
    token
  });

  return response.data;
}
