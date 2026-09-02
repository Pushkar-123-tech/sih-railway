import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/store.js';
import { signToken, auth } from '../middleware/auth.js';
const r=Router();
r.post('/login',async(req,res)=>{
  const {role,username,password}=req.body||{};
  let user= username ? db.data.users.find(u=>u.username===username) : db.data.users.find(u=>u.role===role);
  if(!user) return res.status(401).json({message:'Invalid login'});
  if(password && !(await bcrypt.compare(password,user.passwordHash))) return res.status(401).json({message:'Invalid credentials'});
  res.json({access_token:signToken(user),token_type:'bearer',user:{id:user.id,role:user.role,display_name:user.display_name}});
});
r.get('/me',auth,(req,res)=>res.json({id:req.user.id,role:req.user.role,display_name:req.user.display_name}));
export default r;
