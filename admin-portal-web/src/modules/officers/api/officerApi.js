import { httpClient } from "../../../shared/api/httpClient";

export async function getOfficers() {
  const res = await httpClient("/officers");
  return res.data;
}

export async function createOfficer(officerData) {
  const payload = {
    badge_number: officerData.badgeNumber,
    name: officerData.name,
    mobile_number: officerData.mobileNumber,
    password: officerData.password,
    role: officerData.role,
    station_code: officerData.stationCode,
    rank: officerData.rank
  };

  const res = await httpClient("/officers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}
