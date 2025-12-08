@echo off
echo ============================================
echo    CarSpot Application Launcher
echo ============================================
echo.

echo Verifying MySQL connection...
timeout /t 2 >nul

echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 >nul

echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ============================================
echo.
echo Press any key to exit this window...
pause >nul
