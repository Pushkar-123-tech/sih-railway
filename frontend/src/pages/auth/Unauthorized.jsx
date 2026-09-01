import { Link } from "react-router-dom";
export default function Unauthorized() {
  return <div className="center-page"><div className="card"><h2>Access denied</h2><p>Your role does not have permission to open this module.</p><Link className="primary button-link" to="/dashboard">Return to dashboard</Link></div></div>;
}