# EnzymePredict

A production-ready full-stack web application for scientifically grounded enzyme prediction and food decomposition analysis.

## Stack
- **Frontend:** React + Vite + Tailwind CSS + Framer Motion + Chart.js
- **Backend:** Flask + modular blueprints
- **Database:** SQLite
- **Auth:** JWT-based login

## Project structure

```text
backend/
  app.py
  config.py
  routes/
  logic/
  models/
frontend/
  src/components/
  src/pages/
  src/charts/
  src/layout/
```

## Run locally

### 1) Backend
```powershell
Set-Location .\backend
Copy-Item .env.example .env
..\.venv\Scripts\python.exe app.py
```

### 2) Frontend
```powershell
Set-Location .\frontend
Copy-Item .env.example .env
npm install
npm run dev
```

## Key API endpoints
- `POST /predict-enzyme`
- `POST /predict-decomposition`
- `POST /user/register`
- `POST /user/login`
- `GET /user/history`

## Scientific rules enforced
- No random values
- Temperature stays within biological limits
- Production time is never below 24 hours
- Yield scales with quantity and substrate efficiency
