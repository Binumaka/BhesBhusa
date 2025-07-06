import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true);


  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true; 
    }
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        console.warn("Token expired");
        logout();
        return;
      }

      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/auth/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = response.data;

          if (data && data._id) {
            localStorage.setItem("user", data._id);
            setUser(data);
            setUserId(data._id);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            logout();
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          logout(); // cleanup if token invalid
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken) => {
    if (!newToken) {
      console.error("Missing token");
      return;
    }

    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserId("");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, user, login, logout, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
