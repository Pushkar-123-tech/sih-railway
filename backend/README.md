# RailPlan Node.js Backend

Node.js + Express API. No Python is used in this backend.

It calls the separate ML inference service using HTTP (`ML_SERVICE_URL`).

Data is stored in `backend/data/railplan.json` for zero-configuration local development. The service boundary is ready for PostgreSQL migration.
