const BASE_URL = "https://v2.api.noroff.dev";
const HOLIDAZE_PATH = "/holidaze";

export async function fetchData(
  endpoint: string,
  options: RequestInit = {},
  useHolidaze = true,
  requiresAuth = false
) {
  let token = localStorage.getItem("token");
  let apiKey = localStorage.getItem("apiKey");

  token = token ? token.replace(/^"(.*)"$/, "$1") : null;
  apiKey = apiKey ? apiKey.replace(/^"(.*)"$/, "$1") : null;

  if (requiresAuth && (!token || !apiKey)) {
    throw new Error("Missing authentication credentials");
  }

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (requiresAuth) {
    headers.append("X-Noroff-API-Key", apiKey as string);
    headers.append("Authorization", `Bearer ${token}`);
  }

  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const url = `${BASE_URL}${useHolidaze ? HOLIDAZE_PATH : ""}${endpoint}`;

  try {
    const response = await fetch(url, { headers, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
