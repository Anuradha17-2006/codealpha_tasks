@echo off
echo.
echo ========================================
echo ConnectSphere Database Seeding Script
echo ========================================
echo.

cd server

if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo 🌱 Seeding database with sample data...
echo.

node seed.js

echo.
pause
