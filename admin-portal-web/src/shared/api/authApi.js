import { httpClient } from "./httpClient";

export async function login(credentials) {
  return await httpClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      badge_number: credentials.badgeNumber,
      password: credentials.password
    }),
  });
}
