import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { maintenance } from "../../data/mockData";
import { Search, Filter, Download } from "lucide-react";

export default function Maintenance() {
  const [q,setQ]=useState("");
  const filtered=maintenance.filter(x=>Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase()));
  return <div><PageHeader title="Maintenance Workbank" subtitle="Unified maintenance, defect and overdue task inventory from TMS, SMMS and TDMS." action={<button className="secondary"><Download size={16}/> Export</button>}/><div className="card"><div className="toolbar"><div className="search inline"><Search size={16}/><input placeholder="Search maintenance..." value={q} onChange={e=>setQ(e.target.value)}/></div><button className="secondary"><Filter size={16}/> Filters</button></div><div className="table-wrap"><table><thead><tr><th>Task</th><th>Source</th><th>Department</th><th>Asset</th><th>Location</th><th>Due</th><th>Criticality</th><th>Duration</th><th>Status</th></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td><b>{x.id}</b><small>{x.type}</small></td><td><span className="source">{x.source}</span></td><td>{x.department}</td><td>{x.asset}</td><td>{x.location}</td><td>{x.due}{x.overdue>0&&<small className="danger-text">{x.overdue}d overdue</small>}</td><td><span className={"badge "+x.criticality.toLowerCase()}>{x.criticality}</span></td><td>{Math.floor(x.duration/60)}h {x.duration%60}m</td><td>{x.status}</td></tr>)}</tbody></table></div></div></div>;
}