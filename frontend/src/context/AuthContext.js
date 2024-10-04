// AuthProvider.js
import React, { createContext, useState, useEffect } from "react";
import { api, authApi, setupInterceptors } from "../api/interceptor";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupInterceptors(refreshToken, handleLogout);
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(() => {
        refreshToken().catch(() => clearInterval(refreshInterval));
      }, 14 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const handleLogout = async () => {
    setUser(null);
    await authApi.post("/logout"); // Clear cookies on the server
  };

  const refreshToken = async () => {
    try {
      const response = await authApi.get("/refresh");
      const userData = response.data.user;
      setUser(userData);
      return response.data; // Returning accessToken as well
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.post("/login", { email, password });
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authApi.post("/signup", { name, email, password });
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout: handleLogout,
    refreshToken,
    checkAuthStatus,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
