import { createContext, useState, useEffect } from "react";
import { loginUser, fetchApiKey } from "../api/auth";
import { getItem, setItem, removeItem } from "../utils/storage";

interface AuthContextType {
  user: string | null;
  token: string | null;
  apiKey: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(getItem("user"));
  const [token, setToken] = useState<string | null>(getItem("token"));
  const [apiKey, setApiKey] = useState<string | null>(getItem("apiKey"));

  useEffect(() => {
    if (token && !apiKey) {
      fetchApiKey(token)
        .then((res) => {
          setApiKey(res.key);
          setItem("apiKey", res.key);
        })
        .catch((error) => console.error("Failed to fetch API key:", error));
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    console.log("🔹 Attempting login...");

    try {
      const userData = await loginUser(email, password);

      setToken(userData.accessToken);
      setUser(userData.name);
      setItem("token", userData.accessToken);
      setItem("user", userData.name);

      // Fetch API Key
      const apiKeyResponse = await fetchApiKey(userData.accessToken);
      if (!apiKeyResponse || !apiKeyResponse.key) {
        throw new Error("Failed to fetch API key.");
      }

      console.log("✅ API Key received:", apiKeyResponse.key);
      setApiKey(apiKeyResponse.key);
      setItem("apiKey", apiKeyResponse.key);
    } catch (error) {
      console.error("❌ Login Error:", error);
      throw error;
    }
  };

  const logout = () => {
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
