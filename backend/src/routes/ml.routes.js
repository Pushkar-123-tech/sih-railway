import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { predictMaintenance, mlHealth } from '../services/ml.service.js';
const r=Router(); r.use(auth);
r.get('/health',async(req,res,next)=>{try{res.json(await mlHealth())}catch(e){next(e)}});
r.post('/predict',async(req,res,next)=>{try{res.json(await predictMaintenance(req.body))}catch(e){next(e)}});
export default r;
