@echo off
title Forms Backend Server
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║         Forms Backend Server        ║
echo  ╚══════════════════════════════════════╝
echo.

REM Try to find Node.js in common locations
set "NODE_PATH="
for %%i in (
    "C:\Program Files\nodejs\node.exe"
    "C:\Program Files (x86)\nodejs\node.exe"
    "%USERPROFILE%\AppData\Roaming\npm\node.exe"
    "%PROGRAMFILES%\nodejs\node.exe"
) do (
    if exist %%i (
        set "NODE_PATH=%%~i"
        goto :found
    )
)

echo ❌ Node.js not found in common locations
echo.
echo Please install Node.js from: https://nodejs.org/
echo Or manually set the path below in this batch file
echo.
pause
exit /b 1

:found
echo ✅ Found Node.js at: %NODE_PATH%
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Not in backend directory
    echo Please run this from the backend folder
    pause
    exit /b 1
)

echo 🔄 Starting server...
echo.
echo 📝 Server will run at: http://localhost:4000
echo 🌐 Test responses at: http://localhost:4000/api/responses
echo.
echo 🔴 Press Ctrl+C to stop the server
echo.

REM Start the server
"%NODE_PATH%" start-server.js

pause 