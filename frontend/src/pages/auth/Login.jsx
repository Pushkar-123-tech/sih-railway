import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck, TrainFront, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { user, login, demoUsers } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("control");
  const [password, setPassword] = useState("control123");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = e => {
    e.preventDefault();
    const result = login(username.trim(), password);
    if (!result.ok) return setError(result.message);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="login-shell">
      <div className="login-brand">
        <div className="brand-mark"><TrainFront size={30} /></div>
        <div>
          <div className="eyebrow">INDIAN RAILWAYS • SIH26027</div>
          <h1>Automatic Block Planner</h1>
          <p>AI-assisted coordinated maintenance block planning</p>
        </div>
      </div>
      <div className="login-card">
        <div className="login-title">
          <ShieldCheck size={28} />
          <div><h2>Secure Login</h2><span>Sign in with your operational role</span></div>
        </div>
        <form onSubmit={submit}>
          <label>Username<input value={username} onChange={e => setUsername(e.target.value)} /></label>
          <label>Password<div className="password-wrap"><input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} /> <button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
          {error && <div className="alert danger">{error}</div>}
          <button className="primary full" type="submit">Sign in</button>
        </form>
        <div className="demo-box">
          <strong>Demo accounts</strong>
          {demoUsers.map(u => <button key={u.username} onClick={() => { setUsername(u.username); setPassword(u.password); }}>{u.username} · {u.role}</button>)}
        </div>
      </div>
    </div>
  );
}