import bcrypt from 'bcryptjs';
import { db, save } from './store.js';

const roles={admin:'System Administrator',engg:'Engineering Planner',trd:'TRD Planner',snt:'S&T Planner',control:'Control / Senior Engineer',field:'Field User'};
const samples=[
 {work_id:'WR-1042',department:'Engineering',asset_type:'Rail',work_type:'Rail Joint Renewal',route:'PUNE-LNL',season:'Winter',criticality:10,days_overdue:12,failure_probability:.91,asset_availability_impact:.97,train_density:98,passenger_trains:40,goods_trains:13,historical_failures:5,last_maintenance_days:420,route_importance:.95,dependency_count:1,crew_size:8,complexity:.82,weather_risk:.20,equipment_required:3,location_km:72.4,corridor_capacity_hours:5,train_conflict_count:2,preferred_window_hour:2,block_feasibility:.86,status:'Prioritized'},
 {work_id:'WR-1043',department:'TRD',asset_type:'OHE',work_type:'OHE Insulator Replacement',route:'PUNE-LNL',season:'Winter',criticality:8,days_overdue:7,failure_probability:.62,asset_availability_impact:.81,train_density:90,passenger_trains:38,goods_trains:12,historical_failures:3,last_maintenance_days:310,route_importance:.9,dependency_count:2,crew_size:7,complexity:.65,weather_risk:.2,equipment_required:3,location_km:80,corridor_capacity_hours:5,train_conflict_count:3,preferred_window_hour:1,block_feasibility:.81,status:'Window Proposed'},
 {work_id:'WR-1044',department:'S&T',asset_type:'Cable',work_type:'Signal Cable Inspection',route:'KYN-PNVL',season:'Winter',criticality:5,days_overdue:3,failure_probability:.34,asset_availability_impact:.50,train_density:65,passenger_trains:30,goods_trains:8,historical_failures:1,last_maintenance_days:180,route_importance:.7,dependency_count:1,crew_size:5,complexity:.42,weather_risk:.15,equipment_required:2,location_km:110,corridor_capacity_hours:4,train_conflict_count:4,preferred_window_hour:2,block_feasibility:.78,status:'Registered'},
 {work_id:'WR-1045',department:'Engineering',asset_type:'Track',work_type:'Track Geometry Correction',route:'PUNE-MMR',season:'Winter',criticality:9,days_overdue:4,failure_probability:.70,asset_availability_impact:.87,train_density:88,passenger_trains:42,goods_trains:15,historical_failures:4,last_maintenance_days:260,route_importance:.93,dependency_count:3,crew_size:9,complexity:.75,weather_risk:.2,equipment_required:4,location_km:60,corridor_capacity_hours:5,train_conflict_count:3,preferred_window_hour:2,block_feasibility:.83,status:'Executing'},
 {work_id:'WR-1046',department:'S&T',asset_type:'Point Machine',work_type:'Point Machine Maintenance',route:'PUNE-LNL',season:'Winter',criticality:10,days_overdue:10,failure_probability:.88,asset_availability_impact:.94,train_density:82,passenger_trains:35,goods_trains:12,historical_failures:5,last_maintenance_days:500,route_importance:.95,dependency_count:2,crew_size:6,complexity:.70,weather_risk:.15,equipment_required:3,location_km:74,corridor_capacity_hours:5,train_conflict_count:2,preferred_window_hour:1,block_feasibility:.89,status:'Completion Submitted'},
 {work_id:'WR-1047',department:'TRD',asset_type:'Mast',work_type:'Mast Foundation Inspection',route:'DD-PUNE',season:'Winter',criticality:3,days_overdue:2,failure_probability:.18,asset_availability_impact:.32,train_density:45,passenger_trains:20,goods_trains:5,historical_failures:1,last_maintenance_days:100,route_importance:.55,dependency_count:1,crew_size:5,complexity:.30,weather_risk:.25,equipment_required:2,location_km:150,corridor_capacity_hours:4,train_conflict_count:1,preferred_window_hour:3,block_feasibility:.72,status:'Validated'},
 {work_id:'WR-1048',department:'Engineering',asset_type:'Rail',work_type:'Rail Fracture Inspection',route:'KYN-PNVL',season:'Winter',criticality:10,days_overdue:15,failure_probability:.95,asset_availability_impact:.98,train_density:105,passenger_trains:50,goods_trains:20,historical_failures:6,last_maintenance_days:600,route_importance:.97,dependency_count:2,crew_size:7,complexity:.85,weather_risk:.15,equipment_required:4,location_km:92,corridor_capacity_hours:5,train_conflict_count:5,preferred_window_hour:2,block_feasibility:.91,status:'Plan Proposed'}
];

export async function seed(){
  for(const [role,name] of Object.entries(roles)){
    const id=`demo-${role}`;
    if(!db.data.users.some(u=>u.id===id)) db.data.users.push({id,username:id,passwordHash:await bcrypt.hash('demo123',10),role,display_name:name});
  }
  if(db.data.works.length===0){
    for(const w of samples) db.data.works.push({...w,priority_score:w.criticality/10,risk_score:w.failure_probability,predicted_duration_hours:2.5+w.complexity*2+w.equipment_required*.15-w.crew_size*.04});
  }
  if(db.data.plans.length===0){
    db.data.plans.push({plan_id:'BP-2026-091',route:'PUNE-SOL',block_start:'01:00',block_end:'04:00',capacity_hours:3,used_hours:2.6,score:91,status:'Proposed',work_ids:['WR-1042','WR-1043'],explanation:'Integrated candidate generated from maintenance priority, asset impact, feasibility and block capacity.'});
    db.data.plans.push({plan_id:'BP-2026-092',route:'PUNE-MUM',block_start:'02:00',block_end:'04:00',capacity_hours:2,used_hours:1.8,score:96,status:'Awaiting Approval',work_ids:['WR-1046','WR-1043'],explanation:'High criticality integrated candidate awaiting Control approval.'});
    db.data.plans.push({plan_id:'BP-2026-093',route:'KYN-PNVL',block_start:'01:30',block_end:'03:30',capacity_hours:2,used_hours:1.5,score:82,status:'Published',work_ids:['WR-1048'],explanation:'Published maintenance possession.'});
  }
  for(const plan of db.data.plans.filter(p=>p.status==='Published')){
    for(const id of plan.work_ids||[]){
      const work=db.data.works.find(w=>w.work_id===id);
      if(work && !work.assigned_to){
        work.assigned_to='demo-field'; work.assigned_to_name='Field User'; work.scheduled_date=plan.block_date||new Date(Date.now()+86400000).toISOString().slice(0,10); work.scheduled_start=plan.block_start; work.scheduled_end=plan.block_end; work.duration_limit_minutes=Math.max(1,Math.round((work.predicted_duration_hours||1)*60)); work.allocated_asset=work.asset_type;
      }
    }
  }
  const sampleUsers=db.data.users.map(({id,display_name,role})=>({id,display_name,role}));
  db.data.works.forEach((work,index)=>{
    if(!work.assigned_users?.length) work.assigned_users=[sampleUsers[index%sampleUsers.length]];
  });
  await save();
}
