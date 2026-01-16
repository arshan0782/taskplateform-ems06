import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

const [loggingOut, setLoggingOut] = useState(false);

const logout = () => {
  setLoggingOut(true);

  setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoggingOut(false);
    navigate("/login", { replace: true });
  }, 1200); //  loader time
};


  return (
    <AuthContext.Provider value={{ user, login, logout, loggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};
