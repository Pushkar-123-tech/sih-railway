import os, joblib, numpy as np, pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split

SEED=42; np.random.seed(SEED); N=30000
out='/mnt/data/RailPlan_SIH26027_FULL_STACK_FINAL/ml-service/models'; os.makedirs(out,exist_ok=True)
deps=['Engineering','TRD','S&T']; assets=['Rail','Turnout','Track','OHE','Mast','Signal','Point Machine','Cable','BPAC']; works=['Rail Joint Renewal','Track Geometry Correction','Rail Fracture Inspection','OHE Insulator Replacement','OHE Maintenance','Mast Foundation Inspection','Signal Cable Inspection','Signal Maintenance','Point Machine Maintenance','BPAC Maintenance']; routes=['PUNE-LNL','LNL-KARJAT','KYN-PNVL','PUNE-MMR','DD-PUNE','PUNE-SOL']; seasons=['Summer','Monsoon','Winter']
df=pd.DataFrame({'work_id':[f'WR-{100000+i}' for i in range(N)],'department':np.random.choice(deps,N,p=[.42,.30,.28]),'asset_type':np.random.choice(assets,N),'work_type':np.random.choice(works,N),'route':np.random.choice(routes,N),'season':np.random.choice(seasons,N,p=[.34,.34,.32]),'criticality':np.random.randint(1,5,N),'days_overdue':np.random.poisson(8,N),'failure_probability':np.random.beta(2.2,5,N),'asset_availability_impact':np.random.beta(3,2.5,N),'train_density':np.random.randint(20,105,N),'passenger_trains':np.random.randint(10,65,N),'goods_trains':np.random.randint(2,25,N),'historical_failures':np.random.poisson(2.5,N),'last_maintenance_days':np.random.randint(15,900,N),'route_importance':np.random.uniform(.35,1,N),'dependency_count':np.random.randint(0,7,N),'crew_size':np.random.randint(2,13,N),'complexity':np.random.uniform(.1,1,N),'weather_risk':np.random.uniform(0,1,N),'equipment_required':np.random.randint(1,7,N),'location_km':np.random.uniform(0,250,N),'corridor_capacity_hours':np.random.uniform(2,8,N),'train_conflict_count':np.random.randint(0,20,N),'preferred_window_hour':np.random.choice([0,1,2,3,4,5,22,23],N)})
# targets
priority=(.28*df.criticality/4+.18*df.failure_probability+.18*df.asset_availability_impact+.12*df.route_importance+.10*np.minimum(df.days_overdue/30,1)+.08*np.minimum(df.train_density/100,1)+.06*df.complexity+np.random.normal(0,.02,N)).clip(0,1)
risk=(.42*df.failure_probability+.22*df.asset_availability_impact+.12*df.criticality/4+.10*df.route_importance+.08*df.complexity+.06*np.minimum(df.historical_failures/8,1)+np.random.normal(0,.03,N)).clip(0,1)
risk_class=pd.cut(risk,[-.01,.30,.55,.78,1.01],labels=['Low','Medium','High','Critical']).astype(str)
base={'Rail Joint Renewal':2.8,'Track Geometry Correction':3.5,'Rail Fracture Inspection':2.0,'OHE Insulator Replacement':2.5,'OHE Maintenance':3.2,'Mast Foundation Inspection':2.7,'Signal Cable Inspection':2.2,'Signal Maintenance':2.8,'Point Machine Maintenance':3.0,'BPAC Maintenance':3.4}; ad={'Rail':.3,'Turnout':.8,'Track':.7,'OHE':.6,'Mast':.5,'Signal':.4,'Point Machine':.7,'Cable':.4,'BPAC':.8}; dd={'Engineering':.3,'TRD':.4,'S&T':.35}
dur=df.work_type.map(base)+df.asset_type.map(ad)+df.department.map(dd)+1.5*df.complexity+.18*df.equipment_required+.12*df.dependency_count+.035*df.train_conflict_count+.45*df.weather_risk+.0009*df.location_km-.055*df.crew_size+.0025*df.last_maintenance_days+.10*df.historical_failures+.35*df.failure_probability+.50*df.asset_availability_impact+.15*df.route_importance+.004*df.train_density*df.complexity-.18*np.log1p(df.crew_size)+np.where(df.season=='Monsoon',.35*df.weather_risk,0)+np.random.normal(0,.18,N)
df['duration_hours_actual']=np.clip(dur,.5,12)
# save training csv
df.to_csv('/mnt/data/RailPlan_SIH26027_FULL_STACK_FINAL/backend/data/maintenance_training.csv',index=False)
base_features=[c for c in df.columns if c not in ['work_id','duration_hours_actual']]
cat=df[base_features].select_dtypes(include=['object']).columns.tolist(); num=[c for c in base_features if c not in cat]
pre=ColumnTransformer([('cat',OneHotEncoder(handle_unknown='ignore',sparse_output=False),cat),('num','passthrough',num)])
X=df[base_features]; Xenc=pre.fit_transform(X)
Xtr,Xte,ytr,yte=train_test_split(Xenc,priority,test_size=.2,random_state=SEED)
priority_model=HistGradientBoostingRegressor(max_iter=350,learning_rate=.04,max_leaf_nodes=31,l2_regularization=1,random_state=SEED).fit(Xtr,ytr)
Xtr,Xte,ytr,yte=train_test_split(Xenc,risk_class,test_size=.2,random_state=SEED,stratify=risk_class)
risk_model=RandomForestClassifier(n_estimators=350,max_depth=20,min_samples_leaf=2,class_weight='balanced_subsample',random_state=SEED,n_jobs=-1).fit(Xtr,ytr)
# duration uses engineered features
D=df[base_features].copy(); D['crew_equipment_ratio']=D.crew_size/(D.equipment_required+1); D['complexity_per_crew']=D.complexity/(D.crew_size+1); D['traffic_pressure']=D.train_density*D.route_importance; D['conflict_pressure']=D.train_conflict_count/(D.corridor_capacity_hours+.5); D['maintenance_age_factor']=np.log1p(D.last_maintenance_days); D['failure_pressure']=D.failure_probability*(1+D.historical_failures); D['availability_pressure']=D.asset_availability_impact*D.route_importance; D['dependency_pressure']=D.dependency_count*D.complexity; D['weather_complexity']=D.weather_risk*D.complexity; D['traffic_complexity']=D.train_density*D.complexity; D['resource_score']=D.crew_size*D.equipment_required
D['work_type_historical_duration']=D.work_type.map(base).fillna(3); D['asset_historical_duration']=D.asset_type.map(ad).fillna(.5); D['department_historical_duration']=D.department.map(dd).fillna(.35)
dcat=D.select_dtypes(include=['object']).columns.tolist(); dnum=[c for c in D.columns if c not in dcat]; dpre=ColumnTransformer([('cat',OneHotEncoder(handle_unknown='ignore',sparse_output=False),dcat),('num','passthrough',dnum)])
DE=dpre.fit_transform(D); Xt,Xv,yt,yv=train_test_split(DE,df.duration_hours_actual,test_size=.2,random_state=SEED)
duration_model=HistGradientBoostingRegressor(max_iter=500,learning_rate=.035,max_leaf_nodes=31,min_samples_leaf=15,l2_regularization=1,random_state=SEED).fit(Xt,yt)
joblib.dump(pre,f'{out}/base_preprocessor.joblib'); joblib.dump(priority_model,f'{out}/priority_model.joblib'); joblib.dump(risk_model,f'{out}/risk_model.joblib'); joblib.dump(dpre,f'{out}/duration_preprocessor.joblib'); joblib.dump(duration_model,f'{out}/duration_model.joblib')
print('Exported models to',out)
