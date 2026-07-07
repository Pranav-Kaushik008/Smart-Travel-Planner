import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/me");
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.post("/login", { username, password });
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);
      
      const userRes = await api.get("/me");
      setUser(userRes.data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.detail || "Invalid username or password"
      };
    }
  };

  const register = async (username, email, password, fullName) => {
    setLoading(true);
    try {
      const res = await api.post("/register", {
        username,
        email,
        password,
        full_name: fullName
      });
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);
      
      const userRes = await api.get("/me");
      setUser(userRes.data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.detail || "Registration failed. Try again."
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
