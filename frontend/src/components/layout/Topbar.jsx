import { Bell, Search, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <header className="topbar">
    <div className="search"><Search size={17}/><input placeholder="Search tasks, assets, corridors, plans..." /></div>
    <div className="top-actions"><button className="icon-btn"><Bell size={19}/><span className="notification-dot"/></button><div className="user-mini"><UserCircle size={30}/><div><b>{user?.name}</b><small>{user?.role}</small></div></div><button className="icon-btn" title="Logout" onClick={() => { logout(); navigate("/login"); }}><LogOut size={18}/></button></div>
  </header>;
}