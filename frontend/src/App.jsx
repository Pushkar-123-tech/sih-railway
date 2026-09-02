import React,{useState} from "react";
import {Navigate,Route,Routes,useNavigate,useLocation} from "react-router-dom";
import {ROLES} from "./data/mockData";
import {readText} from "./utils/storage";
import Login from "./pages/auth/Login";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/shared/Dashboard";
import WorkBank from "./pages/shared/WorkBank";
import WorkRegistration from "./pages/shared/WorkRegistration";
import WorkDetails from "./pages/shared/WorkDetails";
import PlanningWorkspace from "./pages/control/PlanningWorkspace";
import CandidateWindows from "./pages/control/CandidateWindows";
import Approvals from "./pages/control/Approvals";
import SafetyReview from "./pages/control/SafetyReview";
import Execution from "./pages/field/Execution";
import CompletionVerification from "./pages/control/CompletionVerification";
import Analytics from "./pages/shared/Analytics";
import Admin from "./pages/admin/Admin";
import DepartmentPlanning from "./pages/shared/DepartmentPlanning";
import NotFound from "./pages/auth/NotFound";
import UserManual from "./pages/auth/UserManual";
const DEMO="railplan_role";
const roleFor=(path)=>Object.entries(ROLES).find(([,r])=>path.startsWith(r.base))?.[0];
function Protected({role,children}){const current=readText(DEMO,"");return current===role?children:<Navigate to="/login" replace/>}
function RoleRoutes({role}){
 const base=ROLES[role].base;
 return <Route element={<Protected role={role}><AppShell role={role}/></Protected>}>
  <Route path={base} element={<Navigate to={`${base}/dashboard`} replace/>}/>
  <Route path={`${base}/dashboard`} element={<Dashboard role={role}/>}/>
  <Route path={`${base}/work-bank`} element={<WorkBank role={role}/>}/>
  <Route path={`${base}/register-work`} element={<WorkRegistration role={role}/>}/>
  <Route path={`${base}/work/:id`} element={<WorkDetails role={role}/>}/>
  <Route path={`${base}/planning`} element={role==="control"?<PlanningWorkspace/>:<DepartmentPlanning role={role}/>}/>
  <Route path={`${base}/candidate-windows`} element={<CandidateWindows role={role}/>}/>
  <Route path={`${base}/safety-review`} element={<SafetyReview role={role}/>}/>
  <Route path={`${base}/approvals`} element={<Approvals/>}/>
  <Route path={`${base}/execution`} element={<Execution role={role}/>}/>
  <Route path={`${base}/completion-verification`} element={<CompletionVerification/>}/>
  <Route path={`${base}/analytics`} element={<Analytics role={role}/>}/>
  <Route path={`${base}/admin`} element={<Admin/>}/>
 </Route>
}
export default function App(){
 return <Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/manual" element={<UserManual/>}/>
  {Object.keys(ROLES).map(r=><React.Fragment key={r}>{RoleRoutes({role:r})}</React.Fragment>)}
  <Route path="/" element={<Navigate to="/login" replace/>}/><Route path="*" element={<NotFound/>}/>
 </Routes>
}
