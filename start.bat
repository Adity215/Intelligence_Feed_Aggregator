@echo off
echo Starting AI-Powered Threat Intelligence Feed Aggregator...
echo.

echo Installing dependencies...
cd backend
npm install
echo.

echo Starting backend server...
start "Threat Intelligence Backend" cmd /k "npm start"

echo.
echo Backend server started on http://localhost:5000
echo.
echo Opening frontend in browser...
timeout /t 3 /nobreak >nul
start "" "frontend\index.html"

echo.
echo System is ready! 
echo - Backend: http://localhost:5000
echo - Frontend: Open frontend/index.html in your browser
echo.
echo Press any key to exit this window...
pause >nul
