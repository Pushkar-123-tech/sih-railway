import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wrench, GitBranch, TrainFront, BrainCircuit, CalendarDays, ShieldCheck, Boxes, BarChart3, Plug, Users, Settings, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const groups = [
  { title: "Overview", items: [["/dashboard","Dashboard",LayoutDashboard]] },
  { title: "Maintenance", items: [["/maintenance","Maintenance",Wrench],["/maintenance/defects","Defects",Wrench],["/assets","Assets",Boxes]] },
  { title: "Infrastructure", items: [["/corridors","Corridors",GitBranch],["/corridors/availability","Block Availability",CalendarDays],["/trains","Train Operations",TrainFront],["/trains/goods","Goods Forecast",TrainFront]] },
  { title: "AI Planning", items: [["/planning/create","Generate Block Plan",BrainCircuit],["/planning/optimization","Optimization",BrainCircuit],["/plans/weekly","Weekly Plans",CalendarDays],["/plans/monthly","Monthly Plans",CalendarDays]] },
  { title: "Governance", items: [["/safety","Safety Validation",ShieldCheck],["/analytics","Analytics",BarChart3],["/integrations","Data Integration",Plug],["/settings/users","Users",Users],["/settings","Settings",Settings]] }
];

export default function Sidebar() {
  const { user } = useAuth();
  return <aside className="sidebar">
    <div className="side-brand"><div className="brand-mark small"><TrainFront size={21}/></div><div><b>ABP</b><span>Railway Block Planner</span></div></div>
    <div className="role-chip"><span className="status-dot"/><div><b>{user?.role}</b><small>{user?.department}</small></div></div>
    <nav>{groups.map(g => <div className="nav-group" key={g.title}><div className="nav-heading">{g.title}</div>{g.items.map(([to,label,Icon]) => <NavLink key={to} to={to} className={({isActive}) => "nav-link " + (isActive ? "active" : "")}><Icon size={17}/><span>{label}</span><ChevronRight size={14}/></NavLink>)}</div>)}</nav>
  </aside>;
}