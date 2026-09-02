import { Router } from 'express';
import crypto from 'node:crypto';
import { db, save } from '../db/store.js';
import { auth, roles } from '../middleware/auth.js';
import { predictMaintenance } from '../services/ml.service.js';
const r=Router(); r.use(auth);
const deptFor={engg:'Engineering',trd:'TRD',snt:'S&T'};
const asNumber=(value, fallback=0)=>{ const n=Number(value); return Number.isFinite(n) ? n : fallback; };
const asText=(value, fallback='') => (typeof value === 'string' && value.trim()) ? value.trim() : fallback;
function sanitizeWorkPayload(body={}) {
	return {
		...body,
		work_id: asText(body.work_id, `WR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`),
		department: asText(body.department, 'Engineering'),
		asset_type: asText(body.asset_type, 'Track'),
		work_type: asText(body.work_type, 'Maintenance Inspection'),
		route: asText(body.route, 'PUNE-MUM'),
		season: asText(body.season, 'Winter'),
		criticality: asNumber(body.criticality, 2),
		days_overdue: Math.max(0, asNumber(body.days_overdue, 0)),
		failure_probability: Math.min(1, Math.max(0, asNumber(body.failure_probability, 0.4))),
		asset_availability_impact: Math.min(1, Math.max(0, asNumber(body.asset_availability_impact, 0.5))),
		crew_size: Math.max(1, asNumber(body.crew_size, 4)),
		complexity: Math.min(1, Math.max(0, asNumber(body.complexity, 0.5))),
		equipment_required: Math.max(1, asNumber(body.equipment_required, 2)),
		block_feasibility: Math.min(1, Math.max(0, asNumber(body.block_feasibility, 0.8))),
	};
}
const normalize=w=>({...w,id:w.work_id,title:w.work_type,corridor:w.route,section:w.route,asset:w.asset_type,criticalityLabel:w.priority_class||({10:'Critical',9:'Critical',8:'High',7:'High',6:'Medium',5:'Medium',4:'Medium',3:'Low',2:'Low',1:'Low'}[w.criticality]||'Medium'),riskPercent:Math.round((w.risk_score||0)*100),durationMinutes:Math.round((w.predicted_duration_hours||0)*60)});
r.get('/',(req,res)=>{let list=[...db.data.works]; if(req.user.role==='field') list=list.filter(w=>w.assigned_to===req.user.id); else if(deptFor[req.user.role]) list=list.filter(w=>w.department===deptFor[req.user.role]); if(req.query.department) list=list.filter(w=>w.department===req.query.department); if(req.query.status) list=list.filter(w=>w.status===req.query.status); res.json(list.map(normalize));});
r.get('/:id',(req,res)=>{const w=db.data.works.find(x=>x.work_id===req.params.id); if(!w)return res.status(404).json({message:'Work item not found'}); res.json(normalize(w));});
r.post('/',roles('admin','engg','trd','snt','control'),async(req,res,next)=>{try{const sanitized=sanitizeWorkPayload(req.body||{}); const prediction=await predictMaintenance(sanitized); const w={...sanitized,...prediction,status:'Prioritized',created_at:new Date().toISOString()}; db.data.works.unshift(w); db.data.audit.push({at:new Date().toISOString(),actor:req.user.id,action:'CREATE_WORK',target:w.work_id}); await save(); res.status(201).json(normalize(w));}catch(e){next(e);}});
r.patch('/:id',async(req,res)=>{const w=db.data.works.find(x=>x.work_id===req.params.id); if(!w)return res.status(404).json({message:'Work item not found'}); if(req.user.role==='field' && w.assigned_to!==req.user.id)return res.status(403).json({message:'Work is not allocated to this field user'}); Object.assign(w,req.body||{}, {updated_at:new Date().toISOString()}); await save(); res.json(normalize(w));});
export default r;
