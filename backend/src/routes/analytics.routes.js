import { Router } from 'express';
import { db } from '../db/store.js';
import { auth } from '../middleware/auth.js';
const r=Router();r.use(auth);
r.get('/overview',(req,res)=>{const works=db.data.works;const plans=db.data.plans;const byDepartment=Object.fromEntries(['Engineering','TRD','S&T'].map(d=>[d,works.filter(w=>w.department===d).length]));const byStatus={};works.forEach(w=>byStatus[w.status]=(byStatus[w.status]||0)+1);res.json({total_work:works.length,total_plans:plans.length,by_department:byDepartment,by_status:byStatus,avg_predicted_duration_hours:works.length?+(works.reduce((a,w)=>a+(w.predicted_duration_hours||0),0)/works.length).toFixed(2):0});});
r.get('/dashboard',(req,res)=>{const works=db.data.works,plans=db.data.plans;res.json({role:req.user.role,work_count:works.length,critical:works.filter(w=>w.priority_class==='Critical').length,executing:works.filter(w=>w.status==='Executing').length,completion_submitted:works.filter(w=>w.status==='Completion Submitted').length,plans:plans.length,approved_plans:plans.filter(p=>['Approved','Published'].includes(p.status)).length});});
export default r;
