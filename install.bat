@echo off
echo ============================================
echo    CarSpot Application Setup
echo ============================================
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

cd ..

echo.
echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Configure backend/.env with your MySQL credentials
echo 2. Import carspotSQL.sql into your MySQL database
echo 3. Run start.bat to launch the application
echo.
echo Press any key to exit...
pause >nul
