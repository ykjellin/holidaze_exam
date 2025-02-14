import { fetchData } from "./api";

export async function loginUser(email: string, password: string) {
  console.log("🔹 Attempting to log in with:", email);

  try {
    const response = await fetchData(
      "/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
      false,
      false
    );

    console.log("🔹 Login API Response:", response);

    if (!response || !response.data?.accessToken) {
      throw new Error("Login failed: No access token received.");
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  console.log("🔹 Attempting to register user:", email);

  try {
    const response = await fetchData(
      "/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      },
      false,
      false
    );

    console.log("🔹 Registration Response:", response);

    if (!response || !response.data) {
      throw new Error("Registration failed.");
    }

    return response.data;
  } catch (error) {
    console.error("❌ Registration Error:", error);
    throw error;
  }
}

export async function fetchApiKey(accessToken: string) {
  console.log("🔹 Requesting API Key...");

  try {
    const response = await fetchData(
      "/auth/create-api-key",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      },
      false,
      false
    );

    console.log("🔹 API Key Response:", response);

    if (!response || !response.data?.key) {
      throw new Error("Failed to fetch API key.");
    }

    return response.data;
  } catch (error) {
    console.error("❌ API Key Request Error:", error);
    throw error;
  }
}
