import { createContext, useState, useEffect } from "react";
import { loginUser, fetchApiKey } from "../api/auth";
import { fetchData } from "../api/api";
import { getItem, setItem, removeItem } from "../utils/storage";

interface User {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt?: string };
  venueManager: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  apiKey: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("❌ Stored user data is not valid JSON, resetting user.");
      removeItem("user"); // Remove corrupted data
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(getItem("token"));
  const [apiKey, setApiKey] = useState<string | null>(getItem("apiKey"));

  useEffect(() => {
    if (token && !apiKey) {
      console.log("🔹 Fetching API Key...");
      fetchApiKey(token)
        .then((res) => {
          console.log("✅ API Key Fetched:", res.key);
          setApiKey(res.key);
          setItem("apiKey", res.key);
        })
        .catch((error) => console.error("❌ Failed to fetch API key:", error));
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    console.log("🔹 Attempting login...");

    try {
      const userData = await loginUser(email, password);
      console.log("🔹 Login API Response:", userData);

      console.log("🔹 Requesting API Key...");
      const apiKeyResponse = await fetchApiKey(userData.accessToken);
      if (!apiKeyResponse || !apiKeyResponse.key) {
        throw new Error("❌ Failed to fetch API key.");
      }

      console.log("✅ API Key received:", apiKeyResponse.key);
      setApiKey(apiKeyResponse.key);
      setItem("apiKey", apiKeyResponse.key);

      console.log("🔹 Fetching Full Profile for:", userData.name);
      const profileResponse = await fetchData(`/profiles/${userData.name}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
          "X-Noroff-API-Key": apiKeyResponse.key,
        },
      });

      console.log("✅ Full Profile Data:", profileResponse.data);

      const formattedUser: User = {
        name: profileResponse.data.name,
        email: profileResponse.data.email,
        bio: profileResponse.data.bio || "No bio provided",
        avatar: profileResponse.data.avatar || {
          url: "https://placehold.co/150",
          alt: "User Avatar",
        },
        venueManager: profileResponse.data.venueManager ?? false,
      };

      console.log("🔹 Storing Updated User Data:", formattedUser);

      setToken(userData.accessToken);
      setUser(formattedUser);
      setItem("token", userData.accessToken);
      setItem("user", JSON.stringify(formattedUser)); // ✅ Store as JSON string
    } catch (error) {
      console.error("❌ Login Error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("🔹 Logging out...");
    setUser(null);
    setToken(null);
    setApiKey(null);
    removeItem("user");
    removeItem("token");
    removeItem("apiKey");
  };

  return (
    <AuthContext.Provider value={{ user, token, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
