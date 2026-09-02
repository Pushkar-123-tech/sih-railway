# RailPlan ML Service

Python is intentionally isolated here. This service loads the trained scikit-learn artifacts and exposes HTTP endpoints consumed by the Node.js backend.

Endpoints:
- GET /health
- POST /predict
- POST /optimize
