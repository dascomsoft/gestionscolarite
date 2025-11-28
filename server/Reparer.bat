@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    REPARATION GESTION SCOLAIRITE
echo ========================================
echo.

echo [1/4] Arret des processus...
taskkill /f /im "Gestion Scolarite.exe" >nul 2>&1
taskkill /f /im "electron.exe" >nul 2>&1  
taskkill /f /im "node.exe" >nul 2>&1

echo [2/4] Nettoyage des fichiers temporaires...
if exist "%APPDATA%\gestion-scolarite" (
    rmdir /s /q "%APPDATA%\gestion-scolarite" >nul 2>&1
    if !errorlevel! equ 0 (echo ✓ Dossier APPDATA nettoye) else (echo ✗ Erreur nettoyage APPDATA)
)

if exist "%LOCALAPPDATA%\gestion-scolarite" (
    rmdir /s /q "%LOCALAPPDATA%\gestion-scolarite" >nul 2>&1
    if !errorlevel! equ 0 (echo ✓ Dossier LOCALAPPDATA nettoye) else (echo ✗ Erreur nettoyage LOCALAPPDATA)
)

echo [3/4] Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo [4/4] Reparation terminee!
echo.
echo Vous pouvez maintenant relancer l'application normalement.
echo.

pause