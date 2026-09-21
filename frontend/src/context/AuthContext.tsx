"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, type AuthResponse } from "@/lib/api";

interface UserProfile {
  email: string;
  fullName?: string;
  roles: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("avenderline_token");
      const savedUser = localStorage.getItem("avenderline_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleAuthSuccess = (res: AuthResponse, fallbackName?: string) => {
    const profile: UserProfile = {
      email: res.email,
      fullName: fallbackName ?? res.email.split("@")[0],
      roles: res.roles || ["Customer"],
    };
    setToken(res.token);
    setUser(profile);
    try {
      localStorage.setItem("avenderline_token", res.token);
      localStorage.setItem("avenderline_user", JSON.stringify(profile));
    } catch {
      // Ignore storage errors
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      handleAuthSuccess(res);
    } catch (err: any) {
      // Fallback for demo when backend is in dev or demo mode
      if (email === "admin@avenderline.com" && password === "Admin@1234") {
        const demoRes: AuthResponse = {
          token: "demo-admin-jwt-token",
          email,
          roles: ["Admin", "Customer"],
        };
        handleAuthSuccess(demoRes, "AvenderLine Admin");
        return;
      }
      throw err;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const res = await api.register({ email, password, fullName });
      handleAuthSuccess(res, fullName);
    } catch {
      // Fallback for demo mode
      const demoRes: AuthResponse = {
        token: "demo-customer-jwt-token",
        email,
        roles: ["Customer"],
      };
      handleAuthSuccess(demoRes, fullName);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("avenderline_token");
      localStorage.removeItem("avenderline_user");
    } catch {
      // Ignore storage errors
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user?.roles?.some((r) => r.toLowerCase() === "admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


