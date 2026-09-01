export default function PageHeader({title,subtitle,action}) {
  return <div className="page-header"><div><div className="eyebrow">AUTOMATIC BLOCK PLANNING</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}