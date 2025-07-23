@echo off
echo Fixing database responses...
echo.

REM Try to find Node.js
set NODE_EXE=""
if exist "C:\Program Files\nodejs\node.exe" set NODE_EXE="C:\Program Files\nodejs\node.exe"
if exist "C:\Program Files (x86)\nodejs\node.exe" set NODE_EXE="C:\Program Files (x86)\nodejs\node.exe"

if %NODE_EXE%=="" (
    echo Error: Could not find Node.js
    echo Please install Node.js or update the path in this file
    pause
    exit /b 1
)

echo Using Node.js at: %NODE_EXE%
echo.

REM Run the fix
%NODE_EXE% fix-database.js

echo.
echo Press any key to exit...
pause 