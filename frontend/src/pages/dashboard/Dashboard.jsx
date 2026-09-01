import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Activity, AlertTriangle, CalendarCheck, Clock3, Gauge, TrainFront, ArrowUpRight, BrainCircuit } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import KPI from "../../components/common/KPI";
import { maintenance, corridors, plans, trains } from "../../data/mockData";

export default function Dashboard() {
  const critical = useMemo(() => maintenance.filter(x => x.criticality === "CRITICAL").length, []);
  return <div>
    <PageHeader title="Operations Dashboard" subtitle="Unified view of maintenance demand, corridor capacity and optimized block planning." action={<Link className="primary button-link" to="/planning/create"><BrainCircuit size={17}/> Generate Plan</Link>} />
    <div className="kpi-grid">
      <KPI label="Asset Availability" value="94.7%" delta="↑ 2.3% vs last week" icon={Gauge}/>
      <KPI label="Pending Maintenance" value="148" delta="23 critical tasks" icon={Activity}/>
      <KPI label="Overdue Tasks" value="31" delta="↓ 8 this week" icon={Clock3} variant="warning"/>
      <KPI label="Block Utilization" value="87.4%" delta="↑ 6.8% optimized" icon={CalendarCheck}/>
      <KPI label="Critical Defects" value={critical || 17} delta="Immediate attention" icon={AlertTriangle} variant="danger"/>
      <KPI label="Planned Blocks" value="64" delta="27 coordinated windows" icon={TrainFront}/>
    </div>
    <div className="grid-2">
      <section className="card"><div className="section-head"><div><h3>Corridor Availability</h3><p>Current infrastructure capacity</p></div><Link to="/corridors">View all <ArrowUpRight size={14}/></Link></div><div className="table-wrap"><table><thead><tr><th>Corridor</th><th>Availability</th><th>Blocks</th><th>Status</th></tr></thead><tbody>{corridors.map(c=><tr key={c.id}><td><b>{c.id}</b> · {c.name}</td><td><div className="progress"><span style={{width:c.availability+"%"}}/></div><small>{c.availability}%</small></td><td>{c.blocks}</td><td><span className={"badge "+c.status.toLowerCase()}>{c.status}</span></td></tr>)}</tbody></table></div></section>
      <section className="card"><div className="section-head"><div><h3>Planning Alerts</h3><p>Items requiring planner attention</p></div></div><div className="alert-list"><div className="alert warning"><AlertTriangle size={18}/><div><b>C2 has high train density</b><span>19 existing blocks; review candidate windows.</span></div></div><div className="alert danger"><AlertTriangle size={18}/><div><b>17 critical defects</b><span>Prioritize safety-critical maintenance.</span></div></div><div className="alert info"><CalendarCheck size={18}/><div><b>5 coordinated opportunities</b><span>Tasks from multiple departments can share a block.</span></div></div></div></section>
    </div>
    <div className="grid-2">
      <section className="card"><div className="section-head"><div><h3>Upcoming Optimized Blocks</h3><p>Next scheduled maintenance windows</p></div><Link to="/plans/weekly">Weekly plan <ArrowUpRight size={14}/></Link></div><div className="block-list">{plans.map(p=><div className="block-row" key={p.id}><div className="date-box"><b>{p.date.slice(8)}</b><small>SEP</small></div><div className="block-main"><b>{p.id} · {p.corridor}</b><span>{p.start}–{p.end} · {p.tasks} tasks · {p.departments.join(", ")}</span></div><span className={"badge "+p.status.toLowerCase().replaceAll(" ","-")}>{p.status}</span></div>)}</div></section>
      <section className="card"><div className="section-head"><div><h3>Train Operations</h3><p>Today's movement affecting block windows</p></div><Link to="/trains">Timetable <ArrowUpRight size={14}/></Link></div><div className="train-list">{trains.slice(0,6).map(t=><div className="train-row" key={t.id}><span className="train-time">{t.time}</span><b>{t.id}</b><span>{t.type}</span><span>{t.corridor}</span><span className={"badge "+t.priority.toLowerCase()}>{t.priority}</span></div>)}</div></section>
    </div>
  </div>;
}