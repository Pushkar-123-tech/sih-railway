@echo off
where py >nul 2>nul
if not errorlevel 1 (
  py -3.11 -m uvicorn app:app --host 0.0.0.0 --port 8001
) else (
  python -m uvicorn app:app --host 0.0.0.0 --port 8001
)
