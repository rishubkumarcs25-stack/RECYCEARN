@echo off
title Recyearn - Localhost
cd /d "%~dp0"
echo ==========================================
echo Recyearn / RecycEarn - Starting local demo
echo ==========================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install the LTS version from https://nodejs.org/
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installing project dependencies. This may take a few minutes...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection and Node.js installation.
    pause
    exit /b 1
  )
)
echo Starting the website...
echo Keep this window open during your presentation.
call npm run dev
pause
