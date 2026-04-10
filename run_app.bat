@echo off
echo =========================================
echo   Starting Enzyme Predictor Web App...
echo =========================================

echo.
echo [1/2] Starting Backend Server (Flask)...
start "EnzymePredict Backend" cmd /k "cd backend && ..\.venv\Scripts\python.exe app.py"

echo [2/2] Starting Frontend Server (React/Vite)...
start "EnzymePredict Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows!
echo.
echo Your frontend will be available at: http://localhost:5173
echo Your backend will be available at: http://localhost:5000
echo.
echo Press any key to close this window...
pause >nul
