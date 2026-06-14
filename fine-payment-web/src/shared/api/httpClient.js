const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function httpClient(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || (typeof errorData.error === 'string' && errorData.error !== 'fail' ? errorData.error : '') || "Request failed.");
    } else {
      const message = await response.text();
      throw new Error(message || "Request failed.");
    }
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
