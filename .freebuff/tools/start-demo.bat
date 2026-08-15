@echo off
rem Reality FX demo — one-click start (double-click me).
cd /d "%~dp0\..\.."
bash -lc ".freebuff/tools/start-demo.sh"
echo.
pause
