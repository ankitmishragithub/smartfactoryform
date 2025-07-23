@echo off
echo Starting MongoDB Forms Backend...
echo.

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found: 
node --version

echo.
echo Installing dependencies...
npm install

echo.
echo Setting up environment...
set MONGO_URI=mongodb://localhost:27017/formsdb
set PORT=4000

echo.
echo Starting server on port %PORT%...
echo MongoDB URI: %MONGO_URI%
echo.
echo The server will automatically create sample forms and responses if the database is empty.
echo.

npm start

pause 