export default function KPI({label,value,delta,icon:Icon,variant=""}) {
  return <div className={"kpi " + variant}><div className="kpi-top"><span>{label}</span>{Icon && <Icon size={18}/>}</div><strong>{value}</strong>{delta && <small>{delta}</small>}</div>;
}