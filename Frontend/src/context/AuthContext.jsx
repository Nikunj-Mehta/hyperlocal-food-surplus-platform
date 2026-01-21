import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/users/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post("/users/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
  };

  // Register handler
  const register = async (data) => {
    const res = await api.post("/users/register", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);