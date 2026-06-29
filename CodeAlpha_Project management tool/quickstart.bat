@echo off
REM Quick Start Script for Projex - Windows

echo.
echo 🚀 Projex - Local Development Setup (Windows)
echo ================================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Node.js not found! Please install Node.js v18+
    echo   Download from: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo ✓ Node.js %%i

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ npm not found!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo ✓ npm %%i

REM Check MySQL
echo Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ MySQL not found! Please install MySQL 8.0+
    echo   Download from: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)
echo ✓ MySQL installed

REM Verify MySQL is running
echo Verifying MySQL is running...
mysql -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ MySQL is not running or not accessible
    echo.
    echo Please start MySQL:
    echo   - Open Services (services.msc) and start "MySQL80"
    echo   - Or run MySQL Command Line Client
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL is running

REM Backend setup
echo.
echo Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
)
echo ✓ Backend dependencies ready

REM Database setup
echo Setting up database...
call npm run generate >nul 2>&1
call npm run migrate -- --skip-generate >nul 2>&1

if %errorlevel% equ 0 (
    echo ✓ Database migrations completed
    
    echo Seeding database with test data...
    call npm run seed >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ Database seeded with test data
    )
) else (
    echo Note: Database setup may need manual attention
)

cd ..

REM Frontend setup
echo.
echo Setting up Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
)
echo ✓ Frontend dependencies ready

cd ..

REM Summary
echo.
echo ================================================
echo ✓ Setup complete!
echo.
echo Next steps:
echo.
echo 1. Start Backend (in Command Prompt 1):
echo    cd backend
echo    npm run dev
echo.
echo 2. Start Frontend (in Command Prompt 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open in browser:
echo    http://localhost:5173
echo.
echo 4. Login with:
echo    Email: admin@projex.com
echo    Password: Password@123
echo.
echo For detailed instructions, see SETUP_LOCAL.md
echo.
pause
