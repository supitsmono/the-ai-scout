"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, setToken } from "@/lib/api";

interface User {
  id: number;
  email: string;
  agency_name: string;
  full_name: string;
  email_verified: boolean;
  subscription_status: string;
  is_admin?: boolean;
  trial_ends_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple JWT decode (just for getting payload, no verification)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    setIsLoading(true);
    const token = getToken();
    
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Decode token to check expiration
      const decoded = decodeJWT(token);
      
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        // Token is valid, fetch user data from backend
        try {
          const { getCurrentUser } = await import("@/lib/api");
          const userData = await getCurrentUser();
          setUser(userData);
          // Update localStorage with fresh user data
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (apiError: any) {
          // If API call fails, try to use stored user data
          const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // No stored user data and API failed, clear everything
            removeToken();
            if (typeof window !== "undefined") {
              localStorage.removeItem("user");
            }
            setUser(null);
          }
        }
      } else {
        // Token expired
        removeToken();
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      removeToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { login: loginApi } = await import("@/lib/api");
    const response = await loginApi(email, password);
    
    if (response.success && response.token && response.user) {
      setToken(response.token);
      setUser(response.user);
      // Store user data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    } else {
      throw new Error(response.message || "Login failed");
    }
  };

  const logout = () => {
    removeToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

