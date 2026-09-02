from fastapi import FastAPI
from pydantic import BaseModel
import os, joblib, numpy as np, pandas as pd
from ortools.sat.python import cp_model

BASE=os.path.join(os.path.dirname(__file__),'models')
base_pre=joblib.load(os.path.join(BASE,'base_preprocessor.joblib'))
priority_model=joblib.load(os.path.join(BASE,'priority_model.joblib'))
risk_model=joblib.load(os.path.join(BASE,'risk_model.joblib'))
duration_pre=joblib.load(os.path.join(BASE,'duration_preprocessor.joblib'))
duration_model=joblib.load(os.path.join(BASE,'duration_model.joblib'))

BASE_FEATURES=['department','asset_type','work_type','route','season','criticality','days_overdue','failure_probability','asset_availability_impact','train_density','passenger_trains','goods_trains','historical_failures','last_maintenance_days','route_importance','dependency_count','crew_size','complexity','weather_risk','equipment_required','location_km','corridor_capacity_hours','train_conflict_count','preferred_window_hour','block_feasibility']

class OptimizeBody(BaseModel):
    works: list[dict]
    capacity_hours: float

def frame(data):
    row={k:data.get(k,0) for k in BASE_FEATURES}
    for k in ['department','asset_type','work_type','route','season']:
        row[k]=str(row[k])
    return pd.DataFrame([row])

def duration_frame(data):
    d=frame(data)
    d['crew_equipment_ratio']=d.crew_size/(d.equipment_required+1)
    d['complexity_per_crew']=d.complexity/(d.crew_size+1)
    d['traffic_pressure']=d.train_density*d.route_importance
    d['conflict_pressure']=d.train_conflict_count/(d.corridor_capacity_hours+.5)
    d['maintenance_age_factor']=np.log1p(d.last_maintenance_days)
    d['failure_pressure']=d.failure_probability*(1+d.historical_failures)
    d['availability_pressure']=d.asset_availability_impact*d.route_importance
    d['dependency_pressure']=d.dependency_count*d.complexity
    d['weather_complexity']=d.weather_risk*d.complexity
    d['traffic_complexity']=d.train_density*d.complexity
    d['resource_score']=d.crew_size*d.equipment_required
    work_map={'Rail Joint Renewal':2.8,'Track Geometry Correction':3.5,'Rail Fracture Inspection':2.0,'OHE Insulator Replacement':2.5,'OHE Maintenance':3.2,'Mast Foundation Inspection':2.7,'Signal Cable Inspection':2.2,'Signal Maintenance':2.8,'Point Machine Maintenance':3.0,'BPAC Maintenance':3.4}
    asset_map={'Rail':.3,'Turnout':.8,'Track':.7,'OHE':.6,'Mast':.5,'Signal':.4,'Point Machine':.7,'Cable':.4,'BPAC':.8}
    dept_map={'Engineering':.3,'TRD':.4,'S&T':.35}
    d['work_type_historical_duration']=d.work_type.map(work_map).fillna(3.0)
    d['asset_historical_duration']=d.asset_type.map(asset_map).fillna(.5)
    d['department_historical_duration']=d.department.map(dept_map).fillna(.35)
    return d

def classify_priority(x):
    return 'Critical' if x>=.80 else 'High' if x>=.60 else 'Medium' if x>=.35 else 'Low'

def predict_one(data):
    b=frame(data); be=base_pre.transform(b)
    ps=float(np.clip(priority_model.predict(be)[0],0,1))
    rp=np.asarray(risk_model.predict_proba(be)[0],dtype=float)
    classes=[str(x) for x in risk_model.classes_]
    probs={c:float(v) for c,v in zip(classes,rp)}
    rc=str(risk_model.predict(be)[0]); rs=float(max(probs.values()))
    d=duration_frame(data); de=duration_pre.transform(d); dur=float(max(.25,duration_model.predict(de)[0]))
    return {'priority_score':round(ps,4),'priority_class':classify_priority(ps),'risk_score':round(rs,4),'risk_class':rc,'risk_probabilities':probs,'predicted_duration_hours':round(dur,3),'model_version':'railplan-ml-v2'}

app=FastAPI(title='RailPlan ML Inference API',version='2.0.0')
@app.get('/health')
def health(): return {'status':'ok','service':'railplan-ml','models':['priority','risk','duration']}
@app.post('/predict')
def predict(body: dict): return predict_one(body)
@app.post('/optimize')
def optimize(body: OptimizeBody):
    works=body.works; cap=int(round(body.capacity_hours*100)); m=cp_model.CpModel(); sel=[m.NewBoolVar(f's{i}') for i in range(len(works))]; dur=[max(1,int(round(float(w.get('predicted_duration_hours',2))*100))) for w in works]
    m.Add(sum(dur[i]*sel[i] for i in range(len(works)))<=cap)
    values=[]
    for i,w in enumerate(works):
        if float(w.get('block_feasibility',0))<.35: m.Add(sel[i]==0)
        score=10000*float(w.get('priority_score',0))+5000*float(w.get('asset_availability_impact',0))+2500*float(w.get('block_feasibility',0))-700*float(w.get('train_conflict_count',0))
        values.append(int(score))
    if works: m.Maximize(sum(values[i]*sel[i] for i in range(len(works))))
    s=cp_model.CpSolver(); s.parameters.max_time_in_seconds=5; status=s.Solve(m)
    if status not in (cp_model.OPTIMAL,cp_model.FEASIBLE): return {'selected_work_ids':[],'used_hours':0,'score':0,'explanation':'No feasible combination.'}
    chosen=[works[i] for i in range(len(works)) if s.Value(sel[i])]
    used=sum(float(x.get('predicted_duration_hours',2)) for x in chosen)
    score=(sum(float(x.get('priority_score',0)) for x in chosen)/len(chosen)*100) if chosen else 0
    return {'selected_work_ids':[x['work_id'] for x in chosen],'used_hours':round(used,2),'score':round(score,1),'explanation':'CP-SAT selected a capacity-feasible combination maximizing maintenance priority, asset-availability impact and block feasibility while penalizing train conflicts.'}
