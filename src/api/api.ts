const BASE_URL = "https://v2.api.noroff.dev";
const HOLIDAZE_PATH = "/holidaze";

export async function fetchData(
  endpoint: string,
  options: RequestInit = {},
  useHolidaze = true,
  requiresAuth = true
) {
  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

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

  const url = `${BASE_URL}${useHolidaze ? HOLIDAZE_PATH : ""}${endpoint}`;
  console.log("Fetching:", url, "Auth Required:", requiresAuth);

  try {
    const response = await fetch(url, { headers, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
