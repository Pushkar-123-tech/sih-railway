import { Router } from 'express';
import { db, save } from '../db/store.js';
import { auth, roles } from '../middleware/auth.js';
const r=Router(); r.use(auth);
const get=(id)=>db.data.works.find(w=>w.work_id===id);
r.post('/:id/start',roles('admin','control','field'),async(req,res)=>{const w=get(req.params.id);if(!w)return res.status(404).json({message:'Work not found'});w.status='Executing';w.execution={started_at:new Date().toISOString(),started_by:req.user.id};await save();res.json(w)});
r.post('/:id/complete',roles('admin','field','control'),async(req,res)=>{const w=get(req.params.id);if(!w)return res.status(404).json({message:'Work not found'});if(req.user.role==='field'&&w.assigned_to!==req.user.id)return res.status(403).json({message:'Work is not allocated to this field user'});const body=req.body||{};if(!String(body.notes||'').trim())return res.status(422).json({message:'Completion notes are required'});if(!Array.isArray(body.evidence)||body.evidence.length===0)return res.status(422).json({message:'At least one completion photograph or evidence item is required'});w.status='Completion Submitted';w.completion={notes:String(body.notes).trim(),actual_duration_minutes:body.actual_duration_minutes||null,evidence:body.evidence.map(item=>({name:item.name,type:item.type,data:item.data})),submitted_at:new Date().toISOString(),submitted_by:req.user.id};await save();res.json(w)});
r.post('/:id/verify',roles('admin','control'),async(req,res)=>{const w=get(req.params.id);if(!w)return res.status(404).json({message:'Work not found'});w.status=req.body?.approved?'Verified':'Completion Submitted';w.verification={...req.body,verified_at:new Date().toISOString(),verified_by:req.user.id};await save();res.json(w)});
export default r;
