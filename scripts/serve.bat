@echo off
setlocal
chcp 65001 >nul
title Personal Site - Local Server
cd /d "%~dp0.."

set "PORT=8080"

where python >nul 2>nul
if not errorlevel 1 (
    set "CMD=python -m http.server %PORT% --bind 0.0.0.0"
    goto :found
)

where node >nul 2>nul
if not errorlevel 1 (
    set "CMD=node %~dp0server.js"
    goto :found
)

echo [ERROR] Python or Node.js not found. Please install one of them first:
echo   Python: https://www.python.org/downloads/
echo   Node.js: https://nodejs.org/
pause
exit /b 1

:found
echo ============================================
echo   Starting local server on port %PORT%
echo   Local access:  http://localhost:%PORT%
echo   Phone access:  http://YOUR-PC-IP:%PORT%  ^(same WiFi, find IP with ipconfig^)
echo   Stop: close this window or press Ctrl+C
echo ============================================

start /b %CMD%
ping -n 3 127.0.0.1 >nul
start "" "http://localhost:%PORT%"
pause >nul
