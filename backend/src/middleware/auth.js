import jwt from 'jsonwebtoken';
import { db } from '../db/store.js';

export function signToken(user){
  return jwt.sign({sub:user.id, role:user.role}, process.env.JWT_SECRET, {expiresIn:'12h'});
}

export function auth(req,res,next){
  const header=req.headers.authorization||'';
  const token=header.startsWith('Bearer ')?header.slice(7):null;
  if(!token) return res.status(401).json({message:'Authentication required'});
  try{
    const payload=jwt.verify(token, process.env.JWT_SECRET);
    const user=db.data.users.find(u=>u.id===payload.sub);
    if(!user) return res.status(401).json({message:'User not found'});
    req.user=user; next();
  }catch{ return res.status(401).json({message:'Invalid or expired token'}); }
}

export function roles(...allowed){
  return (req,res,next)=>allowed.includes(req.user?.role)
    ? next()
    : res.status(403).json({message:'Insufficient role permission'});
}
