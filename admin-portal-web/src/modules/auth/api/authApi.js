import { httpClient } from "../../../shared/api/httpClient";

export async function loginOfficer({ badge_number, password }) {
  const response = await httpClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ badge_number, password })
  });

  return response.data;
}

export async function logoutOfficer(refresh_token) {
  return httpClient("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token })
  });
}