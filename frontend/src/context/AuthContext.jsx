import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 1, username: "admin", password: "admin123", name: "System Administrator", role: "ADMIN", department: "Administration" },
  { id: 2, username: "control", password: "control123", name: "Control Planner", role: "CONTROL_PLANNER", department: "Control Office" },
  { id: 3, username: "engineering", password: "eng123", name: "Engineering Officer", role: "ENGINEERING", department: "Engineering" },
  { id: 4, username: "snt", password: "snt123", name: "S&T Officer", role: "SNT", department: "Signal & Telecommunication" },
  { id: 5, username: "traction", password: "traction123", name: "Traction Officer", role: "TRACTION", department: "Traction Distribution" },
  { id: 6, username: "operator", password: "operator123", name: "Operations Officer", role: "OPERATOR", department: "Operations" }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("abp_user")) || null; }
    catch { return null; }
  });

  const login = (username, password) => {
    const found = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (!found) return { ok: false, message: "Invalid username or password." };
    const safeUser = { id: found.id, name: found.name, role: found.role, department: found.department, username: found.username };
    setUser(safeUser);
    localStorage.setItem("abp_user", JSON.stringify(safeUser));
    return { ok: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("abp_user");
  };

  const value = useMemo(() => ({ user, login, logout, demoUsers: DEMO_USERS }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}