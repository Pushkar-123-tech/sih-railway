# RailPlan SIH26027 — Full Stack Final

Architecture: React/Vite frontend → Node.js/Express backend → ML inference API → scikit-learn models + CP-SAT optimizer.

## Services
1. Frontend: http://localhost:5173
2. Node backend: http://localhost:5000
3. ML API: http://localhost:8001

## Start ML API
```powershell
cd ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8001
```

## Start Node backend
```powershell
cd backend
npm install
npm run dev
```

## Start frontend
```powershell
cd frontend
npm install
npm run dev
```

Demo password is `demo123` if username/password login is used. The role selector logs in the corresponding demo user.

The Node backend contains no Python. It calls the separate ML HTTP API. Python is isolated to `ml-service` because the trained scikit-learn artifacts execute in Python.
